from bson import ObjectId
from mongoengine import *

class MyReferenceField(ReferenceField):
    def validate(self, value):
        if isinstance(value, str):
            value = ObjectId(value)

        return super(MyReferenceField, self).validate(value)