import urllib.parse

import requests
from bs4 import BeautifulSoup

from DB import DB

from time import sleep

class YandexNews(object):
    """YandexNews resive
        call GetNews to get data
    """

        # self.driver = webdriver.Chrome()

    def upload_news_from_search_count(self, request, count, startpoint = 0):
        d = DB.DB()
        # realise search request

        request = urllib.parse.quote(request)

        proxy = {'http': 'https//23.237.23.73:3128'}

        news = []

        try:
            i = 0
            y = True
            z = startpoint

            r = requests.get('https://news.yandex.ru/yandsearch?text=' + request + '&rpt=nnews2&grhow=clutop' + '&p=' + str(
                            z), proxies=proxy)
            soup = BeautifulSoup(r.text, 'html.parser')
            #print(soup.prettify())
            elems = soup.find_all('li', class_="search-item")

            while y:

                news = []
                au = []

                for e in elems:
                    if (i < count):
                        i += 1
                        try:
                            if not (e.div.h2.a.get('href')[:4]== 'http'):
                                un = 'https://news.yandex.by' + e.div.h2.a.get('href')
                                au.append(un)
                        except Exception as e:
                            print(e)

                for u in au:
                    try:
                        sleep(10)
                        r = requests.get(u, proxies=proxy)
                        soup = BeautifulSoup(r.text, 'html.parser')
                        news.append({'head': soup.find('span', class_='story__head-wrap').text,
                                     'text': soup.find('div', class_='doc__text').text,
                                     'date': soup.find('span', class_='story__source-time').text,
                                     'url': u,
                                     'query': request,
                                     'polarity': 0})
                    except Exception as e:
                        print(e)
                        print(u)

                if (i >= count):
                    y = False
                    break

                try:
                    sleep(10)
                    r = requests.get(
                        'https://news.yandex.ru/yandsearch?text=' + request + '&rpt=nnews2&grhow=clutop' + '&p=' + str(
                            z), proxies=proxy)
                    soup = BeautifulSoup(r.text, 'html.parser')
                    #print(soup.prettify())
                    elems = soup.find_all('li', class_="search-item")
                    z += 1
                    print(news)
                    if not (news == []):
                        d.add_news(news)
                        print('complete ' + str(z))
                    else:
                        print('void')
                    

                except IOError as e:
                    print(e)
                    y = False
        except IOError as ee:
            print(ee)

    def datef(self, s):

        d = []
        return d



# d = YandexNews()
# print(d.get_news_from_search_count('москва', 15))
# 1-5
# 5-8
# 15-18
