from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    tasks = db.relationship('Task', backref='user')

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.Integer, default=0)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)