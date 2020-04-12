from mongoengine.base import BaseField
from flask import current_app
import logging

class MyBooleanField(BaseField):

    truthy = ['1', 'true', 'True', 't', True]
    falsy = ['0', 'false', 'False','f', False]

    def to_python(self, value):
        try:
            if value in self.truthy:
                value = True
            elif value in self.falsy:
                value = False
            else:
                raise ValueError
            
        except ValueError:
            pass
        return value

    def validate(self, value):
        current_app.logger.info(value)
        if value not in self.truthy and value not in self.falsy:
            self.error("MyBooleanField only accepts boolean values")