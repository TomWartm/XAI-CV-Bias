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

    multiindex_vals = [
        ["bias", "fair", "fair","fair","fair","fair","fair","fair","bias", "bias", "bias", "bias", "bias", "bias", "fair","fair","fair","fair","fair","fair","fair","fair","fair","fair","fair","meta", "meta", "meta"],
        ['age', 'university_grade', 'debateclub', 'programming_exp',
        'international_exp', 'entrepeneur_exp', 'languages',
        'exact_study', 'gender', 'gender', 'gender',
        'nationality', 'nationality', 'nationality',
        'sport', 'sport', 'sport', 'sport', 'sport',
        'sport', 'sport', 'sport', 'degree',
        'degree', 'degree', 'Id', 'predicted_decision',
        'actual_decision'],
        shap_df.columns.values]
    multiindex = pd.MultiIndex.from_arrays(multiindex_vals)
    shap_df.columns = multiindex
    
    return shap_df

def build_scatterplot_data(shap_df):
    scatter_df = pd.DataFrame()
    scatter_df["bias"] = shap_df.loc[:, ("bias", slice(None), slice(None))].sum(axis=1)
    scatter_df["qualification"] = shap_df.loc[:, ("fair", slice(None), slice(None))].sum(axis=1)
    scatter_df["id"] = shap_df.loc[:, (slice(None), slice(None), "Id")]
    scatter_df["decision"] = shap_df.loc[:, (slice(None), slice(None), "actual_decision")].astype(bool)

    return scatter_df

def build_influence_df(shap_df):
    pass

def build_totals(shap_df: pd.DataFrame):
    bias_df = shap_df.loc[:, ("bias", slice(None), slice(None))]
    bias_groups = bias_df.columns.get_level_values(1).unique()

    groups = []
    overallscore = 0
    for bias_group in bias_groups:
        subdf = bias_df.loc[:, (slice(None), bias_group, slice(None))]
        current = subdf.abs().sum(axis=1).mean()
        current = max(100 - 100 * current, 0)
        groups.append({"label": bias_group, "value": current})
        overallscore += current
    overallscore /= len(bias_groups)

    return {
        "groups": groups,
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
    