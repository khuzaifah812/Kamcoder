# DEVSPHERE LMS - Backend (Django + DRF + MySQL)

Full backend for the DEVSPHERE Library Management System frontend
(https://devspherelms.vercel.app/), replacing every `localStorage` read/write
in the original static site with a real Django REST API backed by MySQL.

## What this replaces

| Old localStorage key | New source of truth                                   |
|-----------------------|--------------------------------------------------------|
| `students`            | `accounts.Student` model (+ Django `User` for auth)     |
| `loggedInUser`        | `/api/auth/me/` (derived from the JWT access token)     |
| `libraryBooks`        | `books.Book` model                                      |
| `borrowedBooks`       | `borrowing.BorrowRecord` model                          |
| `notifications`       | `notifications.Notification` model                      |
| `isAdminLoggedIn`     | A real Django staff `User` account + JWT                |

## Project layout

```
lms_backend/
├── accounts/        # Student registration/login, admin login, student list
├── books/           # Book CRUD (admin-only writes, read for any logged-in user)
├── borrowing/       # Borrow/return, fine calculation, admin reports
├── notifications/   # Notification list/delete/clear + daily generator command
├── lms_backend/     # settings.py, urls.py
├── requirements.txt
└── .env.example
```

## 1. Setup

```bash
python3 -m venv venv
source venv/bin/activate          # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env               # then edit .env with your real values
```

### MySQL

Create the database once (via the `mysql` client or a GUI):

```sql
CREATE DATABASE devsphere_lms CHARACTER SET utf8mb4;
CREATE USER 'devsphere'@'localhost' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON devsphere_lms.* TO 'devsphere'@'localhost';
FLUSH PRIVILEGES;
```

Then set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` in `.env`
to match.

### Migrate + seed the admin account

```bash
python manage.py migrate
python manage.py seed_admin --username khuzaifah --password "a-strong-password"
```

This creates the staff account that replaces the old hard-coded
`khuzaifah` / `khuzaifah1234` check in `admin-login.html`.

### Run it

```bash
python manage.py runserver
```

API is now at `http://127.0.0.1:8000/api/`. Django admin (optional, for
poking at data directly) is at `http://127.0.0.1:8000/admin/` - create a
superuser for that with `python manage.py createsuperuser` if you want it.

## 2. Daily notification generation

The original frontend recomputed "due soon" / "overdue" notifications
every time `notifications.html` loaded (and duplicated them on every
load). That logic now lives server-side and is idempotent:

```bash
python manage.py generate_notifications
```

Schedule this once a day, e.g. with cron:

```
0 6 * * * /path/to/venv/bin/python /path/to/lms_backend/manage.py generate_notifications
```

## 3. API reference

All endpoints are prefixed with `/api`. Authenticated endpoints expect
`Authorization: Bearer <access_token>`.

### Auth

| Method | Path                      | Notes                                   |
|--------|---------------------------|------------------------------------------|
| POST   | `/auth/register/`         | `{fullname, registration, email, phone, course, password, confirm_password}` |
| POST   | `/auth/login/`             | `{registration, password}` -> `{student, access, refresh}` |
| GET    | `/auth/me/`                 | Current student's profile                |
| POST   | `/auth/token/refresh/`     | `{refresh}` -> new `access`              |
| POST   | `/auth/admin/login/`       | `{username, password}` -> `{access, refresh}` |
| GET    | `/auth/admin/students/`    | Admin-only: list of all students          |

### Books

| Method | Path              | Notes                              |
|--------|-------------------|-------------------------------------|
| GET    | `/books/`          | List/search (`?search=`), any logged-in user |
| POST   | `/books/`          | Admin-only: create                  |
| GET    | `/books/<id>/`     | Retrieve                            |
| PUT    | `/books/<id>/`     | Admin-only: update                  |
| DELETE | `/books/<id>/`     | Admin-only: delete                  |

### Borrowing

| Method | Path                      | Notes                                |
|--------|---------------------------|----------------------------------------|
| GET    | `/borrow/`                 | My borrow history (`?active=true` for active only) |
| POST   | `/borrow/borrow/`           | `{book_id}` -> borrow a book           |
| POST   | `/borrow/<id>/return/`     | Return a borrowed book                |
| GET    | `/borrow/fines/`            | My current fines                      |
| GET    | `/borrow/admin/reports/`   | Admin-only: stats, most-borrowed, overdue |

### Notifications

| Method | Path                     | Notes                    |
|--------|---------------------------|---------------------------|
| GET    | `/notifications/`          | My notifications           |
| DELETE | `/notifications/<id>/`     | Dismiss one                |
| DELETE | `/notifications/clear/`    | Clear all mine             |

## 4. Deploying

- Set `DEBUG=False`, a real `SECRET_KEY`, and your real domain in
  `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
- Run behind gunicorn/uwsgi + nginx (or your platform's WSGI runner) -
  never use `runserver` in production.
- Point `CORS_ALLOWED_ORIGINS` at `https://devspherelms.vercel.app` (already
  the default) plus any other origin you deploy the frontend to.

## 5. Frontend

The `frontend/` folder alongside this backend is the original DEVSPHERE
LMS static site, updated to call this API instead of `localStorage`. See
`frontend/api.js` for the shared fetch/JWT helper - update `API_BASE` at
the top of that file to point at wherever you deploy this backend.
