from functools import reduce
from multiprocessing.pool import Pool

from DB.DB import DB
from DB.DBSourcesConnector import DBSourcesConnector
from analytics.GeoExtractor import GeoExtractor
from analytics.SentimentAnalyser import SentimentAnalyser

dsp = DBSourcesConnector()
sn = SentimentAnalyser()
ge = GeoExtractor()
db = DB()


def process_post(post):
    try:
        polarity = sn.get_polarity(sn.check_spell(post['text']))
        return list(map(lambda x: [x['geo'][1], x['geo'][0], polarity, ''], ge.extract(post)))
    except:
        return []


def generate_map(query):
    cached = db.get_cache(query)
    if cached is None:
        dsp.save_posts(query, 24)

        pool = Pool(processes=8)
        try:
            res = pool.map(process_post, db.get_posts(query))
            res = reduce(lambda x, y: x + y, res, [])
            db.add_cache(query, res)
            return res
        except Exception:
            return []
    else:
        return cached['result']
