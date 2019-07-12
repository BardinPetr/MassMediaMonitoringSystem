from DB.DB import DB
from datasources.Twitter import Twitter
from datasources.VK import VK
from datasources.YandexNewsRSS import YandexNews


class DBSourcesConnector:
    def __init__(self):
        self.YandexN = YandexNews()
        self.Twitter = Twitter()
        self.data_base = DB()
        self.VK = VK()

    def save_posts(self, query):
        self.data_base.add_posts(self.VK.get_posts(query))

    def save_ya_news(self, query, count):
        self.data_base.add_news(self.YandexN.upload_news_from_search_count(query, count))

    def save_twits(self, query, count):
        self.data_base.add_twits(self.Twitter.get_posts(query, count))
