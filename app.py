from flask import Flask, render_template, request
from flask.ext.pymongo import PyMongo
from datetime import datetime
from bson.json_util import dumps

app = Flask(__name__)
mongo = PyMongo(app)

class routes:
    @app.route('/')
    def home():
        nodes = mongo.db.nodes.find()
        return render_template('index.html', data=dumps(nodes))

    @app.route('/about')
    def about():
        return render_template('about.html')

    @app.route('/upload', methods=['POST'])
    def upload():

        file_name = str(datetime.now()) + '.wav'

        wav = request.files.get('audio')
        wav.save('static/audio/' + file_name)

        mongo.db.nodes.insert({'file_name': file_name, 'clip_name': '', 'nodes': []})
        newnode = mongo.db.nodes.find({'file_name': file_name})[0]
        return str(newnode.get('_id')), 200

    @app.route('/download', methods=['GET'])
    def download():
        
        obj_id = ObjectId(request.form.get('id'))
        nodeToPlay = mongo.db.nodes.find({'_id': obj_id})
        file_name = nodeToPlay.get('file_name')
        wave.open('static/audio/' + file_name, 'r')
        wav = wave.readframes(10000000000)
        
        return 

if __name__ == '__main__':
    app.run(debug=True)
