from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.OrderModel import OrderModel
from models.MyBooleanField import MyBooleanField
from models.MyReferenceField import MyReferenceField

class OrderObj(EmbeddedDocument):
    order = MyReferenceField('OrderModel')

    def clean(self):
        try:
            if OrderModel.objects(id=self.order.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)




class TableModel(Document):
    number = IntField(unique=True, required=True)
    needs_help = MyBooleanField(default=False)
    needs_refill = MyBooleanField(default=False)
    orders = EmbeddedDocumentListField(OrderObj, default=[])


class TableResource(TemplateResource):
    model = TableModel
    pass

class TableResourceList(TemplateResourceList):
    model = TableModel
    pass
