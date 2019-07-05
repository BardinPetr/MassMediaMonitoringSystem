import YandexNewsRSS
import vkapi.simple_parser
from BD.DB import DB


class DataSourceProvider:
    def __init__(self):
        self.YandexN = YandexNewsRSS.YandexNews()
       # self.VK = vkapi.simple_parser.VKAPI()
        self.data_base = DB()

    def save_posts(self, quest, count):
        self.data_base.add_posts(self.VK.get_post(quest, count))

    def save_YNews(self):
        self.data_base.add_news(self.YandexN.Get_All_News())

c = DataSourceProvider()
#c.save_posts("hi", 200)
c.save_YNews()
