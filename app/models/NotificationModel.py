from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.OrderModel import OrderModel
from models.MyBooleanField import MyBooleanField
from models.TableModel import TableModel

class NotificationModel(Document):
    order = ReferenceField('OrderModel')
    table = ReferenceField('TableModel')
    meal_ready = MyBooleanField(default=False)
    call_waitstaff = MyBooleanField(default=False)
    call_management = MyBooleanField(defaul=False)
    request_refill = MyBooleanField(default=False)
    refill_list = ListField(StringField(), default=[])
    request_help = MyBooleanField(default=False)
    request_cash_payment = MyBooleanField(default=False)
    time_created = IntField(required=True)

    def clean(self):
        if not (self.meal_ready or self.request_cash or self.call_waitstaff or self.call_management or self.request_refill or self.request_help):
            msg = 'At least one of the bools must be set'
            raise ValidationError(msg)


class NotificationResource(TemplateResource):
    model = NotificationModel
    pass

class NotificationResourceList(TemplateResourceList):
    model = NotificationModel
    pass