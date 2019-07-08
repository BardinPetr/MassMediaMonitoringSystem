import multiprocessing
import os

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from yandex_geocoder import Client

from pool import MyPool


class GeoExtractor:
    def __init__(self):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getcwd().replace('parsers', '') + \
                                                       '/MassMediaMonitoring-302ad1ab0cf5.json'
        self.client = language.LanguageServiceClient()

    @staticmethod
    def process(entity):
        entity_type = enums.Entity.Type(entity.type)
        try:
            geo = Client.coordinates(entity.name)
        except Exception:
            return None
        return {
            "name": entity.name,
            "type": entity_type.name,
            "geo": list(map(float, geo))
        }

    def extract(self, text):
        try:
            document = types.Document(
                content=text.lower().title(),
                type=enums.Document.Type.PLAIN_TEXT)

            entities = self.client.analyze_entities(document=document).entities
            pool = MyPool(processes=multiprocessing.cpu_count())

            res = list(filter(lambda x: x is not None, pool.map(GeoExtractor.process, entities)))
            print("Processing of post finished with geocount: ", len(res))
            return res
        except Exception:
            return []
