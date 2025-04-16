-- Query all content grouped by project
SELECT 
    project_id,
    string_agg(key || ': ' || value, E'\n') as content_details
FROM dynamic_content
GROUP BY project_id
ORDER BY 
    CASE 
        WHEN project_id = 'default-project' THEN 1
        WHEN project_id = 'standard-preset' THEN 2
        WHEN project_id = 'her-preset' THEN 3
        WHEN project_id = 'his-preset' THEN 4
        ELSE 5
    END;

-- Alternative: Query all rows without grouping
SELECT 
    project_id,
    key,
    value
FROM dynamic_content
ORDER BY 
    CASE 
        WHEN project_id = 'default-project' THEN 1
        WHEN project_id = 'standard-preset' THEN 2
        WHEN project_id = 'her-preset' THEN 3
        WHEN project_id = 'his-preset' THEN 4
        ELSE 5
    END,
    key;
