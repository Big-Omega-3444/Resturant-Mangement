import os
from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from config import Config
from forms import LoginForm


application = Flask(__name__)
application.config.from_object(Config)

mongo = PyMongo(application)
db = mongo.db

@application.route('/')
def index():
    form = LoginForm()
    return render_template('index.html', form = form)

@application.route('/about')
def about():
    return render_template('about.html')

@application.route('/contact')
def contact():
    return render_template('contact.html')
    
@application.route('/waitstaff')
def waitstaff():
    return render_template('waitstaff.html')
	
@application.route('/kitchen')
def kitchen():
    return render_template('kitchen.html')
	
@application.route('/management')
def management():
    return render_template('management.html')
	
@application.route('/termsOfUse')
def termsOfUse():
    return render_template('termsOfUse.html')
	
@application.route('/privacyPolicy')
def privacypolicy():
    return render_template('privacypolicy.html')

@application.route('/TestList')
def TestList():
    return render_template('TestList.html')

# Code stolen from elsewhere
@application.route('/todo')
def todo():
    _todos = db.todo.find()

    item = {}
    data = []
    for todo in _todos:
        item = {
            'id': str(todo['_id']),
            'todo': todo['todo']
        }
        data.append(item)

    return jsonify(
        status=True,
        data=data
    )


@application.route('/todo', methods=['POST'])
def createTodo():
    data = request.get_json(force=True)
    item = {
        'todo': data['todo']
    }
    db.todo.insert_one(item)

    return jsonify(
        status=True,
        message='To-do saved successfully!'
    ), 201


if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT, debug=ENVIRONMENT_DEBUG)