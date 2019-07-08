import datasources.simple_parser
from DB import DB
from datasources import YandexNewsRSS


class DataSourceProvider():
    def __init__(self):
        self.YandexN = YandexNewsRSS.YandexNews()
        self.VK = datasources.simple_parser.VKAPI()
        self.data_base = DB()

    def save_posts(self, query, count=10):
        data_vk = self.VK.get_post(query, count)

        posts = []
        #Parsing data_vk to posts and comments
        for i in range(count):
            posts.append(data_vk[i][0])


        self.data_base.add_posts(posts)
        #return posts, comments
        return 0

    def save_ya_news(self, request, count=10):
        self.data_base.add_news(self.YandexN.get_news_from_search_count(request, count))
        return 0


if __name__ == '__main__':
    request="цветы"
    Test_obj=DataSourceProvider()
    vk=Test_obj.save_posts(request, 12)
    ya=Test_obj.save_ya_news(request,12)
    print(ya)
