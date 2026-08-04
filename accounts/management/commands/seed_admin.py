from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import IntegrityError


class Command(BaseCommand):
    """Creates (or updates the password of) the library admin account.

    Replaces the frontend's hard-coded ADMIN_USER/ADMIN_PASS constants in
    admin-login.html. Run once after migrating:

        python manage.py seed_admin --username khuzaifah --password "change-me"
    """

    help = "Create or reset the library admin (staff) account."

    def add_arguments(self, parser):
        parser.add_argument("--username", default="khuzaifah")
        parser.add_argument("--password", required=True)

    def handle(self, *args, **options):
        username = options["username"]
        password = options["password"]

        user, created = User.objects.get_or_create(
            username=username, defaults={"is_staff": True, "is_superuser": False}
        )
        user.is_staff = True
        user.set_password(password)
        try:
            user.save()
        except IntegrityError as exc:
            self.stderr.write(str(exc))
            return

        verb = "Created" if created else "Updated"
        self.stdout.write(self.style.SUCCESS(f"{verb} admin account '{username}'."))
