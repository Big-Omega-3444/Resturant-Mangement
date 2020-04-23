from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

from models.TemplateModel import TemplateResource, TemplateResourceList
from models.EmployeeModel import EmployeeModel
from models.MyBooleanField import MyBooleanField

class TimeSheetModel(Document):
    employee = ReferenceField('EmployeeModel')
    # Stores times in utc format (milliseconds since epoch)
    utc_start_time = IntField(required=True)
    utc_end_time = IntField()
    ongoing = MyBooleanField(default=True)
    accrued_tips = FloatField(default=0)

    def clean(self):
        try:
            if EmployeeModel.objects(id=self.employee.id) is None:
                msg = 'Object does not exist'
                raise ValidationError(msg)
        except:
            msg = 'Malformated request'
            raise ValidationError(msg)

class TimeSheetResource(TemplateResource):
    model = TimeSheetModel
    pass

class TimeSheetResourceList(TemplateResourceList):
    model = TimeSheetModel
    pass
