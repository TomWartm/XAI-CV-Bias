import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from umap import UMAP
from sklearn.preprocessing import MinMaxScaler, StandardScaler

# Load the dataset
df = pd.read_csv('Machine Learning/Dataset.csv')
df = df[df['company'] == 'A']
df = df.drop(['Id', 'company'], axis=1)

# Convert boolean columns to integers (0 or 1)
bool_cols = ['ind-debateclub', 'ind-programming_exp', 'ind-international_exp', 'ind-entrepeneur_exp', 'ind-exact_study', 'decision']
df[bool_cols] = df[bool_cols].astype(int)

# Scale the 'ind-university_grade' columns using MinMaxScaler
scaler = MinMaxScaler()
df[['ind-university_grade']] = scaler.fit_transform(df[['ind-university_grade']])

# Perform one-hot encoding on categorical variables
cat_cols = ['gender', 'nationality', 'sport', 'ind-degree']
df = pd.get_dummies(df, columns=cat_cols)



# Select sensitive attributes
sensitive_attributes = df[['gender_male', 'gender_female', 'nationality_Dutch', 'nationality_German']] # Add or modify the columns based on your dataset


# Standardize the data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(sensitive_attributes)

# Dimensionality reduction methods
methods = {
    'PCA': PCA(n_components=2),
    't-SNE': TSNE(n_components=2, init='pca', learning_rate='auto'),
    'UMAP': UMAP(n_components=2)
}

# Color palette for the age groups
palette = sns.color_palette("bright", len(df['age'].unique()))

# Plot the results
fig, axs = plt.subplots(1, 3, figsize=(20, 5))
for i, (name, method) in enumerate(methods.items()):
    reduced_data = method.fit_transform(scaled_data)
    sns.scatterplot(x=reduced_data[:, 0], y=reduced_data[:, 1], hue=df['age'], palette=palette, ax=axs[i], legend="full")
    axs[i].set_title(name)
    axs[i].set_xlabel('Component 1')
    axs[i].set_ylabel('Component 2')
plt.legend(title='Age', loc='upper right')
plt.show()
