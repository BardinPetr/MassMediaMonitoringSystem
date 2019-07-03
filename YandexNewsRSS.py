import requests, re
import time

import xml.etree.ElementTree as ET

Hedears = []
Text = []
News = []

def get_news(url, regexp):
    a = []
    try:
        r = requests.get(url)
        if r.status_code == 200:
            a = (re.findall(regexp, r.text))
    except:
        pass
    return a
'''
urlist = {'https://news.yandex.ru/Moscow/index.rss': 'data-counter=".*">(.*?)</title>'}

for i in urlist.keys():
    Hedears.append(get_news(i, urlist[i]))
'''
RegList = ['Barnaul', 'Blagoveshchensk', 'Arhangelsk', 'Astrahan', 'Belgorod',
    'Bryansk', 'Vladimir', 'Volgograd', 'Vologda', 'Voronezh', 'Birobidgan', 'Chita', 'Ivanovo', 'Irkutsk', 'Nalchik', 'Kaliningrad', 'Kaluga',
    'Petropavlovsk', 'Cherkessk', 'Kemerovo', 'Kirov', 'Kostroma', 'Krasnodar', 'Krasnoyarsk', 'Kurgan', 'Kursk',
    'Saint-Petersburg_and_Leningrad_Oblast', 'Lipetsk', 'Moscow', 'Moscow_and_Moscow_Oblast', 'Murmansk', 'Magadan', 'Nizhny_Novgorod',
    'Veliky_Novgorod', 'Novosibirsk', 'Omsk', 'Orenburg', 'Orel', 'Penza', 'Perm', 'Vladivostok', 'Pskov', 'Maykop', 'Gorno-Altaysk', 'Ufa',
    'Ulan-Ude', 'Makhachkala', 'Republic_of_Ingushetia', 'Petrozavodsk', 'Syktyvkar', 'Republic_of_Crimea', 'Yoshkar-Ola', 'Saransk',
    'Yakutsk', 'Vladikavkaz', 'Kazan', 'Abakan', 'Rostov-na-Donu', 'Ryazan', 'Samara', 'Saint_Petersburg', 'Saratov', 'Yuzhno-Sakhalinsk',
    'Yekaterinburg', 'Sevastopol', 'Smolensk', 'Stavropol', 'Tambov', 'Tver', 'Tomsk', 'Tula', 'Tyumen', 'Izhevsk', 'Ulyanovsk', 'Khabarovsk',
    'Khanty-Mansiysk', 'Chelyabinsk', 'Grozniy', 'Cheboksary', 'Salekhard', 'Yaroslavl']

n = 8

r = requests.get('https://news.yandex.ru/' + RegList[n] +'/index.rss')
root = ET.fromstring(r.text)

#print(root[0][5][0].text)
z = root[0]
#print(z)

for i in range(0, 10):
    News.append([root[0][i+5][0].text, root[0][i+5][3].text])

print(News)

