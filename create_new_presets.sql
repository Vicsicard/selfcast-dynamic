-- Create Green Preset
INSERT INTO dynamic_content (project_id, key, value)
VALUES 
('green-preset', 'primary_color', '#28a745'),
('green-preset', 'secondary_color', '#20c997'),
('green-preset', 'accent_color', '#17a2b8'),
('green-preset', 'text_color', '#212529'),
('green-preset', 'background_color', '#f8f9fa'),
('green-preset', 'heading_font', 'Montserrat'),
('green-preset', 'body_font', 'Open Sans');

-- Create Red Preset
INSERT INTO dynamic_content (project_id, key, value)
VALUES 
('red-preset', 'primary_color', '#dc3545'),
('red-preset', 'secondary_color', '#fd7e14'),
('red-preset', 'accent_color', '#6f42c1'),
('red-preset', 'text_color', '#212529'),
('red-preset', 'background_color', '#fff5f5'),
('red-preset', 'heading_font', 'Raleway'),
('red-preset', 'body_font', 'Roboto');
