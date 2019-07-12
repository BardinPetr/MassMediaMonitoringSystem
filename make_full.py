from datasources.new_vk import GetPosts

from DB.DB import DB

g = GetPosts()

a = DB()
a.add_posts(g.get_thousend_posts('Гагра'))
# https://colab.research.google.com/drive/1MKPCVPBsoXHuZGqyzminWGGmxvJu6nwz