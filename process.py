from functools import reduce
from multiprocessing.pool import Pool

from DB.DB import DB
from DB.DB_VKAPI import DataSourceProvider
from analytics.sentiment_analysis import SentimentAnalysis
from parsers.geoextractor import GeoExtractor

dsp = DataSourceProvider()
sn = SentimentAnalysis()
ge = GeoExtractor()
db = DB()


def process_post(post):
    list_of_info = []
    post = post['text']

    try:
        polarity = sn.get_polarity(sn.check_spell(post))

        geo = ge.extract(post)
        for i in range(len(geo)):
            list_of_info.append(
                [geo[i]['geo'][1], geo[i]['geo'][0], polarity, ''])
        return list_of_info
    except:
        print("No text")
        return []


def generate_map(query):
    cached = db.get_cache(query)
    if cached is None:
        posts, comments = dsp.save_posts(query, 16)
        # news = dsp.save_ya_news(query, 20)

        pool = Pool(processes=8)
        try:
            res = pool.map(process_post, posts)
            cashed = reduce(lambda x, y: x + y, res, [])
            db.add_cache(query, cached)
            return cached
        except Exception:
            return []
    else:
        return cached['result']

#
# [
#     {
#         latitude
#         longitude
#         text
#         value
#     }
# ]
