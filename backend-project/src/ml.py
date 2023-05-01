import pandas as pd
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.linear_model import LogisticRegression
import shap
from sklearn.metrics import accuracy_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA


def load_df():
    # df = pd.read_csv('backend-project/data/dataset.csv')
    df = pd.read_csv('data/dataset.csv')
    df = df[df['company'] == 'C']
    df = df.drop(['company'], axis=1)

    return df


def prepare_dataset(df):
    bool_cols = ['ind-debateclub', 'ind-programming_exp', 'ind-international_exp',
                 'ind-entrepeneur_exp', 'ind-exact_study', 'decision']
    df[bool_cols] = df[bool_cols].astype(int)

    scaler = MinMaxScaler()
    df[['age', 'ind-university_grade']
       ] = scaler.fit_transform(df[['age', 'ind-university_grade']])

    cat_cols = ['gender', 'nationality', 'sport', 'ind-degree']
    df = pd.get_dummies(df, columns=cat_cols)

    return df


original_df = load_df()
ml_dataset = prepare_dataset(original_df.copy())


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
        ["bias", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "bias", "bias", "bias", "bias", "bias", "bias",
            "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "meta", "meta", "meta"],
        ['age', 'university_grade', 'debateclub', 'programming_exp',
         'international_exp', 'entrepeneur_exp', 'languages',
         'exact_study', 'gender', 'gender', 'gender',
         'nationality', 'nationality', 'nationality',
         'sport', 'sport', 'sport', 'sport', 'sport',
         'sport', 'sport', 'sport', 'degree',
         'degree', 'degree', 'meta', 'meta',
         'meta'],
        shap_df.columns.values]
    multiindex = pd.MultiIndex.from_arrays(multiindex_vals)
    shap_df.columns = multiindex

    return shap_df


def build_scatterplot_data(shap_df):
    scatter_df = pd.DataFrame()
    scatter_df["bias"] = shap_df.loc[:,
                                     ("bias", slice(None), slice(None))].sum(axis=1)
    scatter_df["qualification"] = shap_df.loc[:,
                                              ("fair", slice(None), slice(None))].sum(axis=1)
    scatter_df["id"] = shap_df.loc[:, (slice(None), slice(None), "Id")]

    sensitive_attributes = shap_df.loc[:, ("bias", slice(None), slice(None))]
    #scaler = StandardScaler()
    #scaled_data = scaler.fit_transform(sensitive_attributes)
    pca = PCA(n_components=2)
    reduced = pca.fit_transform(sensitive_attributes)
    scatter_df["bias_dimred_x"] = reduced[:, 0]
    scatter_df["bias_dimred_y"] = reduced[:, 1]

    scatter_df = pd.merge(scatter_df, original_df,
                          left_on="id", right_on="Id", how="inner")
    scatter_df = scatter_df.drop(columns=["Id"])

    return scatter_df


def build_totals(shap_df: pd.DataFrame):
    bias_df = shap_df.loc[:, ("bias", slice(None), slice(None))]
    bias_groups = bias_df.columns.get_level_values(1).unique()

    bias_total_influence = 0
    groups = shap_df.columns.get_level_values(1).unique().to_list()
    groups.remove("meta")
    influence_tmp = []
    for group in groups:
        subdf = shap_df.loc[:, (slice(None), group, slice(None))]
        current_influence = subdf.abs().sum(axis=1).mean()
        influence_tmp.append(current_influence)
    influence_tmp = (np.array(influence_tmp) /
                     np.array(influence_tmp).sum()).tolist()

    influence = []
    fairness = []
    for group, current_influence in zip(groups, influence_tmp):
        influence.append({"label": group, "value": current_influence})
        if group in bias_groups:
            bias_total_influence += current_influence
            current_fairness = 100 - round(current_influence * 100)
            fairness.append({"label": group, "value": current_fairness})

    overallscore = 100 - round(bias_total_influence * 100)

    return {
        "influence": influence,
        "groupfairness": fairness,
        "overallscore": overallscore
    }


def build_reconsider(scatter_df: pd.DataFrame):
    filter = scatter_df[scatter_df['decision'] == 0].sort_values(
        "qualification", ascending=False)
    df = filter.head(3)
    return df


def build_similarpeople():
    ids = ml_dataset["Id"]
    X = ml_dataset.drop(columns=["decision", "Id"])
    X = X.drop(columns=["age", "gender_female", 'gender_male',
                        'gender_other', 'nationality_Belgian',
                        'nationality_Dutch', 'nationality_German'])
    similarities = cosine_similarity(X)
    np.fill_diagonal(similarities, -1)
    closest = np.argmax(similarities, axis=1)
    result = {}

    for index, neighbor in enumerate(closest):
        result[ids.iloc[index]] = {"1": ids.iloc[neighbor]}

    return result

def ignore_person(id):
    global original_df
    global ml_dataset
    original_df = original_df.drop(original_df[original_df["Id"] == id].index)
    ml_dataset = ml_dataset.drop(ml_dataset[ml_dataset["Id"] == id].index)

def train_ml_model():
    shap_df = get_shap_values()
    scatter_df = build_scatterplot_data(shap_df)
    reconsider = build_reconsider(scatter_df)
    totals = build_totals(shap_df)
    similar_people = build_similarpeople()

    return (scatter_df, similar_people, reconsider, totals)
