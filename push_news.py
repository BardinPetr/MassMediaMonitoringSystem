from datasources.YandexNewsRSS import YandexNews

l = ['Красная поляна', 'Адлер', 'Хоста', 'Сочи', 'Лазаревское', 'Туапсе', 'Геленжик', 'Анапа']

pusher = YandexNews()
for q in l:
    print('start ' + q)
    try:
        pusher.upload_news_from_search_count(q, 500, startpoint=9)
    except:
        pass
    print('finish ' + q)