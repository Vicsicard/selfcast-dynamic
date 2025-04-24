# SelfCast Resonance: Product Requirements Document

## 1. Executive Summary

SelfCast Resonance is an AI-powered content creation platform that helps clients express their authentic voice and create content that resonates with readers in a "me too" way. The platform builds upon the existing SelfCast ecosystem (Self-Cast Studio, Style Profiler, and Content Generator) and integrates Novel AI's capabilities to create a comprehensive solution for authentic content creation and audience engagement.

### 1.1 Vision Statement

To transform SelfCast from a website builder into a platform for authentic human connection, leveraging AI to help clients share their true selves in ways that create meaningful resonance with their audience.

### 1.2 Key Objectives

1. Capture and preserve clients' authentic voice from interview content
2. Enable ongoing content creation that maintains consistency with the client's identity
3. Structure content to create "me too" moments that foster audience connection
4. Reduce the burden of content creation while enhancing quality and authenticity

## 2. System Architecture

### 2.1 High-Level Architecture

```
SelfCast Resonance
├── Discovery Module (App 1 Integration)
│   └── Interview Processing & Truth Extraction
│
├── Identity Module (App 2 Integration)
│   └── Voice & Values Analysis
│
├── Foundation Module (App 3 Integration)
│   └── Initial Content Creation
│
└── Resonance Module (Novel AI Integration)
    ├── Authentic Voice Preservation
    ├── Content Continuity System
    ├── Engagement Analysis
    └── Resonance Studio Interface
```

### 2.2 Technology Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage
- **AI**: Novel AI, OpenAI API
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## 3. Detailed Requirements

### 3.1 Discovery Module Integration

#### 3.1.1 Requirements

- Integrate with Self-Cast Studio (App 1) to access interview transcripts and video chunks
- Extract key moments, stories, and insights from interview content
- Identify potential "connection points" in the client's narrative
- Create a structured "Resonance Map" of the client's most authentic and relatable moments

#### 3.1.2 API Integration Example

```javascript
// src/modules/discovery/transcript-analyzer.js
import { createClient } from '@supabase/supabase-js';

export class TranscriptAnalyzer {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  async fetchTranscript(projectId) {
    const { data, error } = await this.supabase
      .storage
      .from('documents')
      .download(`${projectId}/transcript_chunks.md`);
      
    if (error) {
      throw new Error(`Failed to fetch transcript: ${error.message}`);
    }
    
    const text = await data.text();
    return this.parseTranscript(text);
  }
  
  parseTranscript(text) {
    // Parse the markdown transcript into structured chunks
    const chunks = [];
    const chunkRegex = /## Chunk (\d+) \[([^\]]+)\]\s+(?:\*\*Q:\*\* ([^\n]+)\s+)?([\s\S]+?)(?=\n## Chunk|\n*$)/g;
    
    let match;
    while ((match = chunkRegex.exec(text)) !== null) {
      chunks.push({
        chunkId: parseInt(match[1]),
        timeRange: match[2],
        question: match[3] || null,
        content: match[4].trim()
      });
    }
    
    return chunks;
  }
  
  identifyConnectionPoints(chunks) {
    // Analyze chunks to find potential connection points
    return chunks.map(chunk => {
      // Use NLP techniques to identify relatable moments
      const connectionScore = this.calculateConnectionPotential(chunk.content);
      const universalThemes = this.extractUniversalThemes(chunk.content);
      
      return {
        ...chunk,
        connectionScore,
        universalThemes,
        isPotentialConnectionPoint: connectionScore > 0.7
      };
    });
  }
  
  calculateConnectionPotential(text) {
    // Calculate how likely this content will create "me too" moments
    // This is a simplified example - would use more sophisticated NLP in production
    const personalPronounCount = (text.match(/\b(I|me|my|mine|myself)\b/gi) || []).length;
    const universalWordCount = (text.match(/\b(everyone|all|people|we|us|our)\b/gi) || []).length;
    const emotionWordCount = (text.match(/\b(feel|felt|emotion|experience|struggle|joy|fear)\b/gi) || []).length;
    
    // Simple scoring algorithm
    const wordCount = text.split(/\s+/).length;
    const score = (personalPronounCount + universalWordCount * 2 + emotionWordCount * 3) / wordCount;
    
    return Math.min(Math.max(score * 5, 0), 1); // Normalize to 0-1
  }
  
  extractUniversalThemes(text) {
    // Extract universal themes that might resonate with readers
    // Simplified example - would use topic modeling in production
    const themes = [];
    
    if (text.match(/\b(challenge|difficult|overcome|obstacle)\b/gi)) themes.push('overcoming-challenges');
    if (text.match(/\b(learn|growth|develop|improve)\b/gi)) themes.push('personal-growth');
    if (text.match(/\b(family|relationship|connect|together)\b/gi)) themes.push('relationships');
    if (text.match(/\b(work|career|job|professional)\b/gi)) themes.push('career');
    if (text.match(/\b(believe|faith|spirit|meaning)\b/gi)) themes.push('purpose');
    
    return themes;
  }
  
  async createResonanceMap(projectId) {
    const chunks = await this.fetchTranscript(projectId);
    const analyzedChunks = this.identifyConnectionPoints(chunks);
    
    // Group by themes and sort by connection potential
    const themeMap = {};
    analyzedChunks.forEach(chunk => {
      chunk.universalThemes.forEach(theme => {
        if (!themeMap[theme]) themeMap[theme] = [];
        themeMap[theme].push(chunk);
      });
    });
    
    // Sort each theme's chunks by connection score
    Object.keys(themeMap).forEach(theme => {
      themeMap[theme].sort((a, b) => b.connectionScore - a.connectionScore);
    });
    
    // Create the resonance map
    const resonanceMap = {
      projectId,
      topConnectionPoints: analyzedChunks
        .filter(chunk => chunk.isPotentialConnectionPoint)
        .sort((a, b) => b.connectionScore - a.connectionScore)
        .slice(0, 10),
      themeMap
    };
    
    // Store the resonance map
    await this.storeResonanceMap(projectId, resonanceMap);
    
    return resonanceMap;
  }
  
  async storeResonanceMap(projectId, resonanceMap) {
    const { error } = await this.supabase
      .storage
      .from('documents')
      .upload(
        `${projectId}/resonance_map.json`,
        JSON.stringify(resonanceMap, null, 2),
        { contentType: 'application/json', upsert: true }
      );
      
    if (error) {
      throw new Error(`Failed to store resonance map: ${error.message}`);
    }
  }
}
```

#### 3.1.3 Command Line Setup

```bash
# Create the discovery module directory
mkdir -p src/modules/discovery

# Install dependencies
npm install @supabase/supabase-js natural

# Create the transcript analyzer
touch src/modules/discovery/transcript-analyzer.js

# Create a test script
cat > scripts/test-transcript-analyzer.js << 'EOF'
require('dotenv').config();
const { TranscriptAnalyzer } = require('../src/modules/discovery/transcript-analyzer');

async function main() {
  const analyzer = new TranscriptAnalyzer();
  const projectId = process.argv[2];
  
  if (!projectId) {
    console.error('Please provide a project ID');
    process.exit(1);
  }
  
  try {
    console.log('Creating resonance map...');
    const resonanceMap = await analyzer.createResonanceMap(projectId);
    console.log('Resonance map created successfully!');
    console.log('Top connection points:', resonanceMap.topConnectionPoints.length);
    console.log('Themes identified:', Object.keys(resonanceMap.themeMap).join(', '));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
EOF

# Run the test script
node scripts/test-transcript-analyzer.js YOUR_PROJECT_ID
```

### 3.2 Identity Module Integration

#### 3.2.1 Requirements

- Integrate with Style Profiler (App 2) to access style profiles and voice characteristics
- Create enhanced profiles that identify relatability factors and vulnerability framework
- Develop "Bridge Narratives" that connect client experiences to universal human experiences
- Ensure all content maintains the client's authentic voice and values

#### 3.2.2 API Integration Example

```javascript
// src/modules/identity/style-profile-enhancer.js
import { createClient } from '@supabase/supabase-js';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

export class StyleProfileEnhancer {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
  
  async fetchStyleProfile(projectId) {
    const { data, error } = await this.supabase
      .storage
      .from('documents')
      .download(`${projectId}/style-profile.md`);
      
    if (error) {
      throw new Error(`Failed to fetch style profile: ${error.message}`);
    }
    
    const text = await data.text();
    return this.parseStyleProfile(text);
  }
  
  parseStyleProfile(text) {
    // Parse the markdown style profile into structured data
    const profile = {
      voiceCharacteristics: {},
      keyThemes: [],
      coreValues: [],
      emotionalTone: {},
      relatabilityFactors: {}
    };
    
    // Extract voice characteristics
    const voiceMatch = text.match(/## Voice Characteristics\s+([\s\S]+?)(?=\n##|$)/);
    if (voiceMatch) {
      const voiceText = voiceMatch[1].trim();
      
      // Extract tone
      const toneMatch = voiceText.match(/Tone: ([^\n]+)/);
      if (toneMatch) profile.voiceCharacteristics.tone = toneMatch[1].trim();
      
      // Extract pace
      const paceMatch = voiceText.match(/Pace: ([^\n]+)/);
      if (paceMatch) profile.voiceCharacteristics.pace = paceMatch[1].trim();
      
      // Extract vocabulary
      const vocabMatch = voiceText.match(/Vocabulary: ([^\n]+)/);
      if (vocabMatch) profile.voiceCharacteristics.vocabulary = vocabMatch[1].trim();
    }
    
    // Extract key themes
    const themesMatch = text.match(/## Key Themes\s+([\s\S]+?)(?=\n##|$)/);
    if (themesMatch) {
      const themesText = themesMatch[1].trim();
      const themeLines = themesText.split('\n');
      
      themeLines.forEach(line => {
        const themeMatch = line.match(/- ([^:]+): ([^\n]+)/);
        if (themeMatch) {
          profile.keyThemes.push({
            name: themeMatch[1].trim(),
            description: themeMatch[2].trim()
          });
        }
      });
    }
    
    // Extract core values
    const valuesMatch = text.match(/## Core Values\s+([\s\S]+?)(?=\n##|$)/);
    if (valuesMatch) {
      const valuesText = valuesMatch[1].trim();
      const valueLines = valuesText.split('\n');
      
      valueLines.forEach(line => {
        const valueMatch = line.match(/- ([^:]+): ([^\n]+)/);
        if (valueMatch) {
          profile.coreValues.push({
            value: valueMatch[1].trim(),
            description: valueMatch[2].trim()
          });
        }
      });
    }
    
    return profile;
  }
  
  createRelatabilityProfile(styleProfile) {
    // Enhance the style profile with relatability factors
    const relatabilityProfile = {
      ...styleProfile,
      relatabilityFactors: this.identifyRelatabilityFactors(styleProfile),
      vulnerabilityFramework: this.createVulnerabilityFramework(styleProfile),
      bridgeNarratives: this.createBridgeNarratives(styleProfile)
    };
    
    return relatabilityProfile;
  }
  
  identifyRelatabilityFactors(styleProfile) {
    // Identify factors that make the client relatable to their audience
    const relatabilityFactors = {
      universalExperiences: [],
      emotionalHonesty: 0,
      authenticityMarkers: [],
      vulnerabilityLevel: 0
    };
    
    // Extract universal experiences from themes and values
    styleProfile.keyThemes.forEach(theme => {
      if (this.isUniversalExperience(theme.name, theme.description)) {
        relatabilityFactors.universalExperiences.push({
          experience: theme.name,
          universalityScore: this.calculateUniversalityScore(theme.description)
        });
      }
    });
    
    // Calculate emotional honesty score
    if (styleProfile.voiceCharacteristics.tone) {
      const emotionalWords = (styleProfile.voiceCharacteristics.tone.match(/\b(authentic|honest|genuine|real|transparent)\b/gi) || []);
      relatabilityFactors.emotionalHonesty = Math.min(emotionalWords.length / 2, 1);
    }
    
    // Identify authenticity markers
    const authenticityMarkers = [];
    if (styleProfile.voiceCharacteristics.tone && styleProfile.voiceCharacteristics.tone.includes('conversational')) {
      authenticityMarkers.push('conversational-tone');
    }
    if (styleProfile.voiceCharacteristics.vocabulary && styleProfile.voiceCharacteristics.vocabulary.includes('specialized')) {
      authenticityMarkers.push('domain-expertise');
    }
    relatabilityFactors.authenticityMarkers = authenticityMarkers;
    
    // Calculate vulnerability level
    let vulnerabilityScore = 0;
    vulnerabilityScore += relatabilityFactors.emotionalHonesty * 0.5;
    vulnerabilityScore += relatabilityFactors.universalExperiences.length * 0.2;
    vulnerabilityScore += authenticityMarkers.length * 0.15;
    relatabilityFactors.vulnerabilityLevel = Math.min(vulnerabilityScore, 1);
    
    return relatabilityFactors;
  }
  
  isUniversalExperience(theme, description) {
    // Determine if a theme represents a universal human experience
    const universalThemes = [
      'challenge', 'growth', 'relationship', 'family', 'work',
      'purpose', 'struggle', 'achievement', 'loss', 'love'
    ];
    
    return universalThemes.some(ut => 
      theme.toLowerCase().includes(ut) || 
      description.toLowerCase().includes(ut)
    );
  }
  
  calculateUniversalityScore(description) {
    // Calculate how universal an experience is (0-1)
    const universalWords = [
      'everyone', 'all', 'people', 'we', 'us', 'our', 'human',
      'universal', 'common', 'shared', 'experience'
    ];
    
    const tokens = tokenizer.tokenize(description.toLowerCase());
    const universalCount = tokens.filter(token => 
      universalWords.includes(token)
    ).length;
    
    return Math.min(universalCount / 3, 1);
  }
  
  createVulnerabilityFramework(styleProfile) {
    // Create a framework for appropriate vulnerability
    const framework = {
      appropriateTopics: [],
      boundaryTopics: [],
      recommendedVulnerabilityLevel: 'moderate'
    };
    
    // Identify appropriate topics for vulnerability
    styleProfile.keyThemes.forEach(theme => {
      const isPersonal = theme.description.match(/\b(I|me|my|mine|myself)\b/gi);
      const isEmotional = theme.description.match(/\b(feel|felt|emotion|experience)\b/gi);
      
      if (isPersonal && isEmotional) {
        framework.appropriateTopics.push(theme.name);
      } else {
        framework.boundaryTopics.push(theme.name);
      }
    });
    
    // Determine recommended vulnerability level
    const personalThemeRatio = framework.appropriateTopics.length / 
      (framework.appropriateTopics.length + framework.boundaryTopics.length);
    
    if (personalThemeRatio > 0.7) {
      framework.recommendedVulnerabilityLevel = 'high';
    } else if (personalThemeRatio < 0.3) {
      framework.recommendedVulnerabilityLevel = 'low';
    }
    
    return framework;
  }
  
  createBridgeNarratives(styleProfile) {
    // Create narrative bridges between client experiences and universal experiences
    const bridges = [];
    
    styleProfile.keyThemes.forEach(theme => {
      const universalConnection = this.findUniversalConnection(theme);
      if (universalConnection) {
        bridges.push({
          clientTheme: theme.name,
          universalTheme: universalConnection.theme,
          bridgeNarrative: this.generateBridgeNarrative(theme, universalConnection)
        });
      }
    });
    
    return bridges;
  }
  
  findUniversalConnection(theme) {
    // Map client themes to universal human experiences
    const universalConnections = [
      { keywords: ['challenge', 'difficult', 'obstacle'], theme: 'overcoming-challenges' },
      { keywords: ['learn', 'growth', 'develop'], theme: 'personal-growth' },
      { keywords: ['family', 'relationship', 'connect'], theme: 'relationships' },
      { keywords: ['work', 'career', 'job'], theme: 'professional-journey' },
      { keywords: ['believe', 'faith', 'meaning'], theme: 'finding-purpose' }
    ];
    
    for (const connection of universalConnections) {
      if (connection.keywords.some(keyword => 
        theme.name.toLowerCase().includes(keyword) || 
        theme.description.toLowerCase().includes(keyword)
      )) {
        return connection;
      }
    }
    
    return null;
  }
  
  generateBridgeNarrative(clientTheme, universalConnection) {
    // Generate a narrative that bridges client experience to universal experience
    const templates = {
      'overcoming-challenges': `Like many of us, the journey through ${clientTheme.name} reveals how we all face obstacles that test our resolve.`,
      'personal-growth': `The path of ${clientTheme.name} reflects the universal human desire to grow and evolve through our experiences.`,
      'relationships': `Through ${clientTheme.name}, we see how connections with others shape our lives and create shared meaning.`,
      'professional-journey': `The professional experiences in ${clientTheme.name} mirror the common quest to find purpose and contribution through our work.`,
      'finding-purpose': `The exploration of ${clientTheme.name} touches on humanity's collective search for meaning and purpose.`
    };
    
    return templates[universalConnection.theme] || 
      `The experience of ${clientTheme.name} connects to the shared human experience of ${universalConnection.theme}.`;
  }
  
  async enhanceAndStoreProfile(projectId) {
    const styleProfile = await this.fetchStyleProfile(projectId);
    const enhancedProfile = this.createRelatabilityProfile(styleProfile);
    
    // Store the enhanced profile
    await this.storeEnhancedProfile(projectId, enhancedProfile);
    
    return enhancedProfile;
  }
  
  async storeEnhancedProfile(projectId, enhancedProfile) {
    const { error } = await this.supabase
      .storage
      .from('documents')
      .upload(
        `${projectId}/enhanced-style-profile.json`,
        JSON.stringify(enhancedProfile, null, 2),
        { contentType: 'application/json', upsert: true }
      );
      
    if (error) {
      throw new Error(`Failed to store enhanced profile: ${error.message}`);
    }
  }
}
```

#### 3.2.3 Command Line Setup

```bash
# Create the identity module directory
mkdir -p src/modules/identity

# Install dependencies
npm install natural

# Create the style profile enhancer
touch src/modules/identity/style-profile-enhancer.js

# Create a test script
cat > scripts/test-style-enhancer.js << 'EOF'
require('dotenv').config();
const { StyleProfileEnhancer } = require('../src/modules/identity/style-profile-enhancer');

async function main() {
  const enhancer = new StyleProfileEnhancer();
  const projectId = process.argv[2];
  
  if (!projectId) {
    console.error('Please provide a project ID');
    process.exit(1);
  }
  
  try {
    console.log('Enhancing style profile...');
    const enhancedProfile = await enhancer.enhanceAndStoreProfile(projectId);
    console.log('Profile enhanced successfully!');
    console.log('Relatability factors:', Object.keys(enhancedProfile.relatabilityFactors).join(', '));
    console.log('Bridge narratives created:', enhancedProfile.bridgeNarratives.length);
    console.log('Vulnerability framework:', enhancedProfile.vulnerabilityFramework.recommendedVulnerabilityLevel);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
EOF

# Run the test script
node scripts/test-style-enhancer.js YOUR_PROJECT_ID
```
