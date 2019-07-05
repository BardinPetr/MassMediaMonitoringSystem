from VKK import VKAPI
from base import DB

vk = VKAPI()
db = DB()

db.add_posts(vk.vk())
