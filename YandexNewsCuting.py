import requests, re
import time

Hedears = []

def get_news(url, regexp):
    a = []
    try:
        r = requests.get(url)
        if r.status_code == 200:
            a = (re.findall(regexp, r.text))
    except:
        pass
    return a

def clear_str(s1, li):
    s2 = s1
    for iii in li:
        s2 = s2.replace(iii,'')
    return s2.lower()

'''
urlist = {'https://news.yandex.ru/': 'data-counter=".*">(.*?)</a></h2>',
    'https://news.mail.ru/?from=menu': 'photo__title photo__title_new photo__title_new_hidden.*?">(.*?)</span>',
    'https://ria.ru/': '<meta itemprop="name" content="(.*?)"><span',
    'https://www.rbc.ru/': '<span class="news-feed__item__title">\n\ *(.*?)\n',
    'http://www.vesti.ru/': '<h3 class="b-item__title"><a href=".*?">(.*?)</a> </h3>',
    'https://news.rambler.ru/?utm_source=head&utm_campaign=self_promo&utm_medium=nav&utm_content=main': 'data-blocks="teaser::[0987654321]+::content">\n([^><"/]*?)\n',
    'https://rg.ru/': '<span class="b-link__inner-text">(.*?)</span>',
    'http://www.interfax.ru': '<a href=".*?" data-vr-headline>(.*?)</a></H3></div>'}
'''
urlist = {'https://news.yandex.ru/': 'data-counter=".*">(.*?)</a></h2>'}

for i in urlist.keys():
    Hedears.append(get_news(i, urlist[i]))

print(Hedears)