import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from Dataset import DatasetPreprocessor
import pandas as pd

# pre processing part
preprocessor = DatasetPreprocessor('Machine Learning/Dataset.csv')
preprocessor.clean_data('A')
preprocessor.scale_data('MinMaxScaler')
preprocessor.one_hot_encode(['gender', 'nationality', 'sport', 'ind-degree'])
df = preprocessor.df

# Remove specified features
features_to_remove = [
    'age', 'gender_male', 'gender_female', 'gender_other',
    'nationality_Belgian', 'nationality_Dutch', 'nationality_German'
]
df = df.drop(columns=features_to_remove)

def find_similar_pairs(df, threshold):
    similarity_matrix = cosine_similarity(df)
    np.fill_diagonal(similarity_matrix, 0)  # set diagonal elements to 0 to avoid self-pairing
    pairs = np.argwhere(similarity_matrix > threshold)
    pairs = [tuple(pair) for pair in pairs]
    pairs = sorted(pairs, key=lambda x: similarity_matrix[x[0], x[1]], reverse=True)

    return pairs

similar_pairs = find_similar_pairs(df, 1) # change here the threshold
print(similar_pairs)

# print to see if it is finding similar pairs 
for pair in similar_pairs:
    idx1, idx2 = pair
    features1 = df.iloc[idx1]
    features2 = df.iloc[idx2]
    comparison = pd.concat([features1, features2], axis=1)
    print(comparison)
    print('-' * 50)
