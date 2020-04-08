from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList

# This is all that __should__ have to be modified to add new fields to the user
class UserModel(Document):
    username = StringField(required=True, unique=True)
    firstname = StringField(required=True)
    middlename = StringField()
    lastname = StringField()
    email = EmailField(required=True)
    phone_number = StringField()

    meta = {'allow_inheritance': True}

class UserResource(TemplateResource):
    model = UserModel
    pass

class UserResourceList(TemplateResourceList):
    model = UserModel
    pass