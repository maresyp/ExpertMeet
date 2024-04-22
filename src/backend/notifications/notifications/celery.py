import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "notifications.settings")

app = Celery("notifications")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Schedule the cleanup_old_entries task to run daily at midnight
app.conf.beat_schedule = {
    "cleanup-task": {
        "task": "service.tasks.cleanup_old_notifications",
        "schedule": crontab(hour=0, minute=0),  # Run at midnight every day
    },
}
