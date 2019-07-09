import multiprocessing
from functools import reduce

from DB.DB import DB
from DB.DBSourcesConnector import DBSourcesConnector
from analytics.GeoExtractor import GeoExtractor
from analytics.SentimentAnalyser import SentimentAnalyser
from pool import MyPool

dsp = DBSourcesConnector()
sn = SentimentAnalyser()
ge = GeoExtractor()
db = DB()


def process_post(post):
    text = sn.check_spell(post['text'])
    print("Processing post: ", text[:20])

    polarity = sn.get_polarity(text)
    return list(map(lambda x:
                    [
                        x['geo'][1],
                        x['geo'][0],
                        polarity,
                        text
                    ],
                    ge.extract(text)))


def generate_map(query):
    cached = db.get_cache(query)
    if cached is None:
        dsp.save_posts(query, 24)
        pool = MyPool(processes=multiprocessing.cpu_count())
        res = pool.map(process_post, db.get_posts(query)[:200])
        res = reduce(lambda x, y: x + y, res, [])
        db.add_cache(query, res)
        return res
    else:
        return cached['result']
