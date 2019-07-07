from multiprocessing.pool import Pool

from DB.DB import DB
from DB.DB_VKAPI import DataSourceProvider
from analytics.sentiment_analysis import SentimentAnalysis
from parsers.geoextractor import GeoExtractor

dsp = DataSourceProvider()
sn = SentimentAnalysis()
ge = GeoExtractor()
db = DB()

posts, comments = dsp.save_posts('поликлиника', 2)

print(posts)
print(comments)


def process_post(x):
    polarity = sn.get_polarity(x)
    geo = ge.extract(x)


def generate_map(query):
    return query
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
#         comment
#         value
#     }
# ]
