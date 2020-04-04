from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FloatField, FormField, IntegerField, TextAreaField, SelectField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, Length, Optional

class BirthdayForm(FlaskForm):
    day = IntegerField('DD', [DataRequired("Please Enter a valid Day")])
    month = IntegerField('MM', [DataRequired("Please Enter a valid Month")])
    year = IntegerField('YYYY', [DataRequired("Please Enter a valid Year")])

class EmpLogin(FlaskForm):
    user = StringField('Username', [DataRequired("Please Enter a username")])
    password = PasswordField('Password', [DataRequired("Please Enter a password")])

    empSubmitLog = SubmitField('Sign In')

class EmpRegister(FlaskForm):
    first = StringField('First Name', [DataRequired()])
    last = StringField('Last Name', [DataRequired()])

    classifier = SelectField('Role', choices=[('manage','Management'),('wait','WaitStaff'),('kitchen','KitchenStaff')])

    user = StringField('Employee ID', [DataRequired("Please Enter a username")])
    password = PasswordField('Password', [DataRequired("Please Enter a password")])

    empSubmitReg = SubmitField('Register')

class LoyLogin(FlaskForm):
    email = EmailField('Email Address', [DataRequired(), Email()])
    user = StringField('Username', [DataRequired()])
    password = PasswordField('Password', [DataRequired(),Length(3, 16, "Please enter a password between 3 and 16 characters long")])

    LoySubmitLog = SubmitField('Sign In')

class LoySignup(FlaskForm):
    first = StringField('First Name', [DataRequired()])
    last = StringField('Last Name', [DataRequired()])
    dob = FormField(BirthdayForm, separator='/')

    email = EmailField('Email Address', [DataRequired(), Email()])
    user = StringField('Username', [DataRequired()])
    password = PasswordField('Password', [DataRequired(),Length(3,16,"Please enter a password between 3 and 16 characters long")])

    #maybe implement flask-recaptcha?

    loySubmitSign = SubmitField('Sign Up')

class ContactUs(FlaskForm):
    first = StringField('First Name', [DataRequired()])
    last = StringField('Last Name', [DataRequired()])

    comment = TextAreaField('Let us know...', [DataRequired()])

    contactSubmit = SubmitField('Submit')