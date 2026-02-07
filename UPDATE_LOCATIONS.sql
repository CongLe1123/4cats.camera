-- Update the locations column in store_settings table (ID = 1)
-- This updates locations with new dynamic social_links structure, preserving core contact info.

UPDATE public.store_settings
SET locations = '[
  {
    "name": "Cơ sở 1 - Cầu Giấy (CSKH & Bảo Hành)", 
    "address": "Số 6A2, ngõ 158 Nguyễn Khánh Toàn, Quan Hoa, Cầu Giấy, Hà Nội", 
    "iframe_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8481119837325!2d105.79822241030531!3d21.038762580532197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3edc7bd19d%3A0xe62497f72909045d!2zNmEyIE5nLiAxNTggxJAuIE5ndXnhu4VuIEtow6FuaCBUb8OgbiwgUXVhbiBIb2EsIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpIDEwMDAwLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1770485061727!5m2!1sen!2s", 
    "phone": "039 824 9856", 
    "email": "fourcatscamera@gmail.com", 
    "social_links": [
        { "platform": "Facebook", "url": "https://www.facebook.com/profile.php?id=100093056073018", "label": "Fanpage" },
        { "platform": "Zalo", "url": "https://zalo.me/0398249856", "label": "Zalo Chat" }
    ]
  }, 
  {
    "name": "Cơ sở 2 - Thanh Xuân", 
    "address": "Số 51 Nguyễn Trãi, Ngã tư Sở, Thanh Xuân, Hà Nội", 
    "iframe_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7608510508912!2d105.81966159999999!3d21.0022214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac84fafbf469%3A0xbc58d65e5e48b023!2zNTEgxJAuIE5ndXnhu4VuIFRyw6NpLCBOZ8OjIFTGsCBT4bufLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpIDEwMDAwMCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1770485168357!5m2!1sen!2s", 
    "phone": "093 235 68 69", 
    "email": "fourcatscamera@gmail.com", 
    "social_links": [
        { "platform": "Facebook", "url": "https://www.facebook.com/profile.php?id=100093056073018", "label": "Fanpage" },
        { "platform": "Zalo", "url": "https://zalo.me/0932356869", "label": "Zalo Chat" }
    ]
  }
]'::jsonb
WHERE id = 1;
