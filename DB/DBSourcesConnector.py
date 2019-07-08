from DB.DB import DB
from datasources.VK import VKAPI
from datasources.YandexNewsRSS import YandexNews


class DBSourcesConnector:
    def __init__(self):
        self.YandexN = YandexNews()
        self.data_base = DB()
        self.VK = VKAPI()

    def save_posts(self, query, count=10):
        self.data_base.add_posts(self.VK.get_post(query, count))
        return 0

    def save_ya_news(self, query, count=10):
        self.data_base.add_news(self.YandexN.get_news_from_search_count(query, count))
        return 0


if __name__ == '__main__':
    request = "цветы"
    Test_obj = DBSourcesConnector()
    vk = Test_obj.save_posts(request, 12)
    ya = Test_obj.save_ya_news(request, 12)
    print(ya)
