from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

from models.UserModel import UserModel, UserResource, UserResourceList
from models.TemplateModel import TemplateResource, TemplateResourceList

class EmployeeModel(UserModel):
    address_street = StringField(required=True)
    address_city = StringField(required=True)
    address_number = StringField()
    address_state = StringField(required=True)
    address_zip = IntField(required=True)
    assignment = StringField(required=True, choices=['manager', 'waitstaff', 'kitchen'])
    pin = IntField(required=True)
    phone_number = StringField(required=True)


class EmployeeResource(TemplateResource):
    model = EmployeeModel
    pass

default_admin_user = "admin"
default_admin_pin = 1234

class EmployeeResourceList(TemplateResourceList):
    model = EmployeeModel
    def get(self):
        # current_app.logger.debug("TYPE EMP: {}".format(type(self)))
        # Add a default manager if there isn't one
        ct = self.model.objects(assignment='manager').count()
        if ct < 1:
            current_app.logger.info("CREATED DEFAULT ADMIN")
            new_admin = EmployeeModel()
            new_admin.address_street = "X"
            new_admin.address_city = "X"
            new_admin.address_state = "X"
            new_admin.address_zip = -1
            new_admin.assignment = "manager"
            new_admin.pin = default_admin_pin
            new_admin.phone_number = "X"
            new_admin.username = default_admin_user
            new_admin.firstname = "ADMIN"
            new_admin.email = "admin@admin.gov"
            new_admin.save()
        # Call the other get
        return super().get()
    pass



