import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn import preprocessing
import numpy as np

df = pd.read_csv("Data-Analysis/Dataset.csv")

# Look only at company A
df = df[df['company'] == "B"]
df = df.drop("company", axis=1)
df = df.drop("Id", axis=1)

for s in ["ind-debateclub", "ind-programming_exp", "ind-international_exp", 
          "ind-entrepeneur_exp", "ind-exact_study", "decision"]:
    df[s] = df[s].map({True: 1, False: -1})
df = pd.get_dummies(df, ["gender: ", "nationality: ", "sport: ", "ind-degree: "],
                    columns=["gender", "nationality", "sport", "ind-degree"])

pd.set_option("display.max_columns", None)

df_train = df.drop("decision", axis=1)
X = df_train.to_numpy()
X = preprocessing.StandardScaler().fit(X).transform(X)
y = df["decision"].to_numpy()

# Train a logistic regression model on the entire dataset
lr = LogisticRegression()
lr.fit(X, y)

y_pred = lr.predict(X)
accuracy = accuracy_score(y, y_pred)
print("Accuracy:", accuracy)

coef_df = pd.DataFrame(lr.coef_, columns=df_train.columns)

print(coef_df)