#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and available on your PYTHONPATH environment variable? Did you forget to activate a virtual environment?"
        ) from exc

    # Automatically use IP address and port
    default_args = ["manage.py", "runserver", "192.168.25.62:8000"]
    execute_from_command_line(sys.argv if len(sys.argv) > 1 else default_args)
