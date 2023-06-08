import pandas as pd
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.linear_model import LogisticRegression
import shap
from sklearn.metrics import accuracy_score
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.ensemble import RandomForestClassifier
from shap import TreeExplainer
from faker import Faker

SUBSET_FRAC = 0.8#0.6

def load_df():
    df = pd.read_csv('backend-project/data/dataset.csv')
    df = df[df['company'] == 'C']
    df = df.drop(['company'], axis=1)

    np.random.seed(0)
    accepted = df[df["decision"] == True].sample(frac=SUBSET_FRAC)
    rejected = df[df["decision"] == False].sample(frac=SUBSET_FRAC)
    df = pd.concat([accepted, rejected])

    return df

def prepare_dataset(df):
    fake = Faker()

    bool_cols = ['ind-debateclub', 'ind-programming_exp', 'ind-international_exp',
                 'ind-entrepeneur_exp', 'ind-exact_study', 'decision']
    df[bool_cols] = df[bool_cols].astype(int)

    cat_cols = ['gender', 'nationality', 'sport', 'ind-degree']
    df = pd.get_dummies(df, columns=cat_cols)

    df['name'] = [fake.first_name_male() if gender == 1 else fake.first_name_female() for gender in df['gender_male']] # adjust this line according to the exact column name after dummies transformation
    df['surname'] = [fake.last_name() for _ in range(len(df))]

    # Reordering the DataFrame to have 'name' and 'surname' as the first two columns
    return df

original_df = load_df()
ml_dataset = prepare_dataset(original_df.copy())



def get_sensitive_attributes():
    sensitive_attributes = original_df.loc[:, ["age", "gender", "nationality"]]

    # Split age into 3 categories
    sensitive_attributes["age"] = pd.cut(sensitive_attributes['age'], bins=[
        10, 25, 29, 33], labels=["young", "middle-aged", "old"])

    # Turn categorical values into numerical values
    sensitive_attributes["age"] = sensitive_attributes["age"].map(
        {"young": 0, "middle-aged": 1, "old": 2})
    sensitive_attributes["gender"] = sensitive_attributes["gender"].map(
        {"male": 0, "female": 1, "other": 2})
    sensitive_attributes["nationality"] = sensitive_attributes["nationality"].map(
        {"Dutch": 0, "German": 1, "Belgian": 2})

    return sensitive_attributes

def get_shap_values():
    ids = ml_dataset["Id"]
    names = ml_dataset["name"]
    surnames = ml_dataset["surname"]
    X = ml_dataset.drop(columns=["decision", "Id","name","surname"])
    y = ml_dataset["decision"]

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    y_pred = model.predict(X)

    explainer = TreeExplainer(model)
    shap_values = explainer.shap_values(X)
    shap_values = shap_values[1] - shap_values[0] 

    shap_df = pd.DataFrame(shap_values, columns=X.columns)
    shap_df["bias_score"] = shap_df.sum(axis=1)
    X = X.reset_index(drop=True)

    df_with_shap = pd.concat([X, shap_df], axis=1)
    print(df_with_shap.columns)

    df_with_shap["Id"] = ids.values
    df_with_shap["name"] = names.values
    df_with_shap["surname"] = surnames.values
    df_with_shap['predicted_decision'] = y_pred
    df_with_shap["actual_decision"] = y.values
    print(df_with_shap.columns)


    multiindex_vals = [
        ["bias", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "bias", "bias", "bias", "bias", "bias", "bias",
            "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "fair", "meta", "meta", "meta", "meta", "meta", "meta"],
        ['age', 'university_grade', 'debateclub', 'programming_exp',
         'international_exp', 'entrepeneur_exp', 'languages',
         'exact_study', 'gender', 'gender', 'gender',
         'nationality', 'nationality', 'nationality',
         'sport', 'sport', 'sport', 'sport', 'sport',
         'sport', 'sport', 'sport', 'degree',
         'degree', 'degree', 'meta', 'meta', 'meta', 'meta', 'meta', 'meta'],
        df_with_shap.columns.values]
    multiindex = pd.MultiIndex.from_arrays(multiindex_vals)
    df_with_shap.columns = multiindex

    return df_with_shap


def build_scatterplot_data(shap_df):
    scatter_df = pd.DataFrame()
    scatter_df["bias"] = shap_df.loc[:,
                                     ("bias", slice(None), slice(None))].sum(axis=1)
    scatter_df["qualification"] = shap_df.loc[:,
                                              ("fair", slice(None), slice(None))].sum(axis=1)
    scatter_df["id"] = shap_df.loc[:, (slice(None), slice(None), "Id")]

    # sensitive_attributes = shap_df.loc[:, ("bias", slice(None), slice(None))]
    sensitive_attributes = get_sensitive_attributes().to_numpy()
    # TEMPORARY FIX: add noise to sensitive attributes to make them distinguishable
    noise = np.random.normal(0, 0.1, sensitive_attributes.shape)
    sensitive_attributes = sensitive_attributes + noise

    # print(shap_df.columns)
    # print(shap_df.head())
    # scaler = StandardScaler()
    # scaled_data = scaler.fit_transform(sensitive_attributes)
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
    influence.sort(key=lambda x: x["value"], reverse=True)

    return {
        "influence": influence,
        "groupfairness": fairness,
        "overallscore": overallscore
    }


def build_reconsider(scatter_df: pd.DataFrame):
    filter = scatter_df[scatter_df['decision'] == 0].sort_values(
        "qualification", ascending=False)
    df = filter.head(5)
    return df


def build_similarpeople(scatter_df: pd.DataFrame, shap_df: pd.DataFrame):
    ids = shap_df.loc[:, (slice(None), slice(None), "Id")]
    names = shap_df.loc[:, (slice(None), slice(None), "name")]
    surnames = shap_df.loc[:, (slice(None), slice(None), "surname")]

    # Generate a matrix of cosine similarity between fair properties for each pair of people
    X1 = shap_df.loc[:, ("fair", slice(None), slice(None))]
    similarities_fair = cosine_similarity(X1)

    # Generate a matrix of the difference in bias for each pair of people
    biases = scatter_df["bias"].to_numpy()
    biasmatrix = np.zeros((len(biases), len(biases)))
    biasmatrix += np.reshape(biases, (-1, 1))
    biasmatrix -= np.reshape(biases, (1, -1))
    biasmatrix = np.abs(biasmatrix)

    # Generate a matrix with true where the decision was not equal for each pair of people
    decisions = scatter_df["decision"].to_numpy().astype(np.bool8)
    dec1 = np.repeat(np.reshape(decisions, (1, -1)), len(decisions), axis=0)
    dec2 = np.repeat(np.reshape(decisions, (-1, 1)), len(decisions), axis=1)
    dec = np.logical_not(np.logical_xor(dec1, dec2))

    # Very much intuitive sumation of based on what we should decide (0.3 is just a guess)
    measure = similarities_fair + 1 + biasmatrix * 0.3
    measure[dec] = -1

    closest = np.argmax(measure, axis=1)

    result = {}

    for index, neighbor in enumerate(closest):
        id_key = ids.iloc[index].values[0]
        name_key = names.iloc[index].values[0]
        surname_key = surnames.iloc[index].values[0]

        id_value = ids.iloc[neighbor].values[0]
        name_value = names.iloc[neighbor].values[0]
        surname_value = surnames.iloc[neighbor].values[0]

        result[(id_key, name_key, surname_key)] = {
            "1": (id_value, name_value, surname_value)
        }

    return result



def ignore_person(id, name, surname):
    global original_df
    global ml_dataset

    original_df = original_df.drop(original_df[(original_df["Id"] == id) & 
                                               (original_df["name"] == name) & 
                                               (original_df["surname"] == surname)].index)

    ml_dataset = ml_dataset.drop(ml_dataset[(ml_dataset["Id"] == id) & 
                                            (ml_dataset["name"] == name) & 
                                            (ml_dataset["surname"] == surname)].index)



def train_ml_model():
    shap_df = get_shap_values()
    scatter_df = build_scatterplot_data(shap_df)
    reconsider = build_reconsider(scatter_df)
    totals = build_totals(shap_df)
    similar_people = build_similarpeople(scatter_df, shap_df)

    return (scatter_df, similar_people, reconsider, totals)

scatter_df, similar_people, reconsider, totals = train_ml_model()
print("Scatter DF: \n", scatter_df)
print("Similar People: \n", similar_people)
print("Reconsider: \n", reconsider)
print("Totals: \n", totals)



