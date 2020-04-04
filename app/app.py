import os
import logging
from flask import Flask, request, jsonify, render_template, current_app
from flask_restful import Api
from config import Config
from forms import LoginForm

from models.UserModel import UserResource, UserResourceList
from database import Database as db



application = Flask(__name__)
api = Api(application)
application.config.from_object(Config)
# Route the user api
api.add_resource(UserResourceList, '/users')
api.add_resource(UserResource, '/users/<id>')
application.logger.setLevel(logging.INFO)


with application.app_context():
    db.init()





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

if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT, debug=ENVIRONMENT_DEBUG)