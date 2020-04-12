from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel
from models.EmployeeModel import EmployeeModel
from models.MyBooleanField import MyBooleanField


# Dumb solution to a weird bug
class ItemList(EmbeddedDocument):
    item = ReferenceField('MenuItemModel', required=True)

    def clean(self):
        try:
            if MenuItemModel.objects(id=self.item.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)

class OrderModel(Document):

    def clean(self):
        if self.comped:
            if self.staff_comped is None:
                msg = 'comped flag set so staff_comped must reference an employee'
                raise ValidationError(msg)


    gratuity = FloatField()
    table = IntField()
    special_notes = StringField()
    to_go = MyBooleanField(required=True)
    items = EmbeddedDocumentListField(ItemList, required=True)
    status = StringField(required=True, choices=['ordered','ready','delivered','payment_recieved'])
    # If the meal was given away for free
    comped = MyBooleanField(default=False)
    # Who comped the meal
    staff_comped = ReferenceField('EmployeeModel')


class OrderResource(TemplateResource):
    model = OrderModel
    pass

class OrderResourceList(TemplateResourceList):
    model = OrderModel
    pass