# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import analysis

app = Flask(__name__)
CORS(app)

pca = analysis.init()

@app.get("/screedata")
def get_scree_data():
    eig_pairs, var_explained, cumulative_var_explained = analysis.get_scree_plot_data(pca)
    pc_list = []
    for i in range(len(var_explained)):
        pc_list.append({
            'name': f'PC{i+1}',
            'eig_val': eig_pairs[i][0],
            'var_explained': var_explained[i],
            'cumulative_var_explained': cumulative_var_explained[i]
        })
    return jsonify(pc_list)

@app.get("/biplotdata")
def get_biplot_data():
    return jsonify(analysis.get_biplot_data(pca))

@app.get("/columndata")
def get_column_data():
    args = request.args
    return analysis.get_loadings(pca, int(args.get('di')))

# @app.post("/countries")
# def add_country():
#     if request.is_json:
#         country = request.get_json()
#         country["id"] = _find_next_id()
#         countries.append(country)
#         return country, 201
#     return {"error": "Request must be JSON"}, 415
