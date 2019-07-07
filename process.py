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

    polarity = sn.get_polarity(sn.check_spell(post))

    geo = ge.extract(post)
    for i in range(len(geo)):
        list_of_info.append(
            {'latitude': str(geo[i]['geo'][0]), 'longitude': str(geo[i]['geo'][1]), 'value': '1', 'text': ''})
    return list_of_info


def generate_map(query):
    cached = db.get_cache(query)
    if cached is None:
        # posts = dsp.save_posts(query, 10)[0]
        # news = dsp.save_ya_news(query, 20)

        posts = [
            {
                "text": "В Москве ул Плеханова 30 поставили хорошую скамейку"
            }
        ]

        pool = Pool(processes=8)
        res = pool.map(process_post, posts)
        return reduce(lambda x, y: x + y, res, [])
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
