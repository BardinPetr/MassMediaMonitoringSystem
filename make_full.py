from datasources.VK import VK

from DB.DB import DB

g = VK()

a = DB()
#a.add_posts(g.get_thousend_posts('новороссийск'))
# https://colab.research.google.com/drive/1MKPCVPBsoXHuZGqyzminWGGmxvJu6nwz

print(a.add_vk_users(g.get_users_info()))