import argparse
import os
import pandas as pd

from flask import Flask, request
from flask_cors import CORS

def create_app():
    app = Flask(__name__)  # static_url_path, static_folder, template_folder...
    CORS(app, resources={r"/*": {"origins": "*"}})

    @app.route('/version')
    def version():
        return f"Job ID: {os.environ['JOB_ID']}\nCommit ID: {os.environ['COMMIT_ID']}"

    @app.route('/')
    def index():
        return "<html><body><h1>Welcome to the coolest IML project out there</h1></body></html>"

    @app.route('/scatterdata')
    def scatterdata():
        df = pd.read_csv("scatterdata.csv")
        return df.to_json(orient='records')

    @app.route('/person/<string:id>', methods = ['POST', 'GET'])
    def person(id):
        if request.method == 'GET':

            df = pd.read_csv("dataset.csv")
            return df[df['Id']==id].to_json(orient='records')

        elif request.method == 'POST': # TODO mark the influence of bias for this person as zero
            return True
        return "Wrong request"
    
    @app.route('/similarpeople/<string:id>')
    def similarpeople(id):
        return "Not implemented"
    
    @app.route('/reconsider')
    def reconsider():
        return "Not implemented"
    
    @app.route('/fairness')
    def fairness():
        return "Not implemented"

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
