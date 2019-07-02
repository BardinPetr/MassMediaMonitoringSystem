#!/usr/bin/env python3
#coding:utf8

import requests, re

import os, time

import pymorphy2

morph = pymorphy2.MorphAnalyzer()

# morph.parse('признал')[0].normal_form

kvo = 10 # Количество отслеживаемых слов
minlen = 5 # Минимальная длинка слов
lookat = 50 # Количество слов, учитываемых в статистике



clear_list = ['.',',',':','»','«', '"']


while True:
    
    rawtitles = []
    al = ''
    di = {}



    def get_news(url, regexp):
        global rawtitles
        s = 'FIASCO'
        try:
            r = requests.get(url)
            if r.status_code == 200:
                a = (re.findall(regexp, r.text))
                ###
                rawtitles += a 
                s = ' '.join(a)
        except:
            pass
        return s

    def clear_str(s1, li):
        s2 = s1
        for iii in li:
            s2 = s2.replace(iii,'')
        return s2.lower()

    urlist = {'https://news.yandex.ru/':'data-counter=".*">(.*?)</a></h2>',
    'https://news.mail.ru/?from=menu':'photo__title photo__title_new photo__title_new_hidden.*?">(.*?)</span>',
    'https://ria.ru/':'<meta itemprop="name" content="(.*?)"><span',
    'https://www.rbc.ru/':'<span class="news-feed__item__title">\n\ *(.*?)\n',
    'http://www.vesti.ru/':'<h3 class="b-item__title"><a href=".*?">(.*?)</a> </h3>',
    'https://news.rambler.ru/?utm_source=head&utm_campaign=self_promo&utm_medium=nav&utm_content=main':'data-blocks="teaser::[0987654321]+::content">\n([^><"/]*?)\n',
    'https://rg.ru/':'<span class="b-link__inner-text">(.*?)</span>',
    'http://www.interfax.ru':'<a href=".*?" data-vr-headline>(.*?)</a></H3></div>'}


    # urlist = {


    for i in urlist.keys():
        s = get_news(i,urlist[i])
        if s == 'FIASCO':
            s = get_news(i,urlist[i])
        if s != 'FIASCO':
            al += s + ' '

    al = clear_str(al, clear_list)



    for ii in al.split():
        p = morph.parse(ii)[0]
        if p.tag.POS in ['NOUN']: # ,'VERB','INFN']:
            i = p.normal_form
            if len(i)>=minlen:
                if di.get(i, -1)<0:
                    di[i] = 1
                else:
                    di[i] = di[i] + 1
                
    di['0'] = 0
    ans = ['0']*(lookat +1)
    for i in di.keys():
        for j in range(lookat):
            ind = lookat-j-1
            if di[i] >= di[ans[ind]]:
                ans[ind+1] = ans[ind]
                ans[ind] = i
    
    
    f = open('last.txt','r')
    swr = f.read()
    f.close()
    lastd = eval(swr)
    
    topchange = {}
    status = {}
    for i in range(kvo):
        ch = lastd.get(ans[i], -1337) - i
        if ch < -1000:
            status[i] = 'NEW'
        else:
            if ch > 0:
                status[i] = '+'+str(ch)
            else:
                status[i] = str(ch)
    
    os.system('clear')
    
    print('{0:_>2}|{1:_^13}|{2:_^13}'.format(" №", "слово", "перемещение"))
    # print('{:_<31}'.format(''))
    for i in range(kvo):
        t = ''
        if status[i][0] == '+':
            t = '\033[0;42m'
        elif status[i][0] == '-':
            t = '\033[0;41m'
        else:
            t = '\033[0m'
        print(t+('{0:2d}|{1:13}|{2:^13}'.format(i+1, ans[i].upper(), status[i]))+'\033[0m')
        # print(ans[i], ' ', di[ans[i]], ' ', status[i])
    

    
    swr = "{"
    f = open('last.txt','w')
    for i in range(lookat):
        swr += "'"+ans[i]+"':"+ str(i)+","
    swr = swr[:-1]+'}'
    f.write(swr)
    f.close()
    
    time.sleep(77)
    
    # Определяем самое поднявшееся слово
    
    uppp = -1
    ind = -1
    
    for i in range(kvo):
        if status[i] == 'NEW':
            uppp = 1337
            ind = i
            break
        else:
            tem = int(status[i])
            if tem > uppp:
                uppp = tem
                ind = i
    
    
    os.system('clear')
    
    print('Рост '+status[ind]+' показало слово "'+ans[ind]+'"')
    cococo = 0
    for i in rawtitles:
        ii = []
        for j in clear_str(i, clear_list).split():
            ii.append(morph.parse(j)[0].normal_form)
        ### print(ii)
        if ans[ind] in ii:
            print(i)
            cococo +=1
        if cococo >=2:
            break
        
    time.sleep(33)
    
