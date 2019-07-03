import os
import sys

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

    # if sys.argv[1] == "runserver":
    #     print(os.spawnl(os.P_WAIT, "/bin/bash /usr/bin/node /usr/lib/node_modules/npm/bin/npm-cli.js run dev"))

    execute_from_command_line(sys.argv)
