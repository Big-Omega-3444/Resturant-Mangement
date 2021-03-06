import os
import logging
from flask import Flask, request, jsonify, render_template, current_app, redirect, url_for
from flask_restful import Api
from config import Config
from models.UserModel import UserResource, UserResourceList
from models.EmployeeModel import EmployeeResource, EmployeeResourceList
from models.IngredientModel import IngredientResource, IngredientResourceList
from models.MenuItemModel import MenuItemResource, MenuItemResourceList
from models.OrderModel import OrderResource, OrderResourceList
from models.MenuModel import MenuResource, MenuResourceList
from models.InventoryModel import InventoryResource, InventoryResourceList
from models.CouponModel import CouponResource, CouponResourceList
from models.SpecialsModel import SpecialsResource, SpecialsResourceList
from models.LoyaltyMemberModel import LoyaltyMemberResource, LoyaltyMemberResourceList
from models.TimeSheetModel import TimeSheetResource, TimeSheetResourceList
from models.TableModel import TableResource, TableResourceList
from models.NotificationModel import NotificationResource, NotificationResourceList
from models.ReservationModel import ReservationResource, ReservationResourceList
from models.FeedbackModel import FeedbackResource, FeedbackResourceList
from models.MealModel import MealResource, MealResourceList
from database import Database as db



application = Flask(__name__)
api = Api(application)
application.config.from_object(Config)

application.logger.setLevel(logging.DEBUG)

# Route the user api
api.add_resource(UserResourceList, '/api/users')
api.add_resource(UserResource, '/api/users/<id>')

api.add_resource(EmployeeResourceList, '/api/employees')
api.add_resource(EmployeeResource, '/api/employees/<id>')

api.add_resource(IngredientResourceList, '/api/ingredients')
api.add_resource(IngredientResource, '/api/ingredients/<id>')

api.add_resource(MenuItemResourceList, '/api/menuitems')
api.add_resource(MenuItemResource, '/api/menuitems/<id>')

api.add_resource(OrderResourceList, '/api/orders')
api.add_resource(OrderResource, '/api/orders/<id>')

api.add_resource(MenuResourceList, '/api/menus')
api.add_resource(MenuResource, '/api/menus/<id>')

api.add_resource(InventoryResourceList, '/api/inventory', '/api/inventorys')
api.add_resource(InventoryResource, '/api/inventory/<id>', '/api/inventorys/<id>')

api.add_resource(CouponResourceList,'/api/coupons')
api.add_resource(CouponResource,'/api/coupons/<id>')

api.add_resource(SpecialsResourceList,'/api/specials')
api.add_resource(SpecialsResource,'/api/specials/<id>')

api.add_resource(LoyaltyMemberResourceList,'/api/loyaltymembers')
api.add_resource(LoyaltyMemberResource,'/api/loyaltymembers/<id>')

api.add_resource(TimeSheetResourceList,'/api/timesheets')
api.add_resource(TimeSheetResource,'/api/timesheets/<id>')

api.add_resource(TableResourceList, '/api/tables')
api.add_resource(TableResource, '/api/tables/<id>')

api.add_resource(NotificationResourceList, '/api/notifications')
api.add_resource(NotificationResource, '/api/notifications/<id>')

api.add_resource(ReservationResourceList, '/api/reservations')
api.add_resource(ReservationResource, '/api/reservations/<id>')

api.add_resource(FeedbackResourceList, '/api/feedback')
api.add_resource(FeedbackResource, '/api/feedback/<id>')

api.add_resource(MealResourceList, '/api/meals')
api.add_resource(MealResource, '/api/meals/<id>')


with application.app_context():
    db.init()


@application.route('/')
def index():
        return render_template('index.html')

@application.route('/kidzone')
def kidzone():
        return render_template('kidzone.html')

@application.route('/about')
def about():
    return render_template('about.html')

@application.route('/contact')
def contact():
    return render_template('contact.html')

@application.route('/waitstaff')
def waitstaff():
    return render_template('waitstaff.html')

@application.route('/welcome') #Added Welcome page routing
def welcome():
    return render_template('welcome.html')

@application.route('/kitchen')
def kitchen():
    return render_template('kitchen.html')

@application.route('/management')
def management():
    return render_template('management.html')

@application.route('/termsOfUse')
def termsOfUse():
    return render_template('termsOfUse.html')

@application.route('/privacyPolicy')
def privacypolicy():
    return render_template('privacypolicy.html')

@application.route('/TestList')
def TestList():
    return render_template('TestList.html')

@application.route('/TableMap')
def TableMap():
    return render_template('TableMap.html')

if __name__ == "__main__":
    ENVIRONMENT_DEBUG = os.environ.get("APP_DEBUG", True)
    ENVIRONMENT_PORT = os.environ.get("APP_PORT", 5000)
    application.run(host='0.0.0.0', port=ENVIRONMENT_PORT, debug=ENVIRONMENT_DEBUG)
