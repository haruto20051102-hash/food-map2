-- Insert dummy spots for testing Match feature
-- Assumes at least one user exists in auth.users

WITH first_user AS (
    SELECT id FROM auth.users ORDER BY created_at LIMIT 1
)
INSERT INTO spots (
    name, 
    type, 
    description, 
    location, 
    lat, 
    lng, 
    images, 
    tags, 
    is_hidden, 
    listing_status, 
    business_hours, 
    opening_time, 
    closing_time, 
    regular_holiday, 
    user_id,
    created_at,
    updated_at
)
SELECT 
    d.name,
    d.type,
    d.description,
    d.location,
    d.lat,
    d.lng,
    d.images,
    d.tags,
    false, -- is_hidden
    'active', -- listing_status
    d.business_hours,
    d.opening_time::time,
    d.closing_time::time,
    d.regular_holiday,
    first_user.id,
    NOW(),
    NOW()
FROM first_user, (VALUES 
    (
        '古民家カフェ 楓 (Kaede)', 
        'Cafe', 
        '築100年の古民家を改装した隠れ家カフェ。裏路地にひっそりと佇み、自家焙煎の深い味わいのコーヒーと、季節のフルーツを使った手作りケーキが自慢です。静かなジャズが流れる店内で、時間を忘れてゆっくりとお過ごしください。', 
        '茨城県水戸市泉町2丁目', 
        36.375, 140.468, 
        ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop'], 
        ARRAY['古民家', '静か', 'コーヒー', 'スイーツ'], 
        '10:00 - 18:00', '10:00', '18:00', '水曜日'
    ),
    (
        'Bar "The Library"', 
        'Bar', 
        '看板のない、知る人ぞ知るオーセンティックバー。本棚の本を引くと隠し扉が開く仕掛けになっています。世界中から集めた希少なウイスキーと、マスターオリジナルのカクテルを楽しめます。大人だけの秘密基地のような空間です。', 
        '茨城県水戸市大工町1丁目', 
        36.378, 140.465, 
        ARRAY['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop'], 
        ARRAY['隠れ家', 'ウイスキー', 'カクテル', 'デート'], 
        '19:00 - 26:00', '19:00', '02:00', '日曜日'
    ),
    (
        'イタリアン食堂 ロッソ', 
        'Italian', 
        '地元の有機野菜をふんだんに使ったカジュアルイタリアン。外観は普通の民家ですが、中に入るとアットホームな温かい空間が広がります。石窯で焼くナポリピッツァは絶品。ランチタイムは予約必須の人気店です。', 
        '茨城県つくば市天久保', 
        36.105, 140.105, 
        ARRAY['https://images.unsplash.com/photo-1595295333158-4742f28fbd85?q=80&w=2680&auto=format&fit=crop'], 
        ARRAY['イタリアン', 'ピザ', '野菜', 'ランチ'], 
        '11:30 - 22:00', '11:30', '22:00', '月曜日'
    ),
    (
        '和食 旬彩 ', 
        'Japanese', 
        'ビルの地下にある、カウンター8席のみの小さな和食店。毎朝市場で仕入れる新鮮な魚介と、店主が厳選した日本酒のペアリングを楽しめます。メニューはおまかせコースのみ。特別な日に訪れたい名店です。', 
        '茨城県水戸市南町3丁目', 
        36.372, 140.473, 
        ARRAY['https://images.unsplash.com/photo-1616035905090-67c4eb4955b2?q=80&w=2670&auto=format&fit=crop'], 
        ARRAY['和食', '日本酒', '魚介', 'コース'], 
        '18:00 - 23:00', '18:00', '23:00', '不定休'
    ),
    (
        'Jazz Cafe Blue Note', 
        'Cafe', 
        '伝説のジャズレコードが壁一面に並ぶカフェバー。昼はこだわりのカレー、夜はお酒と音楽を楽しめます。時々行われる生演奏ライブは必見。音楽好きが集まる心地よい空間です。', 
        '茨城県ひたちなか市勝田', 
        36.395, 140.525, 
        ARRAY['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2669&auto=format&fit=crop'], 
        ARRAY['ジャズ', 'カレー', '音楽', 'ライブ'], 
        '12:00 - 24:00', '12:00', '00:00', '木曜日'
    ),
    (
        'Boulangerie Le Matin', 
        'Bakery', 
        '森の中に佇む小さなパン屋さん。天然酵母と国産小麦にこだわり、長時間発酵させて焼き上げるハード系のパンが評判です。テラス席では焼きたてのパンとコーヒーを楽しめます。早朝から行列ができることも。', 
        '茨城県笠間市芸術の森', 
        36.360, 140.240, 
        ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2672&auto=format&fit=crop'], 
        ARRAY['パン', 'テラス', '朝食', '森'], 
        '07:00 - 15:00', '07:00', '15:00', '月・火曜日'
    )
) AS d(name, type, description, location, lat, lng, images, tags, business_hours, opening_time, closing_time, regular_holiday);
