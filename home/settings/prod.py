"""Use this for production"""

from .base import *

DEBUG = False
ALLOWED_HOSTS += ['http://smartheatmap.ddns.net', 'smartheatmap.ddns.net', '188.120.231.51']
WSGI_APPLICATION = 'home.wsgi.prod.application'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
