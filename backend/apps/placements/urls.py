from django.urls import path
from . import views

urlpatterns = [
    path('', views.PlacementListView.as_view(), name='placement-list'),
    path('featured/', views.FeaturedPlacementsView.as_view(), name='placement-featured'),
    path('partners/', views.HiringPartnerListView.as_view(), name='hiring-partner-list'),
]
