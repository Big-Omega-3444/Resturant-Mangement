# This is a list of templates for each type of object
class Templates():
    user_template = {
        "username" : "String",
        "firstname" : "String",
        "middlename" : "String",
        "lastname" : "String",
        "email" : "Email",
        "phone_number" : "String"
    }

    employee_template = {
        "address_street" : "String",
        "address_city" : "String",
        "address_number" : "String",
        "address_state" : "String",
        "address_zip" : "Int",
        "assignment" : "String,manager,waitstaff,kitchen",
        "pin" : "Int",
        "phone_number" : "String",
        "username" : "String",
        "firstname" : "String",
        "middlename" : "String",
        "lastname" : "String",
        "email" : "Email",
    }

    ingredient_template = {
        "name" : "String",
        "allergen" : "MyBoolean",
        "category" : "String,Crusts,Sauces,Cheeses,Meats,Veggies",
    }

    menuitem_template = {
        "name" : "String",
        "description" : "String",
        "image" : "URL",
        "cost" : "Float",
        "ingredients" : [{
            "ingredient" : "Reference,ingredient",
            "count" : "Int",
        }],
        "allergens" : ['wheat','peanut','egg','soy','milk','fish','shellfish','treenut'],
        "calories" : "Int",
        "out_of_stock" : "MyBoolean",
        "times_ordered" : "Int",
    }

    order_template = {
        "time_ordered" : "Int",
        "time_modified" : "Int",
        "gratuity" : "Float",
        "table" : "Int",
        "special_notes" : "String",
        "to_go" : "MyBoolean",
        "items" : [{
            "item" : "Reference,menuitem",
        }],
        "status" : "String,ordered,ready,delivered,payment_recieved,changed",
        # If the meal was given away for free
        "comped" : "MyBoolean",
        # Who comped the meal
        "staff_comped" : "Reference,employee",
        # This is a numerical identifier for the staff (they could potentially be duplicated)
        "order_id" : "Int",
    }

    menu_template = {
        "name" : "String",
        "items" : [{
            "item" : "Reference,menuitem",
        }],
        "timeslots" : [{
            "day" : "String,Su,M,Tu,W,Th,F,Sa",
            "start_hour" : "Int,0,23",
            "start_min" : "Int,0,59",
            "end_hour" : "Int,0,23",
            "end_min" : "Int,0,59",
        }],
        "description" : "String",
        "image" : "URL",
        "drinks" : "MyBoolean",
        "ignore_timeslots" : "MyBoolean",
    }

    inventory_template = {
        "ingredient" : "Reference,ingredient",
        "count" : "Int",
    }

    coupon_template = {
        "entry_code" : "String",
        "specific_discounts" : [{
            "item" : "Reference,menuitem",
            "percent_discount" : "Float",
            "constant_discount" : "Float",
        }],
        "percent_discount" : "Float",
        "constant_discount" : "Float",
    }

    special_template = {
        "specific_discounts" : [{
            "item" : "Reference,menuitem",
            "percent_discount" : "Float",
            "constant_discount" : "Float",
        }],
        "percent_discount" : "Float",
        "constant_discount" : "Float",
        "days" : ['M','Tu','W','Th','F','Sa','Su'],
    }

    loyaltymember_template = {
        "username" : "String",
        "firstname" : "String",
        "middlename" : "String",
        "lastname" : "String",
        "email" : "Email",
        "address_street" : "String",
        "address_city" : "String",
        "address_number" : "String",
        "address_state" : "String",
        "address_zip" : "Int",
        "pin" : "Int",
        "money_spent" : "Float",
        "birthday" : "Int,1,31",
        "birthmonth" : "Int,1,12",
        "phone_number" : "String",
        "coupons" : [{
            "coupon" : "Reference,coupon",
        }],
    }

    timesheet_template = {
        "employee" : "Reference,employee",
        # Stores times in utc format (milliseconds since epoch)
        "utc_start_time" : "Int",
        "utc_end_time" : "Int",
        "ongoing" : "MyBoolean",
    }

    table_template = {
        "number" : "Int",
        "needs_help" : "MyBoolean",
        "needs_refill" : "MyBoolean",
        "orders" : [{
            "order" : "Reference,order",
        }],
    }

    notification_template = {
        "order" : "Reference,order",
        "table" : "Reference,table",
        "meal_ready" : "MyBoolean",
        "call_waitstaff" : "MyBoolean",
        "call_management" : "MyBoolean",
        "request_refill" : "MyBoolean",
        "request_help" : "MyBoolean",
        "time_created" : "Int",
    }

    reservation_template = {
        "firstname" : "String",
        "lastname" : "String",
        "email" : "Email",
        "phone_number" : "Int",
        "num_people" : "Int",
    }