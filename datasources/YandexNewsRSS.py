import urllib.parse

import requests
from bs4 import BeautifulSoup

from DB import DB


class YandexNews(object):
    """YandexNews resive
        call GetNews to get data
    """

    # self.driver = webdriver.Chrome()

    def upload_news_from_search_count(self, request, count):
        d = DB.DB()
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

            while y:

                # news = []
                au = []

                for e in elems:
                    if (i < count):
                        i += 1
                        un = 'https://news.yandex.by' + e.div.h2.a.get('href')
                        au.append(un)

                for u in au:
                    try:
                        r = requests.get(u)
                        soup = BeautifulSoup(r.text, 'html.parser')
                        news.append({'head': soup.find('span', class_='story__head-wrap').text,
                                     'text': soup.find('div', class_='doc__text').text,
                                     'date': soup.find('span', class_='story__source-time').text,
                                     'url': u})
                    except Exception as e:
                        print(e)
                        print(u)

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
                    # print(news)

                    print('complete ' + str(z))
                except IOError as e:
                    print(e)
                    y = False
        except IOError as ee:
            print(ee)

        d.add_news(news)

# d = YandexNews()
# print(d.get_news_from_search_count('москва', 15))
# 1-5
# 5-8
# 15-18
