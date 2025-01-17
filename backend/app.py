from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import ApplicationConfig
from models import db, User, Task

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
server_session = Session(app)   
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/tasks", methods=["POST"])
def create_task():
    user_id = session.get("user_id")

    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    if "title" not in data:
        return jsonify({"error": "Title is required"}), 400

    title = data["title"]
    description = data.get("description", "")
    Tpriority = data.get("priority", 5)

    try:
        new_task = Task(
            title=title, 
            description=description, 
            priority=Tpriority,
            user_id=user_id
        )
        db.session.add(new_task)
        db.session.commit()

        print(new_task.id, new_task.title, new_task.description, new_task.priority, new_task.completed)

        return jsonify({
            "id": new_task.id,
            "title": new_task.title,
            "description": new_task.description,
            "priority": new_task.priority,
            "completed": new_task.completed
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create task"}), 500

@app.route("/tasks", methods=["GET"])
def get_tasks():
    user_id = session.get("user_id")

    if user_id is None:
        return jsonify({"error": "Unauthorized"}), 401

    tasks = Task.query.filter_by(user_id=user_id).all()

    return jsonify([{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "completed": task.completed
    } for task in tasks])

@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")

    return "200"

if __name__ == "__main__":
    app.run(debug=True)