from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging
from models.TemplateModel import TemplateResource, TemplateResourceList
from models.MenuItemModel import MenuItemModel
from models.MyReferenceField import MyReferenceField

class ItemDiscount(EmbeddedDocument):
    item = MyReferenceField('MenuItemModel', required=True)
    percent_discount = FloatField(min_value=0, max_value=100)
    constant_discount = FloatField(min_value=0)

    def clean(self):
        try:
            if MenuItemModel.objects(id=self.item.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)

            if self.percent_discount == 0 and self.constant_discount == 0:
                msg = 'Discount of at least one type must be set'
                raise ValidationError(msg)

        except:
            msg = 'Malformated request'
            raise ValidationError(msg)

class SpecialsModel(Document):
    specific_discounts = EmbeddedDocumentListField(ItemDiscount, default=[])
    percent_discount = FloatField(min_value=0, max_value=100)
    constant_discount = FloatField(min_value=0)
    days = ListField(StringField(choices=['M','Tu','W','Th','F','Sa','Su']),default=[])

    def clean(self):
        if self.specific_discounts is None and self.percent_discount == 0 and self.constant_discount == 0:
            msg = 'Discount of at least one type must be set (top)'
            raise ValidationError(msg)

class SpecialsResource(TemplateResource):
    model = SpecialsModel
    pass

class SpecialsResourceList(TemplateResourceList):
    model = SpecialsModel
    pass