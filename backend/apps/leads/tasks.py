import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task
def send_lead_notification_email(lead_id):
    """Send email notification when a new lead is created."""
    logger.info(f'New lead notification: Lead ID {lead_id}')
    # TODO: Implement actual email sending via Django send_mail
    return f'Notification sent for lead {lead_id}'
