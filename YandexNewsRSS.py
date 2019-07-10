import urllib.parse

import requests
from bs4 import BeautifulSoup

from BD.DB import DB


class YandexNews(object):
    """YandexNews resive
        call GetNews to get data
    """

    def __init__(self):
        """Constructor"""
        self.d = DB()
        # self.driver = webdriver.Chrome()

    def upload_news_from_search_count(self, request, count):
        # realise search request

        request = urllib.parse.quote(request)

        news = []

        try:
            r = requests.get('https://news.yandex.ru/yandsearch?text=' + request + '&rpt=nnews2&grhow=clutop')
            soup = BeautifulSoup(r.text, 'html.parser')
            elems = soup.find_all('li', class_="search-item")

            i = 0
            y = True
            z = 1

            news = []

            while y:

                au = []

                for e in elems:
                    if (i < count):
                        i += 1
                        un = 'https://news.yandex.by' + e.div.h2.a.get('href')
                        au.append(un)

                for u in au:
                    r = requests.get(u)
                    soup = BeautifulSoup(r.text, 'html.parser')
                    news.append({'head': soup.find('span', class_='story__head-wrap').text,
                                 'text': soup.find('div', class_='doc__text').text,
                                 'date': soup.find('span', class_='story__source-time').text})

                if (i >= count):
                    y = False
                    break

                try:
                    r = requests.get(
                        'https://news.yandex.ru/yandsearch?text=' + request + '&rpt=nnews2&grhow=clutop' + '&p=' + str(
                            z))
                    soup = BeautifulSoup(r.text, 'html.parser')
                    elems = soup.find_all('li', class_="search-item")
                    z += 1
                    self.d.add_news(news)
                    print('complete' + z)
                except Exception as e:
                    print(e)
                    y = False
        except Exception as ee:
            print(ee)

        return news


if (__name__ == '__main__'):
    d = YandexNews()
    d.upload_news_from_search_count('Сочи', 1000)

# d = YandexNews()
# print(d.get_news_from_search_count('москва', 15))
# 1-5
# 5-8
# 15-18
