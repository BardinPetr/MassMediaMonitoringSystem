from django.db import models


class MapItem(models.Model):
    lat = models.TextField('lat', max_length=128)
    lon = models.TextField('lon', max_length=128)
    comment = models.TextField('comment', max_length=4096)
    value = models.IntegerField('value')

    def __str__(self):
        return "{0}:{1}".format(self.lat, self.lon)

    class Meta:
        ordering = ['-lat', '-lon']
        verbose_name = 'lat'
        verbose_name_plural = 'lat'
