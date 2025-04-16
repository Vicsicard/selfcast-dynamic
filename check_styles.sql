-- Query all style presets
SELECT 
    project_id,
    key,
    value
FROM dynamic_content
WHERE project_id IN ('standard-preset', 'her-preset', 'his-preset')
    OR key LIKE '%color%'
    OR key LIKE '%font%'
    OR key = 'style_package'
ORDER BY 
    CASE 
        WHEN project_id = 'standard-preset' THEN 1
        WHEN project_id = 'her-preset' THEN 2
        WHEN project_id = 'his-preset' THEN 3
        ELSE 4
    END,
    key;
