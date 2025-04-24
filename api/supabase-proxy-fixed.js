// Serverless function to proxy requests to Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const SUPABASE_URL = 'https://aqicztygjpmunfljjuto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { action, table, projectId } = req.query;
    
    // Get all project IDs
    if (action === 'getProjects') {
      const { data, error } = await supabase
        .from('dynamic_content')
        .select('project_id')
        .order('project_id');
      
      if (error) throw error;
      
      // Get unique project IDs
      const projectIds = [...new Set(data.map(item => item.project_id))];
      
      return res.status(200).json({ projectIds });
    }
    
    // Get content for a specific project
    if (action === 'getContent' && projectId) {
      const { data, error } = await supabase
        .from('dynamic_content')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw error;
      
      return res.status(200).json({ content: data });
    }
    
    // Save content for a specific project
    if (action === 'saveContent' && req.method === 'POST') {
      const { projectId, content } = req.body;
      
      // Process each content item
      const results = [];
      
      for (const item of content) {
        const { key, value } = item;
        
        // Check if the item already exists
        const { data: existingData, error: checkError } = await supabase
          .from('dynamic_content')
          .select('*')
          .eq('project_id', projectId)
          .eq('content_key', key)
          .maybeSingle();
        
        if (checkError) throw checkError;
        
        let result;
        
        if (existingData) {
          // Update existing record
          const { data, error } = await supabase
            .from('dynamic_content')
            .update({ content_value: value })
            .eq('project_id', projectId)
            .eq('content_key', key);
          
          if (error) throw error;
          result = { key, action: 'updated' };
        } else {
          // Insert new record
          const { data, error } = await supabase
            .from('dynamic_content')
            .insert([{ project_id: projectId, content_key: key, content_value: value }]);
          
          if (error) throw error;
          result = { key, action: 'inserted' };
        }
        
        results.push(result);
      }
      
      return res.status(200).json({ results });
    }
    
    // If no valid action is specified
    return res.status(400).json({ error: 'Invalid action' });
    
  } catch (error) {
    console.error('Supabase proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
};
