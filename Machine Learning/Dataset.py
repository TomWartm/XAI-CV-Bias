import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler

class DatasetPreprocessor:
    def __init__(self, path):
        self.df = pd.read_csv(path)

    def clean_data(self, company):
        self.df = self.df[self.df['company'] == company]
        self.df = self.df.drop(['Id', 'company'], axis=1)
        bool_cols = ['ind-debateclub', 'ind-programming_exp', 'ind-international_exp', 'ind-entrepeneur_exp', 'ind-exact_study', 'decision']
        self.df[bool_cols] = self.df[bool_cols].astype(int)

    def scale_data(self, scaler):
        if scaler == 'MinMaxScaler':
            scaler = MinMaxScaler()
        elif scaler == 'StandardScaler':
            scaler = StandardScaler()
        else:
            raise ValueError(f"{scaler} is not a valid scaler. Valid options are 'MinMaxScaler' and 'StandardScaler'.")

        self.df[['ind-university_grade', 'age']] = scaler.fit_transform(self.df[['ind-university_grade', 'age']])

    def one_hot_encode(self, cat_cols):
        self.df = pd.get_dummies(self.df, columns=cat_cols)
