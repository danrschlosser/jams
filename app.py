from flask import Flask, render_template, request
from flask.ext.pymongo import PyMongo

app = Flask(__name__)
mongo = PyMongo(app)

class routes:
    @app.route('/')
    def home():
        nodes = mongo.db.nodes.find()
        return render_template('index.html')

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/upload', methods=['POST'])
    def upload():
        wav = request.files.get('audio')
        wav.save('static/audio/woo.wav')

        clip_name = request.data.get('clip_name')
        file_name = clip_name
        mongo.db.nodes.insert({'file_name': file_name, 'clip_name': clip_name, 'nodes': []})
        return 'success', 200

if __name__ == '__main__':
    app.run(debug=True)
