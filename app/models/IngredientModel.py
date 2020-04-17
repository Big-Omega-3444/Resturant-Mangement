from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MyBooleanField import MyBooleanField

class IngredientModel(Document):
    name = StringField(required=True, unique=True)
    allergen = MyBooleanField(default=False)
    category = StringField(choices=["Crusts","Sauces","Cheeses","Meats","Veggies"])

class IngredientResource(TemplateResource):
    model = IngredientModel
    pass

class IngredientResourceList(TemplateResourceList):
    model = IngredientModel
    pass