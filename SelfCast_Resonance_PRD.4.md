# SelfCast Resonance PRD - Part 4: User Interface & Implementation Plan

## 4. User Interface Design

### 4.1 Resonance Studio Interface

The Resonance Studio is the central interface where clients create content that fosters authentic connection with their audience. It combines the power of Novel AI with insights from the client's interview and style profile.

#### 4.1.1 Interface Layout

```
┌─────────────────────────────────────────────────────┐
│ RESONANCE STUDIO                                    │
├─────────────┬───────────────────┬───────────────────┤
│             │                   │                   │
│  AUTHENTIC  │    NOVEL AI       │   ENGAGEMENT      │
│  MOMENTS    │    EDITOR         │   PREVIEW         │
│             │                   │                   │
│  [Story 1]  │  ┌───────────┐    │  ┌───────────┐    │
│  [Story 2]  │  │           │    │  │           │    │
│  [Story 3]  │  │           │    │  │           │    │
│  [Value 1]  │  │           │    │  │           │    │
│  [Value 2]  │  │           │    │  │           │    │
│             │  └───────────┘    │  └───────────┘    │
│             │                   │                   │
├─────────────┴───────────────────┴───────────────────┤
│                                                     │
│  RESONANCE TOOLS                                    │
│                                                     │
│  [Create Connection] [Deepen Story] [Invite Sharing]│
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 4.1.2 Component Implementation

```javascript
// src/components/ResonanceStudio.jsx
import React, { useEffect, useState } from 'react';
import { ResonanceEditor } from '../modules/resonance/novel-integration';
import { AuthenticMomentsList } from './AuthenticMomentsList';
import { EngagementPreview } from './EngagementPreview';
import { ResonanceTools } from './ResonanceTools';

export function ResonanceStudio({ projectId }) {
  const [clientData, setClientData] = useState(null);
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadClientData() {
      try {
        setLoading(true);
        
        // Fetch all necessary data
        const data = await fetchClientData(projectId);
        setClientData(data);
        
        // Initialize the editor
        const resonanceEditor = new ResonanceEditor(data);
        await resonanceEditor.initialize('novel-editor');
        setEditor(resonanceEditor);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    loadClientData();
    
    // Cleanup
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [projectId]);
  
  async function fetchClientData(projectId) {
    // Fetch all data needed for the Resonance Studio
    const [transcriptAnalyzer, styleProfileEnhancer, contentEnhancer] = await Promise.all([
      import('../modules/discovery/transcript-analyzer'),
      import('../modules/identity/style-profile-enhancer'),
      import('../modules/foundation/content-enhancer')
    ]);
    
    // Create instances
    const analyzer = new transcriptAnalyzer.TranscriptAnalyzer();
    const enhancer = new styleProfileEnhancer.StyleProfileEnhancer();
    const contentEnhancerInstance = new contentEnhancer.ContentEnhancer();
    
    // Fetch data in parallel
    const [resonanceMap, enhancedProfile, enhancedContent] = await Promise.all([
      analyzer.fetchResonanceMap(projectId),
      enhancer.fetchEnhancedProfile(projectId),
      contentEnhancerInstance.fetchEnhancedContent(projectId)
    ]);
    
    return {
      projectId,
      transcriptInsights: resonanceMap.topConnectionPoints || [],
      styleProfile: enhancedProfile,
      enhancedContent
    };
  }
  
  if (loading) {
    return <div className="loading">Loading Resonance Studio...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="resonance-studio">
      <h1>Resonance Studio</h1>
      
      <div className="studio-layout">
        <div className="authentic-moments-panel">
          <h2>Authentic Moments</h2>
          <AuthenticMomentsList 
            moments={clientData.transcriptInsights}
            onInsert={(moment) => {
              if (editor) {
                editor.insertContent(moment.content);
              }
            }}
          />
        </div>
        
        <div className="editor-panel">
          <h2>Create Your Content</h2>
          <div id="novel-editor" className="novel-editor"></div>
        </div>
        
        <div className="engagement-preview-panel">
          <h2>Engagement Preview</h2>
          <EngagementPreview 
            editor={editor}
            styleProfile={clientData.styleProfile}
          />
        </div>
      </div>
      
      <div className="resonance-tools-panel">
        <ResonanceTools 
          editor={editor}
          styleProfile={clientData.styleProfile}
        />
      </div>
    </div>
  );
}
```

### 4.2 Authentic Moments Panel

The Authentic Moments panel displays the client's most powerful stories, values, and insights from their interview, organized by emotional impact and relatability.

```javascript
// src/components/AuthenticMomentsList.jsx
import React from 'react';

export function AuthenticMomentsList({ moments, onInsert }) {
  // Group moments by type
  const stories = moments.filter(m => m.universalThemes.includes('personal-growth') || m.universalThemes.includes('overcoming-challenges'));
  const values = moments.filter(m => m.universalThemes.includes('purpose') || m.universalThemes.includes('relationships'));
  const insights = moments.filter(m => !stories.includes(m) && !values.includes(m));
  
  return (
    <div className="authentic-moments-list">
      <div className="moments-section">
        <h3>Your Stories</h3>
        {stories.map((moment, index) => (
          <MomentCard 
            key={`story-${index}`}
            moment={moment}
            type="story"
            onInsert={onInsert}
          />
        ))}
      </div>
      
      <div className="moments-section">
        <h3>Your Values</h3>
        {values.map((moment, index) => (
          <MomentCard 
            key={`value-${index}`}
            moment={moment}
            type="value"
            onInsert={onInsert}
          />
        ))}
      </div>
      
      <div className="moments-section">
        <h3>Your Insights</h3>
        {insights.map((moment, index) => (
          <MomentCard 
            key={`insight-${index}`}
            moment={moment}
            type="insight"
            onInsert={onInsert}
          />
        ))}
      </div>
    </div>
  );
}

function MomentCard({ moment, type, onInsert }) {
  // Create a preview of the moment
  const preview = moment.content.length > 100 
    ? moment.content.substring(0, 100) + '...'
    : moment.content;
  
  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'story': return '📖';
      case 'value': return '💎';
      case 'insight': return '💡';
      default: return '📝';
    }
  };
  
  return (
    <div className={`moment-card ${type}`} onClick={() => onInsert(moment)}>
      <div className="moment-icon">{getIcon()}</div>
      <div className="moment-preview">{preview}</div>
      <div className="moment-meta">
        <div className="connection-score">
          Connection: {Math.round(moment.connectionScore * 100)}%
        </div>
        <div className="themes">
          {moment.universalThemes.map(theme => (
            <span key={theme} className="theme-tag">{theme}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 4.3 Engagement Preview Panel

The Engagement Preview panel provides real-time feedback on how readers might emotionally respond to the content, highlighting moments of potential connection and suggesting improvements.

```javascript
// src/components/EngagementPreview.jsx
import React, { useEffect, useState } from 'react';
import { EngagementAnalyzer } from '../modules/resonance/engagement-analyzer';

export function EngagementPreview({ editor, styleProfile }) {
  const [analysis, setAnalysis] = useState(null);
  const analyzer = new EngagementAnalyzer();
  
  useEffect(() => {
    if (!editor) return;
    
    // Update analysis when content changes
    const updateInterval = setInterval(() => {
      const content = editor.getContent();
      if (content) {
        const newAnalysis = analyzer.analyzeContent(content);
        setAnalysis(newAnalysis);
      }
    }, 2000); // Update every 2 seconds
    
    return () => clearInterval(updateInterval);
  }, [editor]);
  
  if (!analysis) {
    return <div className="no-content">Start writing to see engagement preview</div>;
  }
  
  return (
    <div className="engagement-preview">
      <div className="connection-score-display">
        <h3>Connection Potential</h3>
        <div className="score-meter">
          <div 
            className="score-fill" 
            style={{ width: `${analysis.connectionScore * 100}%` }}
          ></div>
        </div>
        <div className="score-label">
          {Math.round(analysis.connectionScore * 100)}%
        </div>
      </div>
      
      <div className="connection-moments">
        <h3>Connection Moments</h3>
        {analysis.connectionMoments.length > 0 ? (
          <ul className="moments-list">
            {analysis.connectionMoments.map((moment, index) => (
              <li key={index} className={`moment ${moment.type}`}>
                {moment.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-moments">No connection moments detected yet</p>
        )}
      </div>
      
      <div className="emotional-resonance">
        <h3>Emotional Resonance</h3>
        {analysis.emotionalResonance.primaryEmotion ? (
          <>
            <div className="primary-emotion">
              Primary emotion: <strong>{analysis.emotionalResonance.primaryEmotion}</strong>
            </div>
            <div className="emotion-diversity">
              Emotional diversity: {Math.round(analysis.emotionalResonance.diversity * 100)}%
            </div>
          </>
        ) : (
          <p className="no-emotions">No clear emotions detected yet</p>
        )}
      </div>
      
      <div className="improvement-suggestions">
        <h3>Suggestions</h3>
        {analysis.connectionSuggestions.length > 0 ? (
          <ul className="suggestions-list">
            {analysis.connectionSuggestions.map((suggestion, index) => (
              <li key={index} className="suggestion">
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-suggestions">Your content is creating good connection!</p>
        )}
      </div>
    </div>
  );
}
```

### 4.4 Resonance Tools

The Resonance Tools panel provides specialized tools for creating reader connection, deepening stories, and inviting sharing.

```javascript
// src/components/ResonanceTools.jsx
import React from 'react';
import { OpenAI } from 'openai';

export function ResonanceTools({ editor, styleProfile }) {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  });
  
  async function createConnection() {
    if (!editor) return;
    
    const content = editor.getContent();
    if (!content) return;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: `You are an expert at creating "me too" moments in content. 
                     Create a paragraph that helps readers see themselves in the story.
                     Voice characteristics: ${JSON.stringify(styleProfile.voiceCharacteristics)}`
          },
          { 
            role: "user", 
            content: `Based on this content, create a paragraph that helps readers connect:
                     ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      });
      
      const connectionParagraph = completion.choices[0].message.content;
      editor.insertContent(connectionParagraph);
    } catch (error) {
      console.error('Error creating connection:', error);
    }
  }
  
  async function deepenStory() {
    if (!editor) return;
    
    const content = editor.getContent();
    if (!content) return;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: `You are an expert at deepening stories with emotional context and detail.
                     Add depth to the selected content while maintaining the authentic voice.
                     Voice characteristics: ${JSON.stringify(styleProfile.voiceCharacteristics)}`
          },
          { 
            role: "user", 
            content: `Deepen this story with more emotional context and detail:
                     ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const deepenedContent = completion.choices[0].message.content;
      editor.setContent(deepenedContent);
    } catch (error) {
      console.error('Error deepening story:', error);
    }
  }
  
  async function inviteSharing() {
    if (!editor) return;
    
    const content = editor.getContent();
    if (!content) return;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: `You are an expert at creating invitations for audience participation.
                     Create a paragraph that invites readers to share their own experiences.
                     Voice characteristics: ${JSON.stringify(styleProfile.voiceCharacteristics)}`
          },
          { 
            role: "user", 
            content: `Based on this content, create an invitation for readers to share their experiences:
                     ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      });
      
      const invitationParagraph = completion.choices[0].message.content;
      editor.insertContent(invitationParagraph);
    } catch (error) {
      console.error('Error creating invitation:', error);
    }
  }
  
  return (
    <div className="resonance-tools">
      <button 
        className="tool-button connection-button"
        onClick={createConnection}
      >
        <span className="icon">🔗</span>
        Create Connection
      </button>
      
      <button 
        className="tool-button deepen-button"
        onClick={deepenStory}
      >
        <span className="icon">🔍</span>
        Deepen Story
      </button>
      
      <button 
        className="tool-button invite-button"
        onClick={inviteSharing}
      >
        <span className="icon">✋</span>
        Invite Sharing
      </button>
    </div>
  );
}
```

## 5. Implementation Plan

### 5.1 Phase 1: Core Integration (Months 1-2)

#### 5.1.1 Tasks

1. Set up project structure and dependencies
2. Implement Discovery Module integration with App 1
3. Implement Identity Module integration with App 2
4. Create basic data flow between modules
5. Set up Supabase integration for data storage

#### 5.1.2 Command Line Setup

```bash
# Create project directory
mkdir -p selfcast-resonance

# Initialize Next.js project
cd selfcast-resonance
npx create-next-app@latest . --typescript --tailwind --eslint

# Install dependencies
npm install @supabase/supabase-js novel openai natural jsdom

# Create module directories
mkdir -p src/modules/discovery
mkdir -p src/modules/identity
mkdir -p src/modules/foundation
mkdir -p src/modules/resonance

# Create component directories
mkdir -p src/components

# Create scripts directory
mkdir -p scripts

# Set up environment variables
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
EOF

# Create a basic test script
cat > scripts/test-integration.js << 'EOF'
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log('Testing SelfCast Resonance integration...');
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
}

main();
EOF

# Run the test script
node scripts/test-integration.js
```

### 5.2 Phase 2: Novel AI Integration (Months 3-4)

#### 5.2.1 Tasks

1. Implement Novel AI editor integration
2. Create Authentic Voice Preservation system
3. Develop Content Continuity system
4. Build Engagement Analysis system
5. Create basic UI components

#### 5.2.2 Testing

```bash
# Create a test page for the Novel editor
cat > src/app/test-editor/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { ResonanceEditor } from '../../modules/resonance/novel-integration';

export default function TestEditorPage() {
  const [editor, setEditor] = useState(null);
  
  useEffect(() => {
    async function initEditor() {
      // Mock client data for testing
      const clientData = {
        projectId: 'test-project',
        transcriptInsights: [],
        styleProfile: {
          voiceCharacteristics: {
            tone: 'conversational, warm',
            pace: 'moderate',
            vocabulary: 'accessible, occasional specialized terms'
          },
          coreValues: [
            { value: 'authenticity', description: 'Being true to oneself' },
            { value: 'growth', description: 'Continuous learning and development' }
          ]
        },
        enhancedContent: {}
      };
      
      const resonanceEditor = new ResonanceEditor(clientData);
      await resonanceEditor.initialize('novel-editor');
      setEditor(resonanceEditor);
    }
    
    initEditor();
    
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Novel AI Editor Test</h1>
      <div id="novel-editor" className="border p-4 min-h-[400px]"></div>
    </div>
  );
}
EOF

# Run the development server
npm run dev
```

### 5.3 Phase 3: Resonance Studio (Months 5-6)

#### 5.3.1 Tasks

1. Implement complete Resonance Studio interface
2. Create Authentic Moments panel
3. Build Engagement Preview panel
4. Develop Resonance Tools
5. Integrate all components into a cohesive workflow

#### 5.3.2 Final Integration

```bash
# Create the main Resonance Studio page
cat > src/app/studio/[projectId]/page.tsx << 'EOF'
'use client';

import { ResonanceStudio } from '../../../components/ResonanceStudio';

export default function StudioPage({ params }) {
  const { projectId } = params;
  
  return (
    <div className="p-4">
      <ResonanceStudio projectId={projectId} />
    </div>
  );
}
EOF

# Create a project selection page
cat > src/app/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProjects() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, created_at');
        
      if (!error) {
        setProjects(data || []);
      }
      
      setLoading(false);
    }
    
    fetchProjects();
  }, []);
  
  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">SelfCast Resonance</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <Link 
                key={project.id}
                href={`/studio/${project.id}`}
                className="block p-4 border rounded hover:bg-gray-50"
              >
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p>No projects found. Import a project from SelfCast to get started.</p>
        )}
      </div>
    </div>
  );
}
EOF

# Build the application
npm run build

# Start the production server
npm start
```

## 6. Conclusion

The SelfCast Resonance platform represents a significant evolution of the SelfCast ecosystem, transforming it from a website builder into a comprehensive platform for authentic human connection. By integrating Novel AI with the existing SelfCast applications, we create a powerful system that helps clients express their authentic voice and create content that resonates with readers in a "me too" way.

The implementation plan provides a clear roadmap for building this platform, with detailed code examples and command line instructions that any IDE AI could follow. The result will be a unique offering in the market that addresses the core human need for connection and authentic expression.
