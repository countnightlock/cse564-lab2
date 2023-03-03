import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

def read_tsv():
    return pd.read_csv('analysis.txt', sep='\t', usecols=lambda col : 'uri' not in col)

df = None
X = None
X_scaled = None
labels = None

def init():
    global df, X, X_scaled, labels
    df = read_tsv()

    X = df.values

    scaler = StandardScaler()
    scaler.fit(X)

    X_scaled = scaler.transform(X)

    pca = PCA()
    pca.fit(X_scaled)

    kmeans = KMeans(n_clusters = 2, init = 'k-means++', random_state = 12, n_init=10, max_iter=25)
    labels = kmeans.fit_predict(X_scaled)

    return pca

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

def get_actual_data(cols):
    global df
    return df[cols].to_json(orient='records')

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
