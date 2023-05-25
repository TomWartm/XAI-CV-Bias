import argparse
import pandas as pd
import dummy_server.ml as ml

from flask import Flask, request, abort, Response
from flask_cors import CORS


def create_app():
    app = Flask(__name__)  # static_url_path, static_folder, template_folder...
    CORS(app, resources={r"/*": {"origins": "*"}})

    # dataset = pd.read_csv("backend-project/data/dataset.csv")
    dataset = pd.read_csv("data/dataset.csv")
    (scatterdataset,
     similarpeopledataset,
     reconsiderdataset,
     totalfairnessdataset) = ml.train_ml_model()

    @app.route('/')
    def index():
        return "<html><body><h1>Welcome to the coolest IML project out there</h1></body></html>"

    @app.route('/scatterdata')
    def scatterdata():
        return scatterdataset.to_json(orient='records')

    @app.route('/person/<string:id>', methods=['POST', 'GET'])
    def person(id):
        if request.method == 'GET':
            result = dataset[dataset['Id'] == id]
            if len(result) == 1:
                return result.to_json(orient='records')
            else:
                return abort(404)

        elif request.method == 'POST':  # TODO mark the influence of bias for this person as zero
            nonlocal scatterdataset
            nonlocal similarpeopledataset
            nonlocal reconsiderdataset
            nonlocal totalfairnessdataset

            ml.ignore_person(id)

            (scatterdataset,
             similarpeopledataset,
             reconsiderdataset,
             totalfairnessdataset) = ml.train_ml_model()

            return Response(status=200)

        return abort(405)

    @app.route('/similarpeople/<string:id>')
    def similarpeople(id):
        try:
            json_entry = similarpeopledataset[id]
        except KeyError:
            abort(404)

        sorted_kv_pairs = sorted(json_entry.items(), key=lambda x: int(x[0]))
        sorted_kv_pairs.insert(0, ("0", id))
        ids = [id for _, id in sorted_kv_pairs]
        filtered_df = dataset[dataset['Id'] == ids[0]]
        for i in range(1, len(ids)):
            filtered_df = pd.concat(
                (filtered_df, dataset[dataset['Id'] == ids[i]]), axis=0)
        return filtered_df.to_json(orient='records')

    @app.route('/reconsider')
    def reconsider():
        filtered_df = dataset.loc[dataset['Id'].isin(reconsiderdataset["id"])]
        return filtered_df.to_json(orient='records')

    @app.route('/fairness')
    def fairness():
        return totalfairnessdataset

    return app


def start_server():
    print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
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
