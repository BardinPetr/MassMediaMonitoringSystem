import subprocess
import sys
import os

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home.settings.dev")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    if sys.argv[1] == "runserver":
        subprocess.call(["/usr/bin/npm", "run-script", "dev"])

    execute_from_command_line(sys.argv)
