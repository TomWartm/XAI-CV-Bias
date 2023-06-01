import pandas as pd
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from faker import Faker
import torch
import torch.nn as nn
from torch.utils.data import Dataset

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

        scaled_data = scaler.fit_transform(self.df[['ind-university_grade', 'age']])
        self.df[['ind-university_grade', 'age']] = scaled_data

    def one_hot_encode(self, cat_cols):
        self.df = pd.get_dummies(self.df, columns=cat_cols)

    def generate_fake_names_and_surnames(self):
        fake = Faker()
        self.df['name'] = [fake.first_name_male() if gender == 'male' else fake.first_name_female() for gender in self.df['gender']]
        self.df['surname'] = [fake.last_name() for _ in range(len(self.df))]

    def print_data(self):
        print("\nComplete Dataset:")
        print(self.df)
        print("\nGenerated Names and Surnames:")
        print(self.df[['name', 'surname']])

class CustomDataset(Dataset):
    def __init__(self, features, labels):
        self.features = torch.tensor(features.values, dtype=torch.float32)
        self.labels = torch.tensor(labels.values, dtype=torch.float32)

    def __len__(self):
        return len(self.features)

    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]
