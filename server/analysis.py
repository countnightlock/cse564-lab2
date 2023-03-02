import numpy as np
import pandas as pd

COLUMNS = [
    "danceability",
    "energy",
    "key",
    "loudness",
    "mode",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
    "duration_ms",
    "time_signature",
    "album_popularity",
    "release_date",
    "total_tracks",
    "artist_popularity"
]

def read_tsv():
    return pd.read_csv('analysis.txt', sep='\t', usecols=lambda col : 'uri' not in col)

df = read_tsv()

def get_scree_plot_data():
    C = np.corrcoef(df, rowvar=False)

    eig_vals, eig_vects = np.linalg.eig(C)

    eig_pairs = [(np.abs(eig_vals[i]), eig_vects[:, i]) for i in range(len(eig_vals))]
    eig_pairs.sort(key=lambda x : x[0], reverse=True)

    tot = sum(eig_vals)

    var_explained = [(i / tot)*100 for i in sorted(eig_vals, reverse=True)]
    cumulative_var_explained = np.cumsum(var_explained)

    return eig_pairs, var_explained, cumulative_var_explained

get_scree_plot_data()