import os
import logging
from flask import Flask, request, jsonify, render_template, current_app, redirect, url_for
from flask_restful import Api
from config import Config
from forms import EmpLogin, LoySignup, LoyLogin, EmpRegister, ContactUs
from models.UserModel import UserResource, UserResourceList
from models.EmployeeModel import EmployeeResource, EmployeeResourceList
from database import Database as db



application = Flask(__name__)
api = Api(application)
application.config.from_object(Config)
# Route the user api
api.add_resource(UserResourceList, '/api/users')
api.add_resource(UserResource, '/api/users/<id>')

api.add_resource(EmployeeResourceList, '/api/employees')
api.add_resource(EmployeeResource, '/api/employees/<id>')

application.logger.setLevel(logging.INFO)


with application.app_context():
    db.init()





@application.route('/')
def index():
    empLogin = EmpLogin(prefix="EmpLog")    # employee login form
    loySignup = LoySignup(prefix="LoySign") # loyalty signup form
    loyLogin = LoyLogin(prefix="LoyLog")    # loyalty sign in form

    if empLogin.validate(): # if the emplogin input is valid
        # SELECT against employee database
        # if valid
            # if waitStaff
                # return redirect(url_for('waitStaff'))
            # if kitchenStaff
                # return redirect(url_for('kitchenStaff'))
        # if management
        return redirect(url_for('management')) # send them to the management window
#    elif loySignup.validate():
        # SELECT against loyalty database
        # if invalid (user doesn't exist)
        # INSERT into database
#    elif loyLogin.validate():
        # SELECT against loyalty database
        # if valid
        # redirect to loyalty index.html?

    return render_template('index.html',
                           empLogin = empLogin, loyLogin = loyLogin, loySignup = loySignup)

@application.route('/about')
def about():
    return render_template('about.html')

@application.route('/contact')
def contact():
  
    contact = ContactUs(prefix="Contact") # contact form

    if contact.validate(): # if we get valid input
        # send to a database?
        return redirect(url_for('index')) # redirect to home

    return render_template('contact.html',
                           contact = contact)
    
    
@application.route('/waitstaff')
def waitstaff():
    return render_template('waitstaff.html')
	
@application.route('/kitchen')
def kitchen():
    return render_template('kitchen.html')
	
    

@application.route('/management')
def management():
    empRegister = EmpRegister(prefix="EmpReg") # employee register form

    # if empRegister.validate():
    # SELECT against employee database
    # if invalid (user doesn't exist)
    # INSERT into database
    # redirect to management probably?

    return render_template('management.html',
                           empRegister = empRegister)

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