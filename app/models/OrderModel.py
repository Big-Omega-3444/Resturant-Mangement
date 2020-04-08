from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel
from models.EmployeeModel import EmployeeModel

class OrderModel(Document):

    def clean(self):
        if self.comped:
            if self.staff_comped is None:
                msg = 'comped flag set so staff_comped must reference an employee'
                raise ValidationError(msg)

    table = IntField()
    to_go = BooleanField(required=True)
    items = ListField(ReferenceField('MenuItemModel'), required=True)
    status = StringField(required=True, choices=['ordered','ready','delivered','payment_recieved'])
    # If the meal was given away for free
    comped = BooleanField(default=False)
    # Who comped the meal
    staff_comped = ReferenceField('EmployeeModel')


class OrderResource(TemplateResource):
    model = OrderModel
    pass

class OrderResourceList(TemplateResourceList):
    model = OrderModel
    pass