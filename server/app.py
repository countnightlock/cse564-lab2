# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import analysis
import spotify

from urllib.parse import unquote

app = Flask(__name__)
CORS(app)

df = analysis.init()

# @app.get("/screedata")
# def get_scree_data():
#     eig_pairs, var_explained, cumulative_var_explained = analysis.get_scree_plot_data(mds)
#     pc_list = []
#     for i in range(len(var_explained)):
#         pc_list.append({
#             'name': f'PC{i+1}',
#             'eig_val': eig_pairs[i][0],
#             'var_explained': var_explained[i],
#             'cumulative_var_explained': cumulative_var_explained[i]
#         })
#     return jsonify(pc_list)

# @app.get("/biplotdata")
# def get_biplot_data():
#     return jsonify(analysis.get_biplot_data(mds))

# @app.get('/mdsdata')
# def get_mds_data():
#     return analysis.get_mds_data(mds)

# @app.get('/mdsvars')
# def get_mds_vars():
#     return analysis.get_mds_vars()

# @app.get("/columndata")
# # def get_column_data():
#     args = request.args
#     return analysis.get_loadings(mds, args.get('di', type=int))

@app.get("/actualdata")
def get_actual_data():
    args = request.args
    if args.get('cols', type=str) == 'all':
        return analysis.get_all_data()
    else:
        return analysis.get_actual_data(args.get('cols').split(','))

# @app.get("/elbowplot")
# def get_elbow_data():
#     return jsonify(analysis.get_elbow_plot_data())

# @app.get("/labels")
# def get_labels():
#     return jsonify(analysis.get_labels())

@app.get("/getHistogramData")
def get_histogram_data():
    return analysis.get_histogram_data()

@app.get("/getBubbleChartData")
def get_bubble_chart_data():
    return analysis.get_bubble_chart_data()

@app.get("/master")
def get_master_data():
    args = request.args
    if args.get('countries') is None:
        countries_filter = None
    else:
        countries_filter = unquote(args.get('countries')).split(',')

    if args.get('timestart') is None or args.get('timeend') is None:
        histogram_filter = None
    else:
        histogram_filter = [args.get('timestart', type=int), args.get('timeend', type=int)]

    if args.get('popindex') is None:
        popularity_filter = None
    else:
        popularity_filter = args.get('popindex', type=int)

    filtered_df = analysis.get_filtered_df(df, countries_filter, histogram_filter, popularity_filter)

    if histogram_filter is not None:
        country_df = analysis.get_filtered_df(df, None, histogram_filter, None)
    else:
        country_df = df

    top_5_track_uris = analysis.get_top_five(filtered_df)['track_id'].unique().tolist()

    return jsonify({
        'alldata': analysis.get_all_data(filtered_df),
        'country_data': analysis.get_country_data(country_df).to_dict(orient='records'),
        'histogram_data': analysis.get_histogram_data(filtered_df).tolist(),
        'bubble_chart_data': analysis.get_bubble_chart_data(filtered_df),
        'top_five': spotify.get_track_details(top_5_track_uris).to_dict(orient='records'),
        'recommendations': spotify.get_recommendations(top_5_track_uris).to_dict(orient='records')
    })
