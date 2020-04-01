import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'very cool key'
    MONGO_URI = 'mongodb://' + os.environ['MONGODB_USERNAME'] + ':' + os.environ['MONGODB_PASSWORD'] + '@' + os.environ['MONGODB_HOSTNAME'] + ':27017/' + os.environ['MONGODB_DATABASE']