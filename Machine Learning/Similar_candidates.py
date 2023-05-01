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

def find_similar_pairs(df, threshold):
    similarity_matrix = cosine_similarity(df)
    np.fill_diagonal(similarity_matrix, 0)  # set diagonal elements to 0 to avoid self-pairing
    pairs = np.argwhere(similarity_matrix > threshold)
    pairs = [tuple(pair) for pair in pairs]
    pairs = sorted(pairs, key=lambda x: similarity_matrix[x[0], x[1]], reverse=True)

    return pairs

similar_pairs = find_similar_pairs(df, 0.99999) # change here the treshold
print(similar_pairs)


