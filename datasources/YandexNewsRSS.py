import urllib.parse
from time import sleep
import time
import pymongo
import requests
from bs4 import BeautifulSoup
import datetime

request = 'хостинский'


class YandexNews(object):
    """YandexNews resive
        call GetNews to get data
    """

    # self.driver = webdriver.Chrome()

    def upload_news_from_search_count(self, request, count, startpoint=0):
        myclient = pymongo.MongoClient(
            'mongodb://%s:%s@188.120.231.51' % (urllib.parse.quote_plus('app'),
                                                urllib.parse.quote_plus('FJWE*uTej58E&')))
        mydb = myclient['MMM']
        d = mydb['Yandex_News']
        # realise search request
        quest = request
        request = urllib.parse.quote(request)

        # proxy = {'http': 'https//23.237.23.73:3128'} , proxies=proxy

        news = []

        try:
            i = 0
            y = True
            z = startpoint

            r = requests.get(
                'https://news.yandex.ru/yandsearch?text=' + request + '&rpt=nnews2&grhow=clutop' + '&p=' + str(
                    z))
            soup = BeautifulSoup(r.text, 'html.parser')
            # print(soup.prettify())
            elems = soup.find_all('li', class_="search-item")

            while y:

                news = []
                au = []

                for e in elems:
                    if (i < count):
                        i += 1
                        try:
                            if not (e.div.h2.a.get('href')[:4] == 'http'):
                                un = 'https://news.yandex.by' + e.div.h2.a.get('href')
                                au.append(un)
                        except Exception as e:
                            print(e)

                for u in au:
                    try:
                        sleep(10)
                        r = requests.get(u)
                        soup = BeautifulSoup(r.text, 'html.parser')
                        news.append({'title': soup.find('span', class_='story__head-wrap').text,
                                     'text': soup.find('div', class_='doc__text').text,
                                     'date': self.datef(soup.find('span', class_='story__source-time').text),
                                     'query': quest,
                                     'polarity': -2})
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
                            z))
                    soup = BeautifulSoup(r.text, 'html.parser')
                    # print(soup.prettify())
                    elems = soup.find_all('li', class_="search-item")
                    z += 1
                    print(news)
                    if not (news == []):
                        d.insert_many(news).inserted_ids
                        print('complete ' + str(z))
                    else:
                        print('void')


                except IOError as e:
                    print(e)
                    y = False
        except IOError as ee:
            print(ee)

    def datef(self, s):
        today = time.mktime(datetime.datetime.strptime(str(datetime.date.today()), "%Y-%m-%d").timetuple())
        if len(s) == 5:
            s = today + float(s[-5:-3]) * 3600 + float(s[-2:]) * 60
        elif s[:5] == 'вчера':
            s = today + float(s[-5:-3]) * 3600 + float(s[-2:]) * 60 - 86400
        elif len(s) > 13:
            s = today + (-datetime.date.today().day + float(s[:1])) * 86400 + float(s[-5:-3]) * 3600 + float(
                s[-2:]) * 60
        else:
            s = today
        return s


if __name__ == '__main__':
    d = YandexNews()
    d.upload_news_from_search_count(request, 200)