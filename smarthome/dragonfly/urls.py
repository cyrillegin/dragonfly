from django.conf.urls import url, include
import views
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'sensors', views.SensorViewSet)
router.register(r'logs', views.LogViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browsable API.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^sendData', csrf_exempt(views.sendData.as_view()), name='sendData'),
    url(r'^addReading', csrf_exempt(views.addReading.as_view()), name='sendReading'),
    url(r'^addSensor', csrf_exempt(views.addSensor.as_view()), name='sendSensor'),

]
