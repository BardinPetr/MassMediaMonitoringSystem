import os

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from yandex_geocoder import Client


class GeoExtractor:
    def __init__(self):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getcwd().replace('parsers', '') + \
                                                       '/MassMediaMonitoring-302ad1ab0cf5.json'
        self.client = language.LanguageServiceClient()

    def extract(self, text):
        res = []

        document = types.Document(
            content=text.title(),
            type=enums.Document.Type.PLAIN_TEXT)

        entities = self.client.analyze_entities(document=document).entities
        for entity in entities:
            entity_type = enums.Entity.Type(entity.type)
            # print(entity.name, entity_type.name)
            try:
                # assert entity_type.name in ['ADDRESS', 'LOCATION', 'OTHER']
                geo = Client.coordinates(entity.name)
            except Exception:
                continue

            res.append({
                "name": entity.name,
                "type": entity_type.name,
                "geo": list(map(float, geo))
            })
        return res
