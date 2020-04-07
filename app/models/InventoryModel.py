from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.IngredientModel import IngredientModel

class InventoryModel(Document):
    ingredient = ReferenceField(IngredientModel, required=True)
    count = IntField(required=True)

class InventoryResource(TemplateResource):
    model = InventoryModel
    pass

class InventoryResourceList(TemplateResourceList):
    model = InventoryModel
    pass