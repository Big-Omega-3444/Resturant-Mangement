from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.IngredientModel import IngredientModel

class InventoryModel(Document):
    ingredient = ReferenceField('IngredientModel', required=True)
    count = IntField(required=True)

    def clean(self):
        try:
            if IngredientModel.objects(id=self.ingredient.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)

class InventoryResource(TemplateResource):
    model = InventoryModel
    pass

class InventoryResourceList(TemplateResourceList):
    model = InventoryModel
    pass