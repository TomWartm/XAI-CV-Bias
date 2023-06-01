import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from Dataset import DatasetPreprocessor
import shap

df = pd.read_csv('Machine Learning/Dataset.csv')

preprocessor = DatasetPreprocessor('Machine Learning/Dataset.csv')
preprocessor.clean_data('B')
preprocessor.generate_fake_names_and_surnames()
#preprocessor.scale_data('MinMaxScaler')  # May not be necessary for Random Forest
preprocessor.one_hot_encode(['gender', 'nationality', 'sport', 'ind-degree'])

names_surnames = preprocessor.df[['name', 'surname']].copy()  # Preserve these columns for later use
X = preprocessor.df.drop(['name', 'surname', 'decision'], axis=1)
y = preprocessor.df['decision']

X_train_val, X_test, y_train_val, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_train_val, y_train_val, test_size=0.2, random_state=42)

# Create the model
rf = RandomForestClassifier(n_estimators=100, random_state=42)

# Train the model
rf.fit(X_train, y_train)

# Import TreeExplainer
from shap import TreeExplainer

# Create a Tree explainer
explainer = TreeExplainer(rf)

# Calculate SHAP values for the test set
shap_values = explainer.shap_values(X_test)

# The shap_values object is a list with two arrays for the two classes.
# We take the difference to get the SHAP values for the positive class
shap_values = shap_values[1] - shap_values[0]

# Convert the SHAP values to a DataFrame
shap_df = pd.DataFrame(shap_values, columns=X.columns)

# Add a column for the bias score
shap_df["bias_score"] = shap_df.sum(axis=1)

# Reset index for concatenation
X_test = X_test.reset_index(drop=True)

# Concatenate with the original test dataset
df_with_shap = pd.concat([X_test, shap_df], axis=1)

# Get corresponding 'name', 'surname' for test dataset
names_surnames_test = names_surnames.iloc[X_test.index, :]

# Reset index for concatenation
names_surnames_test = names_surnames_test.reset_index(drop=True)

# Concatenate with 'name', 'surname'
df_with_shap = pd.concat([names_surnames_test, df_with_shap], axis=1)

print(df_with_shap.head())
