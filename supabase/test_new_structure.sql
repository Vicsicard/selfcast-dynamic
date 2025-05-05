-- Test inserting a record with the new social media key structure
-- Replace 'test-project' with an actual project_id that exists in your database

-- Insert a test Facebook post with new numbered format
INSERT INTO dynamic_content (project_id, key, value)
VALUES ('test-project', 'facebook_post_2', 'This is a test post using the new numbered format for Facebook posts. This confirms that the key-value structure works with our updated naming scheme.');

-- Insert a test Facebook title with new numbered format
INSERT INTO dynamic_content (project_id, key, value)
VALUES ('test-project', 'facebook_title_2', 'Test Facebook Post 2');

-- Verify the records were inserted
SELECT * FROM dynamic_content 
WHERE project_id = 'test-project' 
AND (key = 'facebook_post_2' OR key = 'facebook_title_2');

-- Test with other platforms as needed
INSERT INTO dynamic_content (project_id, key, value)
VALUES ('test-project', 'twitter_post_3', 'Test post for Twitter using the new numbered format structure.');

INSERT INTO dynamic_content (project_id, key, value)
VALUES ('test-project', 'twitter_title_3', 'Test Twitter Post 3');

-- Verify again
SELECT * FROM dynamic_content 
WHERE project_id = 'test-project' 
AND (key LIKE 'facebook_%' OR key LIKE 'twitter_%')
ORDER BY key;
