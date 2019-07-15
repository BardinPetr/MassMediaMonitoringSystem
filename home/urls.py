from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

from home.api.views import map_data_endpoint, clusters_endpoint, clusters_endpoint_sa

urlpatterns = [
    path('api/points', map_data_endpoint),
    path('api/clusters', clusters_endpoint),
    path('api/clusters-sa', clusters_endpoint_sa),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]
