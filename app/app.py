import os
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_pymongo import PyMongo
from config import Config
from forms import EmpLogin, LoySignup, LoyLogin, EmpRegister, ContactUs

application = Flask(__name__)
application.config.from_object(Config)

mongo = PyMongo(application)
db = mongo.db

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