# ContactHub

ContactHub is a Flask-based contact management web application created for the SD204B Cloud Application Development individual project. It gives users a simple desktop dashboard for storing, searching, sorting, viewing, editing, and deleting personal contacts.

The project is designed as a personal online address book for friends, family, co-workers, and other contacts.

## Project Status

ContactHub is currently a functional Flask prototype intended for local development and assessment demonstration.

The assessment plan identifies AWS Elastic Beanstalk, Amazon RDS for PostgreSQL, and Amazon CloudWatch as the target cloud deployment and monitoring services. Cloud deployment configuration is not included in the current repository, so the application should be run locally unless those services are configured separately.

## Features

### Authentication

- User registration
- Username and password login
- Password hashing with Flask-Bcrypt
- Login error messages for invalid credentials
- Forgot-password flow with a temporary password
- Session-based access control using Flask-Login

### Contact management

- Add a contact with:
  - Name
  - Phone number
  - Email address
  - Address
  - Predefined categories
- View contact details in an overlay
- Edit existing contact information
- Delete a single contact
- Select multiple contacts in Manage Contacts mode
- Bulk-delete selected contacts after confirmation

### Search, sorting, and categories

- Search contacts by name
- Sort by:
  - Latest
  - Oldest
  - Alphabetical A–Z
  - Alphabetical Z–A
  - Tagged contacts first
- Predefined contact categories:
  - Work
  - Family
  - Friend
  - Other
- Display selected categories in the contact detail overlay

### Dashboard

- Contact total
- User profile area
- Contact list dashboard
- Alphabetical contact filtering
- Add Contact, View Profile, Manage Contacts, and Sign Out actions
- Confirmation overlays for destructive actions
- Flash-message feedback after server-side actions

## Technology Stack

- **Backend:** Python, Flask
- **Templating:** Jinja2
- **Database:** SQLite by default, with PostgreSQL supported through `DATABASE_URL`
- **ORM:** Flask-SQLAlchemy
- **Authentication:** Flask-Login
- **Password hashing:** Flask-Bcrypt
- **Configuration:** python-dotenv
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Version control:** Git and GitHub
- **Planned cloud services:** AWS Elastic Beanstalk, Amazon RDS for PostgreSQL, and Amazon CloudWatch

## Project Structure

```text
ContactHub_Prototype/
├── app.py
├── config.py
├── models.py
├── instance/
│   └── contacthub.db
├── static/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── Copilot_20260809_130103.png
│   │   ├── email_icon.svg
│   │   ├── phone_icon.svg
│   │   ├── search_icon.svg
│   │   └── signout_icon.svg
│   └── js/
│       ├── dashboard.js
│       ├── dashboard_overlay.js
│       └── overlay.js
├── templates/
│   ├── dashboard.html
│   ├── forgot_password.html
│   ├── login.html
│   └── register.html
└── README.md
```

## Prerequisites

- Python 3.10 or newer
- Git
- A modern desktop browser such as Chrome, Edge, or Firefox

## Local Installation

Clone the repository:

```bash
git clone https://github.com/Hambuk89/ContactHub_Prototype.git
cd ContactHub_Prototype
```

Create and activate a virtual environment:

### Windows PowerShell

```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install Flask Flask-SQLAlchemy Flask-Login Flask-Bcrypt python-dotenv
```

## Environment Variables

Create a `.env` file in the project root. Do not commit this file to a public repository.

```env
SECRET_KEY=replace-with-a-long-random-secret
DATABASE_URL=sqlite:///contacthub.db
```

`DATABASE_URL` is optional during local development because the application falls back to SQLite when it is not provided.

For PostgreSQL, replace it with a PostgreSQL connection string, for example:

```env
DATABASE_URL=postgresql://username:password@hostname:5432/contacthub
```

Use a secrets manager or environment variables for production credentials rather than storing them in source control.

## Running the Application

With the virtual environment activated, run:

```bash
python app.py
```

Open the local application in a browser:

```text
http://127.0.0.1:5000/
```

The database tables are created automatically when the application starts.

## Typical User Flow

1. Open the login page.
2. Register a new account if required.
3. Log in with the registered username and password.
4. Add contacts from the dashboard.
5. Search or sort the contact list.
6. Click a contact to view its details.
7. Edit or delete an individual contact.
8. Select **Manage Contacts** to select multiple cards.
9. Click **DELETE ALL** to review and confirm bulk deletion.
10. Sign out when finished.

## Main Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET`, `POST` | `/` | Display and process login |
| `GET`, `POST` | `/register` | Display and process registration |
| `GET`, `POST` | `/forgot_password` | Reset a password using username and email |
| `GET` | `/dashboard` | Display the authenticated user's dashboard |
| `POST` | `/profile/update` | Update the current user's profile |
| `POST` | `/contact/add` | Add a contact |
| `GET` | `/contact/<contact_id>/json` | Return contact data for editing |
| `POST` | `/contact/<contact_id>/update` | Update one contact |
| `POST` | `/contact/<contact_id>/delete` | Delete one contact |
| `POST` | `/contacts/delete` | Delete multiple selected contacts |
| `POST` | `/signout` | End the current session |

## Data Model

### User

- `id`
- `username`
- `password`
- `phone`
- `email`
- `address`

### Contact

- `id`
- `name`
- `phone`
- `email`
- `address`
- `tag_work`
- `tag_family`
- `tag_friend`
- `tag_other`
- `created_at`
- `user_id`

Each contact belongs to a user through `user_id`. The four categories are currently stored as Boolean fields rather than as separate custom Tag records.

## Testing and Acceptance Criteria

The project assessment identifies the following acceptance areas:

- Correct and incorrect login behavior
- Registration and password recovery
- Dashboard profile and contact totals
- Contact list display
- Name search
- Date, alphabetical, and tagged sorting
- Add, view, edit, and delete contact flows
- Bulk deletion
- Category assignment and display
- Desktop-browser usability

Before submitting or deploying the application, manually verify the complete flow using a test account and test contacts. Destructive actions should be checked with both one selected contact and multiple selected contacts.

## Planned Cloud Deployment

The assessment plan proposes the following AWS architecture:

```text
User browser
    |
    v
AWS Elastic Beanstalk
    |
    v
Amazon RDS for PostgreSQL
    |
    v
Amazon CloudWatch monitoring and logs
```

Recommended production tasks before deployment:

1. Add a production dependency file such as `requirements.txt`.
2. Add a production WSGI entry point and Elastic Beanstalk configuration.
3. Move from the SQLite fallback to a managed PostgreSQL database.
4. Store `SECRET_KEY` and `DATABASE_URL` as managed environment secrets.
5. Add database migrations instead of relying only on `db.create_all()`.
6. Configure CloudWatch logs, health checks, and alarms.
7. Remove local database files, virtual environments, and `.env` files from version control.
8. Verify that every contact operation is scoped to the authenticated user.
9. Run the full acceptance checklist after deployment.

## Known Limitations

- The current interface is designed primarily for desktop use.
- Contact profile image storage is not implemented in the current data model.
- Categories are predefined Boolean fields; custom tag creation and deletion are not currently implemented.
- The repository does not currently include a dependency lock or `requirements.txt`.
- The local SQLite database is suitable for development, not a production deployment.
- AWS deployment and CloudWatch configuration are described in the assessment plan but are not included in this repository.

## Future Improvements

- Add custom tag CRUD and tag filtering.
- Add contact profile image upload and storage.
- Add a `requirements.txt` file and deployment configuration.
- Add database migrations with Flask-Migrate or Alembic.
- Add automated unit and integration tests.
- Improve responsive behavior for tablet and mobile layouts.
- Add pagination for larger contact lists.
- Add stronger authorization checks to every contact endpoint.
- Add CSRF protection to form submissions.
- Add password-change confirmation and account security settings.

## Academic Context

This project was created for the SD204B Cloud Application Development assessment at Yoobee College of Creative Innovation. The assessment focuses on application planning, software requirements, UX/UI design, implementation, cloud deployment, and monitoring.

## Repository

[ContactHub_Prototype on GitHub](https://github.com/Hambuk89/ContactHub_Prototype)