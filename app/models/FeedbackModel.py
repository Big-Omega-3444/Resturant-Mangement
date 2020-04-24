from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList

class FeedbackModel(Document):
    feedback = StringField(required=True)
    answer1 = StringField()
    answer2 = StringField()
    answer3 = StringField()
    # A way to get back to the customer
    email_response = EmailField()
    firstname = StringField()
    lastname = StringField()

class FeedbackResource(TemplateResource):
    model = FeedbackModel
    pass

class FeedbackResourceList(TemplateResourceList):
    model = FeedbackModel
    pass