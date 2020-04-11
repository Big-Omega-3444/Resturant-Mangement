from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel

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

class MenuModel(Document):
    name = StringField(required=True, unique=True)
    items = EmbeddedDocumentListField(ItemList, default=[])
    description = StringField(default="Default Menu Description")
    image = URLField()

    pass

class MenuResource(TemplateResource):
    model = MenuModel
    pass

class MenuResourceList(TemplateResourceList):
    model = MenuModel
    pass