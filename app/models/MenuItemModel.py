from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.IngredientModel import IngredientModel
from models.MyBooleanField import MyBooleanField
from models.MyReferenceField import MyReferenceField

class IngredientAmount(EmbeddedDocument):

    ingredient = MyReferenceField('IngredientModel', required=True)
    count = IntField(required=True)

    def clean(self):
        try:
            if IngredientModel.objects(id=self.ingredient.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)
        


class MenuItemModel(Document):
    name = StringField(required=True, unique=True)
    description = StringField(default="Default Item Description")
    image = URLField()
    cost = FloatField(required=True)
    ingredients = EmbeddedDocumentListField(IngredientAmount)
    allergens = ListField(StringField(default=[],choices=['wheat','peanut','egg','soy','milk','fish','shellfish','treenut']))
    calories = IntField(min_value=0, required=True)
    out_of_stock = MyBooleanField(default=False)
    times_ordered = IntField(default = 0)
    loyalty_exclusive = MyBooleanField(default=False)

class MenuItemResource(TemplateResource):
    model = MenuItemModel
    pass

class MenuItemResourceList(TemplateResourceList):
    model = MenuItemModel
    pass
