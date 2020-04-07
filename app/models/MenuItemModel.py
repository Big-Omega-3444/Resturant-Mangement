from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.IngredientModel import IngredientModel

class IngredientAmount(EmbeddedDocument):
    ingredient = ReferenceField(IngredientModel, required=True)
    count = IntField(required=True)

class MenuItemModel(Document):
    item_name = StringField(required=True)
    item_description = StringField(default="Default Item Description")
    item_image = URLField()
    item_cost = StringField(required=True)
    ingredients = EmbeddedDocumentListField(IngredientAmount)

class MenuItemResource(TemplateResource):
    model = MenuItemModel
    pass

class MenuItemResourceList(TemplateResourceList):
    model = MenuItemModel
    pass
