import YandexNewsRSS
from BD.DB import DB
import vkapi.simple_parser

class DataSourceProvider:
    def __init__(self):
        self.YandexN = YandexNewsRSS.YandexNews()
        self.VK = vkapi.simple_parser.VKAPI()
        self.data_base = DB()

    def save_posts(self, quest, count):
        data_vk=self.VK.get_post(quest, count)
        comments=[]
        posts=[]
        for i in range(count):
            posts.append(data_vk[i][0])
            for j in range(len(data_vk[i][1])):
                print(data_vk[i][1])
                if data_vk[i][1][j]['text']!='0':
                    comments.append(data_vk[i][1][j])
        if len(comments)>0:
            self.data_base.add_comments(comments)
        print(data_vk[0])
        self.data_base.add_posts(posts)

    def save_YNews(self):
        self.data_base.add_news(self.YandexN.get_news(1))


c = DataSourceProvider()
c.save_posts("бабка", 200)
