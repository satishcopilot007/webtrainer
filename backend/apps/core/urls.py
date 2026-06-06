from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.SiteSettingsView.as_view(), name='site-settings'),
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-create'),
    path('faq/', views.FAQListView.as_view(), name='faq-list'),
]
