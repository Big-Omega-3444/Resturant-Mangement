from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

from models.UserModel import UserModel, UserResource, UserResourceList

class EmployeeModel(UserModel):
    address_street = StringField(required=True)
    address_city = StringField(required=True)
    address_number = StringField()
    address_state = StringField(required=True)
    address_zip = IntField(required=True)
    assignment = StringField(required=True, choices=['manager', 'waitstaff', 'kitchen'])
    pin = IntField(required=True)
    phone_number = StringField(required=True)


class EmployeeResource(UserResource):
    model = EmployeeModel
    pass

class EmployeeResourceList(UserResourceList):
    model = EmployeeModel
    pass



