// Supabase Connection Module
// This file provides reliable connection to Supabase for the SelfCast Dynamic editor

// Supabase configuration
const SUPABASE_URL = 'https://aqicztygjpmunfljjuto.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxaWN6dHlnanBtdW5mbGpqdXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDU1ODIsImV4cCI6MjA1OTI4MTU4Mn0.5e2hvTckSSbTFLBjQiccrvjoBd6QQDX0X4tccFOc1rs';

// Debug logging function
function logDebug(message, data) {
    if (window.debugMode) {
        const timestamp = new Date().toISOString().substring(11, 19);
        const formattedMessage = typeof data !== 'undefined' 
            ? `[${timestamp}] ${message}: ${JSON.stringify(data, null, 2)}`
            : `[${timestamp}] ${message}`;
        
        console.log(message, data);
        
        const debugInfo = document.getElementById('debug-info');
        if (debugInfo) {
            debugInfo.style.display = 'block';
            debugInfo.innerHTML += formattedMessage + '<br>';
            debugInfo.scrollTop = debugInfo.scrollHeight;
        }
    } else {
        console.log(message, data);
    }
}

// Load projects from Supabase
async function loadProjects() {
    try {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = 'Loading projects...';
            statusElement.className = 'status info';
        }
        
        logDebug('Fetching projects from', `${SUPABASE_URL}/rest/v1/dynamic_content?select=project_id`);
        
        const response = await fetch(`${SUPABASE_URL}/rest/v1/dynamic_content?select=project_id`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        logDebug('Projects response status', `${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        logDebug('Projects data received', data.length);
        
        // Get unique project IDs
        const projectIds = [...new Set(data.map(item => item.project_id))];
        logDebug('Unique project IDs', projectIds.length);
        
        return projectIds;
    } catch (error) {
        console.error('Error loading projects:', error);
        logDebug('Error loading projects', error.message);
        throw error;
    }
}

// Load content for a specific project
async function loadContent(projectId) {
    try {
        if (!projectId) {
            throw new Error('No project ID specified');
        }
        
        logDebug('Loading content for project', projectId);
        
        // Use the URL format that worked in verification
        const url = `${SUPABASE_URL}/rest/v1/dynamic_content?select=*&project_id=eq.${encodeURIComponent(projectId)}`;
        logDebug('Fetching content from', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        logDebug('Response status', `${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        logDebug('Content data received', data.length);
        
        if (!data || data.length === 0) {
            throw new Error(`No content found for project: ${projectId}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error loading content:', error);
        logDebug('Error loading content', error.message);
        throw error;
    }
}

// Save content for a specific project
async function saveContent(projectId, contentItems) {
    try {
        if (!projectId) {
            throw new Error('No project ID specified');
        }
        
        if (!contentItems || !Array.isArray(contentItems) || contentItems.length === 0) {
            throw new Error('No content items to save');
        }
        
        logDebug('Saving content for project', projectId);
        logDebug('Content items to save', contentItems.length);
        
        const results = [];
        
        // Process each content item
        for (const item of contentItems) {
            try {
                // Check if the item already exists
                const checkUrl = `${SUPABASE_URL}/rest/v1/dynamic_content?project_id=eq.${encodeURIComponent(projectId)}&key=eq.${encodeURIComponent(item.key)}`;
                logDebug('Checking if item exists', checkUrl);
                
                const checkResponse = await fetch(checkUrl, {
                    method: 'GET',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!checkResponse.ok) {
                    throw new Error(`Failed to check item: ${checkResponse.status} ${checkResponse.statusText}`);
                }
                
                const existingData = await checkResponse.json();
                
                if (existingData && existingData.length > 0) {
                    // Update existing record
                    const updateUrl = `${SUPABASE_URL}/rest/v1/dynamic_content?project_id=eq.${encodeURIComponent(projectId)}&key=eq.${encodeURIComponent(item.key)}`;
                    logDebug('Updating existing item', updateUrl);
                    
                    const updateResponse = await fetch(updateUrl, {
                        method: 'PATCH',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({ value: item.value })
                    });
                    
                    if (!updateResponse.ok) {
                        throw new Error(`Failed to update item: ${updateResponse.status} ${updateResponse.statusText}`);
                    }
                    
                    results.push({ key: item.key, action: 'updated' });
                } else {
                    // Insert new record
                    const insertUrl = `${SUPABASE_URL}/rest/v1/dynamic_content`;
                    logDebug('Inserting new item', insertUrl);
                    
                    const insertResponse = await fetch(insertUrl, {
                        method: 'POST',
                        headers: {
                            'apikey': SUPABASE_KEY,
                            'Authorization': `Bearer ${SUPABASE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            project_id: projectId,
                            key: item.key,
                            value: item.value
                        })
                    });
                    
                    if (!insertResponse.ok) {
                        throw new Error(`Failed to insert item: ${insertResponse.status} ${insertResponse.statusText}`);
                    }
                    
                    results.push({ key: item.key, action: 'inserted' });
                }
            } catch (error) {
                console.error('Error saving item:', item, error);
                logDebug('Error saving item', { key: item.key, error: error.message });
                results.push({ key: item.key, action: 'error', error: error.message });
            }
        }
        
        logDebug('Save results', results);
        return results;
    } catch (error) {
        console.error('Error saving content:', error);
        logDebug('Error saving content', error.message);
        throw error;
    }
}

// Create a new project
async function createProject(projectId, initialContent = {}) {
    try {
        if (!projectId) {
            throw new Error('No project ID specified');
        }
        
        logDebug('Creating new project', projectId);
        
        // Check if project already exists
        const checkUrl = `${SUPABASE_URL}/rest/v1/dynamic_content?project_id=eq.${encodeURIComponent(projectId)}&limit=1`;
        logDebug('Checking if project exists', checkUrl);
        
        const checkResponse = await fetch(checkUrl, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!checkResponse.ok) {
            throw new Error(`Failed to check project: ${checkResponse.status} ${checkResponse.statusText}`);
        }
        
        const existingData = await checkResponse.json();
        
        if (existingData && existingData.length > 0) {
            throw new Error(`Project ${projectId} already exists`);
        }
        
        // Create initial content items
        const contentItems = [
            { key: 'rendered_title', value: 'New Site' },
            { key: 'rendered_subtitle', value: 'Your subtitle here' },
            { key: 'rendered_bio_html', value: 'Your bio content here' },
            { key: 'style_package', value: 'standard-professional' }
        ];
        
        // Add any additional initial content
        for (const [key, value] of Object.entries(initialContent)) {
            if (!contentItems.some(item => item.key === key)) {
                contentItems.push({ key, value });
            }
        }
        
        // Insert all content items
        const results = await saveContent(projectId, contentItems);
        
        logDebug('Project creation results', results);
        return results;
    } catch (error) {
        console.error('Error creating project:', error);
        logDebug('Error creating project', error.message);
        throw error;
    }
}

// Export functions
window.SupabaseConnection = {
    loadProjects,
    loadContent,
    saveContent,
    createProject,
    logDebug
};
