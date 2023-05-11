import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.manifold import MDS
from sklearn.cluster import KMeans
import math

def read_tsv():
    return pd.read_csv('analysis1.txt', sep='\t')
    # return pd.read_csv('analysis.txt', sep='\t', usecols=lambda col : 'uri' not in col)

def read_only_numerical_tsv():
    return pd.read_csv('analysis.txt', sep='\t', usecols=lambda col : 'uri' not in col and col not in ['key', 'mode', 'time_signature'])

df = None
X = None
X_scaled = None
labels = None
mds = None

def init():
    global df, X, X_scaled, labels, mds
    df = read_tsv()

    # X = df.values

    # scaler = MinMaxScaler()
    # scaler.fit(X)

    # X_scaled = scaler.transform(X)

    # mds = MDS(n_components=2, metric=True, dissimilarity='euclidean', normalized_stress='auto', random_state=42).fit_transform(X_scaled)

    # kmeans = KMeans(n_clusters = 2, init = 'k-means++', random_state = 12, n_init=10, max_iter=25)
    # labels = kmeans.fit_predict(X_scaled)

    # return mds
    return df

def get_mds_vars():
    df = read_only_numerical_tsv()
    X = df.values

    scaler = MinMaxScaler()
    scaler.fit(X)

    X_scaled = pd.DataFrame(scaler.transform(X), columns=df.columns)

    corrMatrix = 1 - abs(X_scaled.corr())
    mds_var = MDS(n_components=2, metric=True, dissimilarity='precomputed', normalized_stress='auto', random_state=42).fit_transform(corrMatrix)

    mds_var = np.hstack((mds_var, corrMatrix.columns.to_numpy().reshape(14,1)))
    dissimilarity = pd.DataFrame(data = mds_var, columns = ['x', 'y', 'name'])

    return dissimilarity.to_json(orient='records')

def get_mds_data(mds):
    mds_df = pd.DataFrame(data=mds, columns=['x','y'])
    return mds_df.to_json(orient='records')

def get_scree_plot_data(pca):
    eig_pairs = [(pca.explained_variance_[i], pca.components_[i]) for i in range(len(pca.explained_variance_))]
    explained_variance = [x * 100 for x in pca.explained_variance_ratio_]
    cumulative_explained_variance = np.cumsum(explained_variance)
    return eig_pairs, explained_variance, cumulative_explained_variance

def get_biplot_data(pca):
    global X_scaled
    X_pca_all = pca.transform(X_scaled)

    return X_pca_all[:, :2].tolist()

def get_loadings(pca, di=6):
    global df
    loadings = pca.components_.T * np.sqrt(pca.explained_variance_)

    loading_matrix = pd.DataFrame(loadings,
                                  columns=['PC' + str(i + 1) for i in range(len(pca.explained_variance_))],
                                  index=df.columns.values.tolist()
                                  )

    loading_matrix['loading_on_first_two_PC'] = [
        [
            pca.explained_variance_[i] * pca.components_.T[i, 0],
            pca.explained_variance_[i] * pca.components_.T[i, 1]
        ] 
        for i in range(len(pca.components_.T))
    ]

    loading_matrix['ssl_di'] = [
        np.inner(loading_matrix.iloc[i, :di], loading_matrix.iloc[i, :di])
        for i in range(len(loading_matrix))
    ]

    loading_matrix = loading_matrix.sort_values('ssl_di', ascending=False)

    return loading_matrix.T.to_json()

def get_all_data(data_frame):
    return data_frame.to_json(orient='records')

def get_actual_data(data_frame, cols):
    return data_frame[cols].to_json(orient='records')

def get_elbow_plot_data():
    global X_scaled
    wcss = []
    for i in range(1, 12):
        kmeans = KMeans(n_clusters = i, init = 'k-means++', random_state = 12, n_init=10, max_iter=25)
        kmeans.fit(X_scaled)
        wcss.append({
            'i': i,
            'wcss': kmeans.inertia_
        })
    return wcss

def get_labels():
    global labels
    return labels.tolist()

def apply_range_filter(df, col, range_l, range_r):
    return df[(df[col] >= range_l) & (df[col] <= range_r)]


def get_filtered_df(data_frame, country_filter, histogram_filter, popularity_filter):
    if country_filter is not None:
        filtered_df = data_frame[data_frame['country'].isin(country_filter)]
    else:
        filtered_df = data_frame

    if histogram_filter is not None:
        filtered_df = apply_range_filter(filtered_df, 'release_date', histogram_filter[0], histogram_filter[1])

    if popularity_filter is not None:
        [artist_l, artist_r] = [math.floor(popularity_filter/10)*10 + i for i in [0, 10]]
        [album_l, album_r] = [math.floor(popularity_filter%10)*10 + i for i in [0, 10]]

        filtered_df = apply_range_filter(filtered_df, 'artist_popularity', artist_l, artist_r)
        filtered_df = apply_range_filter(filtered_df, 'album_popularity', album_l, album_r)

    return filtered_df


def get_country_data(data_frame):
    value_counts = data_frame['country'].value_counts()

    keys = value_counts.keys().tolist()
    values = value_counts.tolist()
    return pd.DataFrame(zip(keys, values), columns=['country', 'count'])


def get_histogram_data(data_frame):
    return data_frame['release_date']


def get_bubble_chart_data(data_frame):
    tracks = [{
                'name': {
                    'track': track[0],
                    'artist': track[1],
                    'album': track[2]
                },
                'popularity': track[3],
                'genre': track[4]
            } for track in zip(data_frame['track_name'], data_frame['artist_name'], data_frame['album_name'], data_frame['track_popularity'], data_frame['genre'])]
    filtered_df = data_frame.drop_duplicates(subset=['album_id', 'artist_id'])
    albums = [{
                'name': {
                    'album': track[1],
                    'artist': track[0]
                },
                'popularity': track[2],
                'genre': track[3]
            } for track in zip(filtered_df['artist_name'], filtered_df['album_name'], filtered_df['album_popularity'], filtered_df['genre'])]
    filtered_df = filtered_df.drop_duplicates(subset=['artist_id'])
    artists = [{
                'name': {
                    'artist': track[0],
                },
                'popularity': track[1],
                'genre': track[2]
            } for track in zip(filtered_df['artist_name'], filtered_df['artist_popularity'], filtered_df['genre'])]

    return {'tracks': tracks, 'albums': albums, 'artists': artists}


def get_top_five(data_frame):
    return data_frame.sort_values(by=['track_popularity'], ascending=False).head(5)
