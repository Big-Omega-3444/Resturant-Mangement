from flask_pymongo import PyMongo
from mongoengine import connect
from config import Config
from flask import current_app

class Database(object):

    @staticmethod
    def init():
        connect(host=current_app.config['MONGO_URI'])