from DB.DB import DB
from datasources.VK import VK
from DB.YandexNewsRSS import YandexNews
from datasources.Twitter import Twitter


class DBSourcesConnector:
    def __init__(self):
        self.YandexN = YandexNews()
        self.data_base = DB()
        self.VK = VK()

    def save_posts(self, query):
        self.data_base.add_posts(self.VK.get_thousend_posts(query))

    def save_ya_news(self, query, count):
        self.data_base.add_news(self.YandexN.upload_news_from_search_count(query, count))

    def save_twits(self, query, count):
        pass

    def save_vk_users():
        self.data_base.