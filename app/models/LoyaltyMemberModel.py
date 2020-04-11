from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

from models.UserModel import UserModel, UserResource, UserResourceList

class CouponObj(EmbeddedDocument):
    coupon = ReferenceField('CouponModel', required=True)

class LoyaltyMemberModel(UserModel):
    address_street = StringField(required=True)
    address_city = StringField(required=True)
    address_number = StringField()
    address_state = StringField(required=True)
    address_zip = IntField(required=True)
    pin = IntField(required=True)
    money_spent = FloatField(default=0)
    birthday = IntField(min_value=1, max_value=31, required=True)
    birthmonth = IntField(min_value=1, max_value=12, require=True)
    phone_number = StringField()
    coupons = EmbeddedDocumentListField(CouponObj, default = [])


class LoyaltyMemberResource(UserResource):
    model = LoyaltyMemberModel
    pass

class LoyaltyMemberResourceList(UserResourceList):
    model = LoyaltyMemberModel
    pass