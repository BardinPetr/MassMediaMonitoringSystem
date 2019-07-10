import vk

session = vk.Session(access_token='6000d53e6000d53e6000d53eba606b4de4660006000d53e3d250522668e135d58bb36b6')
vkapi = vk.API(session)

profiles = vkapi.users.get(user_id=[385840465], v=5.12,fields='nickname, screen_name, sex, bdate (birthdate), city, country, timezone, photo, photo_medium, photo_big, has_mobile, contacts, education, online, counters, relation, last_seen, activity, can_write_private_message, can_see_all_posts, can_post, universities')

print(profiles)
