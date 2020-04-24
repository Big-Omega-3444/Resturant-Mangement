from mongoengine import *
from flask import jsonify, request, current_app
from flask_restful import Resource, abort
import datetime
import json
import logging

class TemplateResource(Resource):

    model = None

    def abort_if_obj_doesnt_exist(self, id):
        try:
            if self.model.objects.get(id=id) is None:
                current_app.logger.info("WAT")
                abort(404, message="obj {} doesn't exist!".format(id))
        except ValidationError:
            abort(404, message="obj {} doesn't exist!".format(id))
        except DoesNotExist:
            abort(404, message="obj {} doesn't exist!".format(id))

    def get(self, id):
        self.abort_if_obj_doesnt_exist(id)
        return json.loads(self.model.objects.get(id=id).to_json())
    
    def delete(self, id):
        self.abort_if_obj_doesnt_exist(id)
        if self.model.objects.get(id=id).delete() == 0:
            return {'ok': False, 'message': "Couldn't delete object"}, 400
        else:
            return {'ok': True, 'message': "Object deleted Successfuly"}, 204

    # No creation allowed here
    def put(self, id):
        self.abort_if_obj_doesnt_exist(id)

        if not request.is_json:
            # Convert form request into dict
            data = request.form.to_dict()
            # return {'ok': False, 'message': "Request must include json"}, 400
        else:
            data = request.get_json()

        try:
            obj = self.model.objects.get(id=id)
            current_app.logger.info("Update: " + str(data))
            current_app.logger.info(obj.to_json())
            obj.update(**data)
            obj.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400

        return str(obj.id),201

class TemplateResourceList(Resource):

    model = None

    def init(self, model):
        self.model = model

    def get(self):
        # current_app.logger.debug("TYPE TEMP: {}".format(type(self)))
        query = request.args.to_dict()
        return json.loads(self.model.objects(**query).to_json())

    def post(self):

        try:

            if not request.is_json:
                # Convert form request into dict
                data = request.form.to_dict()
                new_obj = self.model(**data)
                # return {'ok': False, 'message': "Request must include json"}, 400
            else:
                data = request.data
                new_obj = self.model.from_json(data)
                current_app.logger.info("Update: " + str(data))

            new_obj.save()
        except ValidationError as err:
            current_app.logger.info("Validation error")
            return {'ok': False, 'message': "Validation Error: {}".format(err)}, 400
        except NotUniqueError as err:
            current_app.logger.info("NotUniqueError error")
            return {'ok': False, 'message': "NotUniqueError Error: {}".format(err)}, 400
        except FieldDoesNotExist as err:
            return {'ok': False, 'message': "FieldDoesNotExist Error: {}".format(err)}, 400
        except Exception as err:
            return {'ok': False, 'message': "Unhandled Error: {}".format(err)}, 400


        return str(new_obj.id),201