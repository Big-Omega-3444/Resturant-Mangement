from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

from models.UserModel import UserModel, UserResource, UserResourceList

class EmployeeModel(UserModel):
    address_city = StringField(required=True)
    address_number = StringField()
    address_city = StringField(required=True)
    address_state = StringField(required=True)
    address_zip = IntField(required=True)
    assignment = StringField(required=True, choices=['Manager', 'Waitstaff', 'Kitchen'])
    pin = IntField(required=True)
    phone_number = StringField(required=True)


def abort_if_Employee_doesnt_exist(id):
    try:
        if EmployeeModel.objects.get(id=id) is None:
            current_app.logger.info("WAT")
            abort(404, message="Employee {} doesn't exist!".format(id))
    except ValidationError:
        abort(404, message="Employee {} doesn't exist!".format(id))
    except DoesNotExist:
        abort(404, message="Employee {} doesn't exist!".format(id))

class EmployeeResource(UserResource):
    def get(self, id):
        abort_if_Employee_doesnt_exist(id)
        return json.loads(EmployeeModel.objects.get(id=id).to_json())
    
    def delete(self, id):
        abort_if_Employee_doesnt_exist(id)
        if EmployeeModel.objects.get(id=id).delete() == 0:
            return {'ok': False, 'message': "Couldn't delete object"}, 400
        else:
            return {'ok': True, 'message': "Object deleted Successfuly"}, 204

    # No creation allowed here
    def put(self, id):
        abort_if_Employee_doesnt_exist(id)

        if not request.is_json:
            return {'ok': False, 'message': "Request must include json"}, 400

        try:
            Employee = EmployeeModel.objects.get(id=id)
            Employee.modify(**request.get_json())
            Employee.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400

        return str(Employee.id),201

class EmployeeResourceList(UserResourceList):
    def get(self):
        query = request.args.to_dict()
        return json.loads(EmployeeModel.objects(**query).to_json())

    def post(self):

        if not request.is_json:
            return {'ok': False, 'message': "Request must include json"}, 400

        try:
            new_Employee = EmployeeModel(**request.get_json())
            new_Employee.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400

        return str(new_Employee.id),201



