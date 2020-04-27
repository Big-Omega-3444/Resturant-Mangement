from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MyBooleanField import MyBooleanField
from models.MenuItemModel import MenuItemModel
from models.MyReferenceField import MyReferenceField

# Dumb solution to a weird bug
class ItemList(EmbeddedDocument):
    item = MyReferenceField('MenuItemModel', required=True)

    def clean(self):
        try:
            if MenuItemModel.objects(id=self.item.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)

class MealModel(Document):
    name = StringField(required=True, unique=True)
    description = StringField(required=True)
    EmbeddedDocumentListField(ItemList, required=True)
    image = URLField()
    cost = FloatField(required=True)
    times_ordered = IntField(default=0)
    loyalty_exclusive = MyBooleanField(default=False)

class MealResource(TemplateResource):
    model = MealModel
    pass

class MealResourceList(TemplateResourceList):
    model = MealModel
    pass