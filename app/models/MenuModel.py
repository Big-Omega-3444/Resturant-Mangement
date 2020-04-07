from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel

class MenuModel(Document):
    name = StringField(required=True)
    items = ListField(ReferenceField(MenuItemModel))
    description = StringField(default="Default Menu Description")
    image = URLField()
    pass

class MenuResource(TemplateResource):
    model = MenuModel
    pass

class MenuResourceList(TemplateResourceList):
    model = MenuModel
    pass