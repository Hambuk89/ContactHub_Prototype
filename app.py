from flask import Flask, flash, render_template, request, redirect, url_for
from models import db, User, Contact
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from dotenv import load_dotenv
import os

# load environment variables from .env file
load_dotenv()

# new Flask application instance
app = Flask(__name__)

# app configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///contacthub.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email Configuration (Based on Gmail)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = TRUE
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')


# Database and Bcrypt instances
mail = Mail(app)
db.init_app(app)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.login_view = "login_page"
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

with app.app_context():
    db.create_all()



# Route Pages
# login pages (First page)
@app.route("/", methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            flash('Login successful! You are all set to go! Click here to go to the dashboard.')
            return redirect(url_for('dashboard_page'))
        else:
            flash('Incorrect password. Please try again or reset your password.')
            return redirect(url_for('login_page'))
    return render_template('login.html')

# Register Page
@app.route("/register", methods=['GET', 'POST'])
def register_page():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        phone = request.form['phone']
        email = request.form['email']
        address = request.form['address']

        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            username=username,
            password=hashed_pw,
            phone=phone,
            email=email,
            address=address
        )

        db.session.add(new_user)
        db.session.commit()

        flash("Registration complete! Please log in.")
        return redirect(url_for('login_page'))

    return render_template('register.html')


@app.route("/forgot_password", methods=['GET', 'POST'])
def forgot_password_page():
    
    return render_template('forgot_password.html')

@app.route("/dashboard")
@login_required
def dashboard_page():
    contacts = Contact.query.filter_by(user_id=current_user.id).all()
    total_contacts = len(contacts)
    tagged_contacts = len([c for c in contacts if any([
        c.tag_work, c.tag_family, c.tag_friend, c.tag_other
    ])])

    return render_template(
        'dashboard.html',
        contacts=contacts,
        total_contacts=total_contacts,
        tagged_contacts=tagged_contacts
    )

@app.route("/profile/update", methods=['POST'])
@login_required
def update_profile():
    current_user.username = request.form['username']
    current_user.phone = request.form['phone']
    current_user.email= request.form['email']
    current_user.address = request.form['address']
    db.session.commit()
    flash('Profile updated successfully.')
    return redirect(url_for('dashboard_page'))

@app.route("/contact/add", methods=['POST'])
@login_required
def add_contact():
    contact = contact(
        name=request.form['name'],
        phone=request.form['phone'],
        email=request.form['email'],
        address=request.form['address'],
        tag_work=('work' in request.form),
        tag_family=('family' in request.form),
        tag_friend=('friend' in request.form),
        tag_other=('other' in request.form),
        user_id=current_user.id
    )
    db.session.add(contact)
    db.session.commit()
    flash('Contact added successfully.')
    return redirect(url_for('dashboard_page'))

@app.route("/contact/<int:contact_id>/update", methods=['POST'])
@login_required
def update_contact(contact_id):
    contact = Contact.query.get_or404(contact_id)
    contact.name = request.form['name']
    contact.phone = request.form['phone']
    contact.email = request.form['email']
    contact.address = request.form['address']
    contact.tag_work = request.form['tag_work']
    contact.tag_family = request.form['tag_family']
    contact.tag_friend = request.form['tag_friend']
    contact.tag_other = request.form['tag_other']
    db.session.commit()
    flash('Contact details updated successfully.')
    return redirect(url_for('dashboard_page'))

@app.route("/contact/<int:contact_id>/delete", methods=['POST'])
@login_required
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    db.session.delete(contact)
    db.session.commit()
    flash('Contact deleted successfully.')
    return redirect(url_for('dashboard_page'))

@app.route("/signout", methods=['POST'])
@login_required
def sign_out():
    logout_user()
    return redirect(url_for('login_page'))

if __name__ == '__main__':
    app.run(debug=True)

