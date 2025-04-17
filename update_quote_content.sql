-- Add new quote cards and update profile image
-- This script adds only the missing keys needed for our new features

-- Project ID for Annie Sicard's site
-- If this project doesn't exist in your database yet, these entries will be created
-- If it does exist, only missing keys will be added or updated

-- Quote 1 (after Bio section)
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('annie-sicard-123', 'quote_1', '"Softness is not a weakness. It''s what happens when you''ve survived — and still choose to stay open."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Quote 2 (after Blog section)
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('annie-sicard-123', 'quote_2', '"Your truth doesn''t have to be loud to be real. The quiet parts of you deserve to be heard, too."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Quote 3 (after Social Media section)
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('annie-sicard-123', 'quote_3', '"The moment I stopped performing strength and started trusting my sensitivity… everything began to shift."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Update profile image URL to match what's in the HTML
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('annie-sicard-123', 'profile_image_url', 'https://imagestopost.carrd.co/assets/images/image07.jpg?v=98a7173f')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Add quotes to default project template (for future sites)
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'quote_1', '"Softness is not a weakness. It''s what happens when you''ve survived — and still choose to stay open."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'quote_2', '"Your truth doesn''t have to be loud to be real. The quiet parts of you deserve to be heard, too."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('default-project', 'quote_3', '"The moment I stopped performing strength and started trusting my sensitivity… everything began to shift."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Add quotes to style presets for consistency
INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'quote_1', '"Softness is not a weakness. It''s what happens when you''ve survived — and still choose to stay open."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'quote_2', '"Your truth doesn''t have to be loud to be real. The quiet parts of you deserve to be heard, too."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('standard-preset', 'quote_3', '"The moment I stopped performing strength and started trusting my sensitivity… everything began to shift."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'quote_1', '"Softness is not a weakness. It''s what happens when you''ve survived — and still choose to stay open."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'quote_2', '"Your truth doesn''t have to be loud to be real. The quiet parts of you deserve to be heard, too."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('her-preset', 'quote_3', '"The moment I stopped performing strength and started trusting my sensitivity… everything began to shift."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'quote_1', '"Softness is not a weakness. It''s what happens when you''ve survived — and still choose to stay open."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'quote_2', '"Your truth doesn''t have to be loud to be real. The quiet parts of you deserve to be heard, too."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO dynamic_content (project_id, key, value) 
VALUES ('his-preset', 'quote_3', '"The moment I stopped performing strength and started trusting my sensitivity… everything began to shift."')
ON CONFLICT (project_id, key) DO UPDATE SET value = EXCLUDED.value;

-- Query to verify the changes (uncomment to run)
-- SELECT * FROM dynamic_content WHERE key LIKE 'quote_%' OR key = 'profile_image_url';
