import urllib.parse
import xml.etree.ElementTree as ET

import requests
from bs4 import BeautifulSoup

'''
urlist = {'https://news.yandex.ru/Moscow/index.rss': 'data-counter=".*">(.*?)</title>'}

for i in urlist.keys():
    Hedears.append(get_news(i, urlist[i]))
'''
RegList = ['Barnaul', 'Blagoveshchensk', 'Arhangelsk', 'Astrahan', 'Belgorod',
           'Bryansk', 'Vladimir', 'Volgograd', 'Vologda', 'Voronezh', 'Birobidgan', 'Chita', 'Ivanovo', 'Irkutsk',
           'Nalchik', 'Kaliningrad', 'Kaluga',
           'Petropavlovsk', 'Cherkessk', 'Kemerovo', 'Kirov', 'Kostroma', 'Krasnodar', 'Krasnoyarsk', 'Kurgan', 'Kursk',
           'Saint-Petersburg_and_Leningrad_Oblast', 'Lipetsk', 'Moscow', 'Moscow_and_Moscow_Oblast', 'Murmansk',
           'Magadan', 'Nizhny_Novgorod',
           'Veliky_Novgorod', 'Novosibirsk', 'Omsk', 'Orenburg', 'Orel', 'Penza', 'Perm', 'Vladivostok', 'Pskov',
           'Maykop', 'Gorno-Altaysk', 'Ufa',
           'Ulan-Ude', 'Makhachkala', 'Republic_of_Ingushetia', 'Petrozavodsk', 'Syktyvkar', 'Republic_of_Crimea',
           'Yoshkar-Ola', 'Saransk',
           'Yakutsk', 'Vladikavkaz', 'Kazan', 'Abakan', 'Rostov-na-Donu', 'Ryazan', 'Samara', 'Saint_Petersburg',
           'Saratov', 'Yuzhno-Sakhalinsk',
           'Yekaterinburg', 'Sevastopol', 'Smolensk', 'Stavropol', 'Tambov', 'Tver', 'Tomsk', 'Tula', 'Tyumen',
           'Izhevsk', 'Ulyanovsk', 'Khabarovsk',
           'Khanty-Mansiysk', 'Chelyabinsk', 'Grozniy', 'Cheboksary', 'Salekhard', 'Yaroslavl']


class YandexNews(object):
    """YandexNews resive
        call GetNews to get data
    """

    def __init__(self):
        """Constructor"""
        # self.driver = webdriver.Chrome()

    def get_news(self, x):
        """
        x - number of region
        :param x:
        :return: list of news
        'Barnaul'0, 'Blagoveshchensk'1, 'Arhangelsk'2, 'Astrahan'3, 'Belgorod'4,
    'Bryansk'5, 'Vladimir'6, 'Volgograd'7, 'Vologda'8, 'Voronezh'9, 'Birobidgan'10, 'Chita'11, 'Ivanovo'12, 'Irkutsk'13, 'Nalchik'14,
    'Kaliningrad'15, 'Kaluga'16, 'Petropavlovsk'17, 'Cherkessk'18, 'Kemerovo'19, 'Kirov'20, 'Kostroma'21, 'Krasnodar'22, 'Krasnoyarsk'23
    'Kurgan'24, 'Kursk'25,'Saint-Petersburg_and_Leningrad_Oblast'27, 'Lipetsk'28, 'Moscow'29, 'Moscow_and_Moscow_Oblast'30, 'Murmansk'31
    'Magadan'32, 'Nizhny_Novgorod'33,'Veliky_Novgorod'34, 'Novosibirsk'35, 'Omsk',36 'Orenburg'37, 'Orel'38, 'Penza'40, 'Perm'41,
    'Vladivostok'42, 'Pskov'43, 'Maykop'44, 'Gorno-Altaysk'45, 'Ufa','Ulan-Ude'46, 'Makhachkala'47, 'Republic_of_Ingushetia'48
    'Petrozavodsk'49, 'Syktyvkar'50, 'Republic_of_Crimea'51, 'Yoshkar-Ola'52, 'Saransk'53,'Yakutsk'54, 'Vladikavkaz'55, 'Kazan', 'Abakan'56,
    'Rostov-na-Donu'57, 'Ryazan'58, 'Samara'59, 'Saint_Petersburg'60, 'Saratov'61, 'Yuzhno-Sakhalinsk'62,'Yekaterinburg'63, 'Sevastopol'64,
    'Smolensk'65, 'Stavropol'66, 'Tambov'67, 'Tver'68, 'Tomsk'69, 'Tula'70, 'Tyumen'71, 'Izhevsk'72, 'Ulyanovsk'73, 'Khabarovsk'74,
    'Khanty-Mansiysk'75, 'Chelyabinsk'76, 'Grozniy'77, 'Cheboksary'78, 'Salekhard'79, 'Yaroslavl'80
        """
        News = []
        r = requests.get('https://news.yandex.ru/' + RegList[x] + '/index.rss')
        root = ET.fromstring(r.text)
        if r.status_code == 200:
            root = ET.fromstring(r.text)
            for i in range(0, 5):
                News.append({"head": root[0][i + 5][0].text, "text": root[0][i + 5][3].text,
                             "date": root[0][i + 5][4].text[0:-15]})

        return News

    def get_all_news(self):
        """
        function return all news of Russia
        ~800 news
        """
        Bnews = []
        for i in range(81):
            Bnews += self.get_news(i)
        return Bnews

    def get_news_from_search_count(self, request, count):
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
                except:
                    y = False
        except:
            pass

        return news

# d = YandexNews()
# print(d.get_news_from_search_count('москва', 15))
# 1-5
# 5-8
# 15-18
