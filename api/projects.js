// Serverless function to fetch projects from Supabase
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://aqicztygjpmunfljjjuto.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Fetch projects from Supabase
    const { data, error } = await supabase
      .from('dynamic_content')
      .select('project_id')
      .order('project_id');
    
    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Get unique project IDs
    const projectIds = [...new Set(data.map(item => item.project_id))];
    
    // Return the projects
    return res.status(200).json({ projects: projectIds });
  } catch (error) {
    console.error('Exception fetching projects:', error);
    return res.status(500).json({ error: error.message });
  }
};
