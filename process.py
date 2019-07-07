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
            list_of_info.append({'latitude':geo[i]['geo'][0], 'longitude':geo[i]['geo'][0], 'value': polarity, 'text':''})
    return list_of_info


def generate_map(query):
    cached = db.get_cache(query)
    if cached is None:
        posts = dsp.save_posts(query, 100)
        # news = dsp.save_ya_news(query, 20)

        pool = Pool(processes=4)
        m = pool.map_async(process_post, posts)
        m.wait()

        return m.get()

    else:
        return cached

#
# [
#     {
#         latitude
#         longitude
#         text
#         value
#     }
# ]
