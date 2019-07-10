from DB.YandexNewsRSS import YandexNews

pusher = YandexNews()

pusher.upload_news_from_search_count('Сочи',1000)