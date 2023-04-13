import argparse
import os
import pandas as pd
import json

from flask import Flask, request, abort
from flask_cors import CORS

def create_app():
    app = Flask(__name__)  # static_url_path, static_folder, template_folder...
    CORS(app, resources={r"/*": {"origins": "*"}})

    dataset = pd.read_csv("backend-project/data/dataset.csv")
    scatterdataset = pd.read_csv("backend-project/data/scatterdata.csv")
    with open("backend-project/data/similarpeopledata.json") as f:
        similarpeopledataset = json.load(f)
    reconsiderdataset = pd.read_csv("backend-project/data/reconsiderdata.csv")
    with open("backend-project/data/totalfairness.json") as f:
        totalfairnessdataset = json.load(f)

    @app.route('/version')
    def version():
        return f"Job ID: {os.environ['JOB_ID']}\nCommit ID: {os.environ['COMMIT_ID']}"

    @app.route('/')
    def index():
        return "<html><body><h1>Welcome to the coolest IML project out there</h1></body></html>"

    @app.route('/scatterdata')
    def scatterdata():
        return scatterdataset.to_json(orient='records')

    @app.route('/person/<string:id>', methods = ['POST', 'GET'])
    def person(id):
        if request.method == 'GET':
            result = dataset[dataset['Id']==id]
            if len(result) == 1:
                return result.to_json(orient='records')
            else:
                return abort(404)
            
        elif request.method == 'POST': # TODO mark the influence of bias for this person as zero
            return True
        
        return abort(405)
    
    @app.route('/similarpeople/<string:id>')
    def similarpeople(id):
        try:
            json_entry = similarpeopledataset[id]
        except KeyError:
            abort(404)

        sorted_kv_pairs = sorted(json_entry.items(), key=lambda x: int(x[0]))
        filtered_df = dataset.loc[dataset['Id'].isin([kv_pair[1] for kv_pair in sorted_kv_pairs])]
        return filtered_df.to_json(orient='records')
    
    @app.route('/reconsider')
    def reconsider():
        filtered_df = dataset.loc[dataset['Id'].isin(reconsiderdataset["Id"])]
        return filtered_df.to_json(orient='records')
    
    @app.route('/fairness')
    def fairness():
        return totalfairnessdataset

    return app


def start_server():
    parser = argparse.ArgumentParser()

    # API flag
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="The host to run the server",
    )
    parser.add_argument(
        "--port",
        default=8000,
        help="The port to run the server",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run Flask in debug mode",
    )

    args = parser.parse_args()

    server_app = create_app()

    server_app.run(debug=args.debug, host=args.host, port=args.port)


if __name__ == "__main__":
    start_server()
