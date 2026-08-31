from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(70), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String (300), nullable=False)
    contacts = db.relationship('Contact', backref='user', lazy=True)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String (120), nullable=False)
    phone = db.Column(db.String (50), nullable=False)
    email = db.Column(db.String (120))
    address = db.Column(db.String (300))
    tag_work = db.Column(db.Boolean, default=False)
    tag_family = db.Column(db.Boolean, default=False)
    tag_friend = db.Column(db.Boolean, default=False)
    tag_other = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
