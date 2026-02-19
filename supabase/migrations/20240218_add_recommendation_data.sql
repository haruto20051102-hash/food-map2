-- Insert sample recommendations
-- Assumes we have some spots in the database. 
-- We'll try to link spots based on their likely IDs or just insert generic ones if we can't find them, 
-- but since this is a migration, we should use a DO block to look up IDs.

DO $$
DECLARE
    spot1_id UUID;
    spot2_id UUID;
    spot3_id UUID;
BEGIN
    -- Try to find some spots to link. 
    -- This relies on the seed data being present. 
    -- If you want to link specific spots, you might want to look them up by name.
    -- For now, let's just pick 3 random spots.
    SELECT id INTO spot1_id FROM spots LIMIT 1 OFFSET 0;
    SELECT id INTO spot2_id FROM spots LIMIT 1 OFFSET 1;
    SELECT id INTO spot3_id FROM spots LIMIT 1 OFFSET 2;

    -- If we have at least 2 spots
    IF spot1_id IS NOT NULL AND spot2_id IS NOT NULL THEN
        -- Spot 1 recommends Spot 2
        INSERT INTO spot_recommendations (source_spot_id, target_spot_id, comment)
        VALUES (spot1_id, spot2_id, '最高の雰囲気で、デートにぴったりです。マスターのカクテルが絶品！');
        
        -- Spot 2 recommends Spot 1
        INSERT INTO spot_recommendations (source_spot_id, target_spot_id, comment)
        VALUES (spot2_id, spot1_id, '料理が美味しい隠れ家。仕事帰りによく寄ります。');
    END IF;

    -- If we have a 3rd spot
    IF spot1_id IS NOT NULL AND spot3_id IS NOT NULL THEN
         -- Spot 1 also recommends Spot 3
        INSERT INTO spot_recommendations (source_spot_id, target_spot_id, comment)
        VALUES (spot1_id, spot3_id, '静かに飲みたい時はここ。ジャズが流れる素敵な空間です。');
    END IF;

END $$;
