import pandas as pd
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LogisticRegression
import shap
from sklearn.metrics import accuracy_score
from sklearn.metrics.pairwise import cosine_similarity

def prepare_dataset():
    df = pd.read_csv('backend-project/data/dataset.csv')
    df = df[df['company'] == 'B']
    df = df.drop(['company'], axis=1)

    bool_cols = ['ind-debateclub', 'ind-programming_exp', 'ind-international_exp', 'ind-entrepeneur_exp', 'ind-exact_study', 'decision']
    df[bool_cols] = df[bool_cols].astype(int)

    scaler = MinMaxScaler()
    df[['age', 'ind-university_grade']] = scaler.fit_transform(df[['age', 'ind-university_grade']])

    cat_cols = ['gender', 'nationality', 'sport', 'ind-degree']
    df = pd.get_dummies(df, columns=cat_cols)

    return df

ml_dataset = prepare_dataset()

def get_shap_values():
    ids = ml_dataset["Id"]
    X = ml_dataset.drop(columns=["decision", "Id"])
    y = ml_dataset["decision"]


    model = LogisticRegression(max_iter=1000)
    model.fit(X, y)
    y_pred = model.predict(X)
    accuracy = accuracy_score(y, y_pred)
    print(f"Logistic Regression accuracy: {accuracy:.4f}")
    explainer = shap.Explainer(model, X)
    shap_values = explainer(X)

    shap_df = pd.DataFrame(shap_values.values, columns=X.columns)
    shap_df["Id"] = ids.values
    shap_df['predicted_decision'] = y_pred
    shap_df["actual_decision"] = y.values
    return shap_df

def build_scatterplot_data(shap_df):
    bias_columns = ["age", 
                    "gender_female",
                    "gender_male",
                    "gender_other",
                    "nationality_Belgian",
                    "nationality_Dutch",
                    "nationality_German"]
    fair_columns = list(set(shap_df.columns).difference(bias_columns))

    scatter_df = pd.DataFrame()
    scatter_df["bias"] = shap_df[bias_columns].sum(axis=1)
    scatter_df["qualification"] = shap_df[fair_columns].sum(axis=1)
    scatter_df["id"] = shap_df["Id"]
    scatter_df["decision"] = shap_df["actual_decision"].astype(bool)

    # Make this look nicer. Remove later
    df_decision_0 = scatter_df.loc[scatter_df['decision'] == True].head(100)
    df_decision_1 = scatter_df.loc[scatter_df['decision'] == False].head(100)
    scatter_df = pd.concat([df_decision_0, df_decision_1])
    scatter_df["bias"] = scatter_df["bias"] * 20


    return scatter_df


def build_totals(shap_df):
    age = (shap_df["age"] ** 2).sum()
    gender = (shap_df[["gender_female","gender_male","gender_other"]] ** 2).sum().sum()
    nationality = (shap_df[["nationality_Belgian","nationality_Dutch","nationality_German"]] ** 2).sum().sum()
    overallscore = age + gender + nationality

    return {
        "groups": [{"label": "Age", "value": age}, 
                   {"label": "Gender", "value": gender},
                   {"label": "Nationality", "value": nationality}],
        "overallscore": overallscore
    }

def build_reconsider(scatter_df: pd.DataFrame):
    filter = scatter_df[scatter_df['decision'] == 0].sort_values("qualification", ascending=False)
    df = filter.head(3)
    return df

def build_similarpeople():
    ids = ml_dataset["Id"]
    X = ml_dataset.drop(columns=["decision", "Id"])
    similarities = cosine_similarity(X)
    result = {}

    n = len(X)
    for index1 in range(n):
        min = 1
        minIndex = 0
        for index2 in range(n):
            if (index1 != index2):
                similarity = similarities[index1, index2]
                if similarity < min:
                    min = similarity
                    minIndex = index2
        result[ids.iloc[index1]] = {"1": ids.iloc[minIndex]}

    return result


def train_ml_model():
    shap_df = get_shap_values()
    scatter_df = build_scatterplot_data(shap_df)
    reconsider = build_reconsider(scatter_df)
    totals = build_totals(shap_df)
    similar_people = build_similarpeople()

    return (scatter_df, similar_people, reconsider, totals)
    