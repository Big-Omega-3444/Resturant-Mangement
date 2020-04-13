from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel
from models.MyBooleanField import MyBooleanField

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

class DayTimeSlot(EmbeddedDocument):
    day = StringField(choices=['Su','M','Tu','W','Th','F','Sa'])
    start_hour = IntField(min_value=0, max_value=23)
    start_min = IntField(min_value=0, max_value=59)
    end_hour = IntField(min_value=0, max_value=23)
    end_min = IntField(min_value=0, max_value=59)


class MenuModel(Document):
    name = StringField(required=True, unique=True)
    items = EmbeddedDocumentListField(ItemList, default=[])
    timeslots = EmbeddedDocumentListField(DayTimeSlot, default=[])
    description = StringField(default="Default Menu Description")
    image = URLField()
    drinks = MyBooleanField(required=True)
    ignore_timeslots = MyBooleanField(default=True)


    pass

class MenuResource(TemplateResource):
    model = MenuModel
    pass

class MenuResourceList(TemplateResourceList):
    model = MenuModel
    pass