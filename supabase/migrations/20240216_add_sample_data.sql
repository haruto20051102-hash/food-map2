-- Insert Sample Spots

-- 1. Parking YES, Proxy YES (Expiring Soon - 30 days left)
INSERT INTO spots (
    name, type, description, location, lat, lng,
    business_hours, opening_time, closing_time, regular_holiday,
    has_parking, is_proxy, subscription_expires_at,
    listing_status, is_hidden, user_id,
    images
)
VALUES (
    'ドライブイン 筑波', 
    'Restaurant', 
    '筑波山の麓にある、駐車場完備の絶品定食屋。トラック運転手にも人気です。', 
    'つくば市, 茨城県', 
    36.2, 140.1, -- Approx
    '10:00 - 20:00', '10:00', '20:00', '水曜日',
    true, -- Has Parking
    true, -- Is Proxy
    (NOW() + INTERVAL '30 days'), -- Expiring soon
    'active', false,
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['https://placehold.co/600x400/orange/white?text=DriveIn']
);

-- 2. Parking NO, Proxy YES (Safe - 300 days left)
INSERT INTO spots (
    name, type, description, location, lat, lng,
    business_hours, opening_time, closing_time, regular_holiday,
    has_parking, is_proxy, subscription_expires_at,
    listing_status, is_hidden, user_id,
    images
)
VALUES (
    '駅前バル 310', 
    'Bar', 
    '水戸駅徒歩2分。駐車場はありませんが、駅近でアクセス抜群です。', 
    '水戸市, 茨城県', 
    36.3659, 140.4712, -- Mito Station
    '18:00 - 24:00', '18:00', '24:00', '日曜日',
    false, -- No Parking
    true, -- Is Proxy
    (NOW() + INTERVAL '300 days'), -- Safe
    'active', false,
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['https://placehold.co/600x400/black/white?text=Bar310']
);

-- 3. Parking YES, Proxy NO (Owners spot)
INSERT INTO spots (
    name, type, description, location, lat, lng,
    business_hours, opening_time, closing_time, regular_holiday,
    has_parking, is_proxy, subscription_expires_at,
    listing_status, is_hidden, user_id,
    images
)
VALUES (
    'ガーデンカフェ OAK', 
    'Cafe', 
    '広い庭と駐車場がある郊外のカフェ。ペット可。', 
    'ひたちなか市, 茨城県', 
    36.39, 140.53, 
    '09:00 - 18:00', '09:00', '18:00', '木曜日',
    true, -- Has Parking
    false, -- Not Proxy
    (NOW() + INTERVAL '1 year'),
    'active', false,
    (SELECT id FROM auth.users LIMIT 1),
    ARRAY['https://placehold.co/600x400/green/white?text=GardenCafe']
);
