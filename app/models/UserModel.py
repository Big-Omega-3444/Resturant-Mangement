from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

# This is all that __should__ have to be modified to add new fields to the user
class UserModel(Document):
    username = StringField(required=True, unique=True)
    firstname = StringField(required=True)
    middlename = StringField()
    lastname = StringField()
    email = EmailField(required=True)

def abort_if_user_doesnt_exist(id):
    try:
        if UserModel.objects.get(id=id) is None:
            current_app.logger.info("WAT")
            abort(404, message="User {} doesn't exist!".format(id))
    except ValidationError:
        abort(404, message="User {} doesn't exist!".format(id))
    except DoesNotExist:
        abort(404, message="User {} doesn't exist!".format(id))

# For referenceing a single user
# Allows getting, updating, and deleting
# id will be mongodb's builtit ObjectId
# id is accessible through UserModel.id
class UserResource(Resource):
    def get(self, id):
        abort_if_user_doesnt_exist(id)
        return json.loads(UserModel.objects.get(id=id).to_json())
    
    def delete(self, id):
        abort_if_user_doesnt_exist(id)
        if UserModel.objects.get(id=id).delete() == 0:
            return {'ok': False, 'message': "Couldn't delete object"}, 400
        else:
            return {'ok': True, 'message': "Object deleted Successfuly"}, 204

    # No creation allowed here
    def put(self, id):
        abort_if_user_doesnt_exist(id)

        if not request.is_json:
            return {'ok': False, 'message': "Request must include json"}, 400

        try:
            user = UserModel.objects.get(id=id)
            user.modify(**request.get_json())
            user.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400

        return str(user.id),201



class UserResourceList(Resource):
    def get(self):
        # TODO add query support
        return json.loads(UserModel.objects.to_json())

    def post(self):

        if not request.is_json:
            return {'ok': False, 'message': "Request must include json"}, 400

        try:
            new_user = UserModel(**request.get_json())
            new_user.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400

        return str(new_user.id),201


