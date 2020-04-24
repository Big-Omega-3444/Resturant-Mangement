from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList

class ReservationModel(Document):
    firstname = StringField(required=True)
    lastname = StringField()
    email = EmailField(required=True)
    phone_number = StringField(required=True)
    num_people = IntField(required=True)
    reservation_utc = IntField(required=True)


class ReservationResource(TemplateResource):
    model = ReservationModel
    pass

class ReservationResourceList(TemplateResourceList):
    model = ReservationModel
    pass