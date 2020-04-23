from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from random import randint
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel
from models.EmployeeModel import EmployeeModel
from models.MyBooleanField import MyBooleanField


# Dumb solution to a weird bug
class ItemList(EmbeddedDocument):
    item = ReferenceField('MenuItemModel', required=True)
    count = IntField(default=1)

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
        
        # Calculate the total cost for this meal
        self.total_cost=0
        for item in self.items:
            self.total_cost += item.item.cost
        # Set a random id for the order
        if (self.order_id == -1):
            self.order_id = randint(0,10000)

    # Epoch_time
    time_ordered = IntField()
    time_modified = IntField()
    gratuity = FloatField()
    table = IntField()
    special_notes = StringField()
    to_go = MyBooleanField(required=True)
    items = EmbeddedDocumentListField(ItemList, required=True)
    status = StringField(required=True, choices=['ordered','ready','delivered','payment_recieved', 'changed'])
    # If the meal was given away for free
    comped = MyBooleanField(default=False)
    # Who comped the meal
    staff_comped = ReferenceField('EmployeeModel')
    total_cost = FloatField(default=0)
    amount_paid = FloatField(default=0)
    paid_off = MyBooleanField(default=False)
    # This is a numerical identifier for the staff (they could potentially be duplicated)
    order_id = IntField(default=-1)




class OrderResource(TemplateResource):
    model = OrderModel
    pass

class OrderResourceList(TemplateResourceList):
    model = OrderModel
    pass