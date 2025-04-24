# SelfCast Resonance PRD - Part 3: Resonance Module

## 3.4 Resonance Module (Novel AI Integration)

### 3.4.1 Requirements

- Integrate Novel AI editor for ongoing content creation
- Implement Authentic Voice Preservation system
- Create Content Continuity system for consistent messaging
- Develop Engagement Analysis for reader connection
- Build the Resonance Studio interface

### 3.4.2 Novel AI Integration

```javascript
// src/modules/resonance/novel-integration.js
import { Editor } from 'novel';
import { AuthenticVoicePreserver } from './authentic-voice';
import { ContentContinuitySystem } from './content-continuity';
import { EngagementAnalyzer } from './engagement-analyzer';

export class ResonanceEditor {
  constructor(clientData) {
    this.projectId = clientData.projectId;
    this.transcriptInsights = clientData.transcriptInsights;
    this.styleProfile = clientData.styleProfile;
    this.enhancedContent = clientData.enhancedContent;
    
    this.voicePreserver = new AuthenticVoicePreserver(this.styleProfile);
    this.continuitySystem = new ContentContinuitySystem(this.projectId);
    this.engagementAnalyzer = new EngagementAnalyzer();
    
    this.editor = null;
  }
  
  async initialize(elementId) {
    // Load historical content for context
    const historicalContent = await this.continuitySystem.loadHistoricalContent();
    const contentPatterns = this.continuitySystem.analyzeContentPatterns(historicalContent);
    
    // Initialize Novel editor with custom configurations
    this.editor = new Editor({
      // Element to mount the editor
      element: document.getElementById(elementId),
      
      // Configure with client's authentic voice
      defaultValue: '',
      
      // Add custom extensions
      extensions: [
        this.createResonanceToolbar(),
        this.createConnectionSuggestions(),
        this.createAuthenticVoiceChecker()
      ],
      
      // Configure AI to prioritize authentic connection
      aiOptions: {
        provider: 'openai',
        apiKey: process.env.OPENAI_API_KEY,
        customPrompt: this.createCustomPrompt(contentPatterns),
        temperature: 0.7,
        maxTokens: 1000,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0
      },
      
      // UI customization
      className: 'resonance-editor',
      
      // Event handlers
      onUpdate: ({ editor }) => {
        this.handleEditorUpdate(editor);
      },
      onBlur: ({ editor }) => {
        this.handleEditorBlur(editor);
      }
    });
    
    return this.editor;
  }
  
  createCustomPrompt(contentPatterns) {
    return `
    You are assisting a content creator in writing authentic content that creates "me too" moments with readers.
    
    VOICE CHARACTERISTICS:
    ${JSON.stringify(this.styleProfile.voiceCharacteristics)}
    
    CONTENT PATTERNS:
    ${JSON.stringify(contentPatterns)}
    
    GUIDELINES:
    1. Maintain the authentic voice and style of the writer
    2. Create content that invites readers to see themselves in the story
    3. Include "Resonance Points" - moments where readers can connect with the content
    4. Add "Invitation Moments" where readers are encouraged to reflect on their own experience
    5. Use the writer's terminology and phrasing patterns
    6. Maintain the emotional tone consistent with previous content
    
    Your suggestions should help the writer create content that feels authentic to them while creating meaningful connection with readers.
    `;
  }
  
  createResonanceToolbar() {
    // Custom toolbar with resonance-focused tools
    return {
      name: 'resonanceToolbar',
      // Implementation details for the toolbar extension
      // This would be a custom Novel extension
    };
  }
  
  createConnectionSuggestions() {
    // Suggestions for creating reader connection
    return {
      name: 'connectionSuggestions',
      // Implementation details for connection suggestions
      // This would be a custom Novel extension
    };
  }
  
  createAuthenticVoiceChecker() {
    // Checks if content matches the client's authentic voice
    return {
      name: 'authenticVoiceChecker',
      // Implementation details for voice checking
      // This would be a custom Novel extension
    };
  }
  
  handleEditorUpdate(editor) {
    // Process content as it's being written
    const content = editor.getHTML();
    
    // Check for voice authenticity
    const voiceCheck = this.voicePreserver.checkVoiceAlignment(content);
    
    // Analyze engagement potential
    const engagementAnalysis = this.engagementAnalyzer.analyzeContent(content);
    
    // Update UI with feedback
    this.updateFeedbackUI(voiceCheck, engagementAnalysis);
  }
  
  handleEditorBlur(editor) {
    // Process content when editor loses focus
    const content = editor.getHTML();
    
    // Save draft content
    this.saveContentDraft(content);
  }
  
  updateFeedbackUI(voiceCheck, engagementAnalysis) {
    // Update the UI with feedback on voice and engagement
    const feedbackElement = document.getElementById('resonance-feedback');
    if (!feedbackElement) return;
    
    // Voice authenticity feedback
    const voiceFeedback = document.createElement('div');
    voiceFeedback.className = `voice-feedback ${voiceCheck.isAuthentic ? 'authentic' : 'inauthentic'}`;
    voiceFeedback.textContent = voiceCheck.feedback;
    
    // Engagement potential feedback
    const engagementFeedback = document.createElement('div');
    engagementFeedback.className = 'engagement-feedback';
    engagementFeedback.innerHTML = `
      <h4>Connection Potential</h4>
      <div class="connection-score">${engagementAnalysis.connectionScore * 100}%</div>
      <ul>
        ${engagementAnalysis.connectionSuggestions.map(suggestion => 
          `<li>${suggestion}</li>`
        ).join('')}
      </ul>
    `;
    
    // Update the feedback element
    feedbackElement.innerHTML = '';
    feedbackElement.appendChild(voiceFeedback);
    feedbackElement.appendChild(engagementFeedback);
  }
  
  async saveContentDraft(content) {
    // Save draft content to Supabase
    try {
      const { data, error } = await this.supabase
        .from('content_drafts')
        .upsert({
          project_id: this.projectId,
          content_html: content,
          last_updated: new Date().toISOString()
        });
        
      if (error) {
        console.error('Failed to save draft:', error.message);
      }
    } catch (err) {
      console.error('Error saving draft:', err.message);
    }
  }
  
  getContent() {
    // Get the current content from the editor
    return this.editor ? this.editor.getHTML() : '';
  }
  
  setContent(content) {
    // Set content in the editor
    if (this.editor) {
      this.editor.commands.setContent(content);
    }
  }
  
  destroy() {
    // Clean up the editor
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  }
}
```

### 3.4.3 Authentic Voice Preservation

```javascript
// src/modules/resonance/authentic-voice.js
export class AuthenticVoicePreserver {
  constructor(styleProfile) {
    this.voiceCharacteristics = styleProfile.voiceCharacteristics;
    this.valueSystem = styleProfile.coreValues;
    this.narrativePatterns = styleProfile.narrativePatterns;
    this.keyPhrases = this.extractKeyPhrases(styleProfile);
  }
  
  extractKeyPhrases(styleProfile) {
    // Extract key phrases and terminology from the style profile
    const phrases = [];
    
    // Extract from voice characteristics
    if (this.voiceCharacteristics.vocabulary) {
      const vocabWords = this.voiceCharacteristics.vocabulary
        .split(/[,.]/)
        .map(word => word.trim())
        .filter(word => word.length > 0);
      phrases.push(...vocabWords);
    }
    
    // Extract from core values
    if (styleProfile.coreValues) {
      styleProfile.coreValues.forEach(value => {
        phrases.push(value.value);
        
        // Extract key terms from value descriptions
        const descTerms = value.description
          .split(/\s+/)
          .filter(word => word.length > 5 && /^[A-Z]/.test(word));
        phrases.push(...descTerms);
      });
    }
    
    return [...new Set(phrases)]; // Remove duplicates
  }
  
  checkVoiceAlignment(content) {
    // Check if content matches the client's authentic voice
    const result = {
      isAuthentic: true,
      score: 0,
      feedback: '',
      issues: []
    };
    
    // Check tone alignment
    const toneAlignment = this.checkToneAlignment(content);
    result.score += toneAlignment.score;
    if (!toneAlignment.isAligned) {
      result.isAuthentic = false;
      result.issues.push(toneAlignment);
    }
    
    // Check key phrase usage
    const phraseAlignment = this.checkPhraseAlignment(content);
    result.score += phraseAlignment.score;
    if (!phraseAlignment.isAligned) {
      result.isAuthentic = false;
      result.issues.push(phraseAlignment);
    }
    
    // Check value alignment
    const valueAlignment = this.checkValueAlignment(content);
    result.score += valueAlignment.score;
    if (!valueAlignment.isAligned) {
      result.isAuthentic = false;
      result.issues.push(valueAlignment);
    }
    
    // Generate feedback
    result.feedback = this.generateFeedback(result);
    
    return result;
  }
  
  checkToneAlignment(content) {
    // Check if the tone matches the client's voice
    const result = {
      type: 'tone',
      isAligned: true,
      score: 0,
      details: ''
    };
    
    // Simple tone checking based on characteristics
    if (this.voiceCharacteristics.tone) {
      const tone = this.voiceCharacteristics.tone.toLowerCase();
      
      // Check for formal tone
      if (tone.includes('formal')) {
        const informalMarkers = content.match(/\b(gonna|wanna|yeah|cool|awesome|totally)\b/gi);
        if (informalMarkers && informalMarkers.length > 2) {
          result.isAligned = false;
          result.details = 'The tone is too informal for this voice.';
        }
      }
      
      // Check for conversational tone
      if (tone.includes('conversational')) {
        const formalMarkers = content.match(/\b(furthermore|subsequently|nevertheless|thus|hence)\b/gi);
        if (formalMarkers && formalMarkers.length > 2) {
          result.isAligned = false;
          result.details = 'The tone is too formal for this voice.';
        }
      }
      
      // Check for technical tone
      if (tone.includes('technical')) {
        const simplifiedMarkers = content.match(/\b(simple|easy|just|basically|sort of)\b/gi);
        if (simplifiedMarkers && simplifiedMarkers.length > 3) {
          result.isAligned = false;
          result.details = 'The tone is too simplified for this technical voice.';
        }
      }
    }
    
    // Score based on alignment
    result.score = result.isAligned ? 0.33 : 0;
    
    return result;
  }
  
  checkPhraseAlignment(content) {
    // Check if key phrases and terminology are used
    const result = {
      type: 'phrases',
      isAligned: true,
      score: 0,
      details: ''
    };
    
    if (this.keyPhrases.length > 0) {
      // Count how many key phrases are used
      let matchCount = 0;
      this.keyPhrases.forEach(phrase => {
        const regex = new RegExp(`\\b${phrase}\\b`, 'i');
        if (regex.test(content)) {
          matchCount++;
        }
      });
      
      // Calculate percentage of key phrases used
      const percentage = matchCount / this.keyPhrases.length;
      
      if (percentage < 0.2 && this.keyPhrases.length >= 5) {
        result.isAligned = false;
        result.details = 'The content is missing key terminology and phrases typical of this voice.';
      }
      
      // Score based on percentage of phrases used
      result.score = Math.min(percentage * 0.33, 0.33);
    } else {
      // No key phrases to check
      result.score = 0.33;
    }
    
    return result;
  }
  
  checkValueAlignment(content) {
    // Check if content aligns with client's values
    const result = {
      type: 'values',
      isAligned: true,
      score: 0,
      details: ''
    };
    
    if (this.valueSystem && this.valueSystem.length > 0) {
      // Check for value alignment
      let alignedValues = 0;
      
      this.valueSystem.forEach(value => {
        // Check if the value or its description appears in the content
        const valueRegex = new RegExp(`\\b${value.value}\\b`, 'i');
        const descriptionTerms = value.description
          .split(/\s+/)
          .filter(word => word.length > 5)
          .map(word => `\\b${word}\\b`);
        
        if (valueRegex.test(content)) {
          alignedValues++;
        } else if (descriptionTerms.some(term => new RegExp(term, 'i').test(content))) {
          alignedValues++;
        }
      });
      
      // Calculate percentage of values represented
      const percentage = alignedValues / this.valueSystem.length;
      
      if (percentage < 0.25 && this.valueSystem.length >= 3) {
        result.isAligned = false;
        result.details = 'The content does not reflect the core values of this voice.';
      }
      
      // Score based on percentage of values represented
      result.score = Math.min(percentage * 0.34, 0.34);
    } else {
      // No values to check
      result.score = 0.34;
    }
    
    return result;
  }
  
  generateFeedback(result) {
    // Generate feedback based on voice alignment check
    if (result.isAuthentic) {
      return 'The content authentically reflects your voice and values.';
    }
    
    // Generate feedback for issues
    const feedbackParts = result.issues.map(issue => issue.details);
    return feedbackParts.join(' ');
  }
  
  suggestCorrections(content, alignmentResult) {
    // Suggest corrections to improve voice alignment
    if (alignmentResult.isAuthentic) {
      return content; // No corrections needed
    }
    
    let suggestions = [];
    
    // Generate suggestions based on issues
    alignmentResult.issues.forEach(issue => {
      switch (issue.type) {
        case 'tone':
          suggestions.push(this.generateToneSuggestion(issue));
          break;
        case 'phrases':
          suggestions.push(this.generatePhraseSuggestion(issue));
          break;
        case 'values':
          suggestions.push(this.generateValueSuggestion(issue));
          break;
      }
    });
    
    return suggestions;
  }
  
  generateToneSuggestion(issue) {
    // Generate suggestion for tone alignment
    if (this.voiceCharacteristics.tone) {
      const tone = this.voiceCharacteristics.tone.toLowerCase();
      
      if (tone.includes('formal')) {
        return 'Consider using more formal language, avoiding contractions and colloquialisms.';
      }
      
      if (tone.includes('conversational')) {
        return 'Try using more conversational language, as if speaking directly to the reader.';
      }
      
      if (tone.includes('technical')) {
        return 'Include more precise technical terminology and avoid oversimplification.';
      }
    }
    
    return 'Adjust the tone to better match your authentic voice.';
  }
  
  generatePhraseSuggestion(issue) {
    // Suggest key phrases to include
    if (this.keyPhrases.length > 0) {
      const suggestedPhrases = this.keyPhrases
        .slice(0, Math.min(3, this.keyPhrases.length))
        .join('", "');
      
      return `Consider incorporating key phrases like "${suggestedPhrases}" that are typical of your voice.`;
    }
    
    return 'Include more of your characteristic terminology and phrases.';
  }
  
  generateValueSuggestion(issue) {
    // Suggest values to incorporate
    if (this.valueSystem && this.valueSystem.length > 0) {
      const suggestedValues = this.valueSystem
        .slice(0, Math.min(2, this.valueSystem.length))
        .map(v => v.value)
        .join('" and "');
      
      return `Reflect your core values of "${suggestedValues}" in your content.`;
    }
    
    return 'Ensure your content reflects your core values and beliefs.';
  }
}
```

### 3.4.4 Engagement Analysis

```javascript
// src/modules/resonance/engagement-analyzer.js
export class EngagementAnalyzer {
  constructor() {
    this.connectionPhrases = [
      'have you ever',
      'you might recognize',
      'many of us',
      'we all',
      'like you',
      'you\'re not alone',
      'shared experience',
      'together we',
      'your journey',
      'your story'
    ];
    
    this.invitationPhrases = [
      'what\'s your experience',
      'share your',
      'tell me about',
      'i\'d love to hear',
      'let me know',
      'comment below',
      'reach out',
      'join the conversation'
    ];
    
    this.emotionalWords = {
      joy: ['happy', 'excited', 'thrilled', 'delighted', 'joyful', 'pleased'],
      sadness: ['sad', 'disappointed', 'heartbroken', 'down', 'blue', 'unhappy'],
      fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous'],
      anger: ['angry', 'frustrated', 'annoyed', 'irritated', 'furious', 'mad'],
      surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned'],
      trust: ['trust', 'believe', 'faith', 'confident', 'assured', 'certain']
    };
  }
  
  analyzeContent(content) {
    return {
      // Identify moments likely to create "me too" responses
      connectionMoments: this.findConnectionMoments(content),
      
      // Calculate overall connection score
      connectionScore: this.calculateConnectionScore(content),
      
      // Identify opportunities for reader participation
      participationOpportunities: this.findParticipationOpportunities(content),
      
      // Analyze emotional resonance
      emotionalResonance: this.analyzeEmotionalResonance(content),
      
      // Suggest improvements for deeper connection
      connectionSuggestions: this.generateConnectionSuggestions(content)
    };
  }
  
  findConnectionMoments(content) {
    // Find moments in the content likely to create connection
    const moments = [];
    
    // Look for explicit connection phrases
    this.connectionPhrases.forEach(phrase => {
      const regex = new RegExp(`(.*${phrase}.*?)[\\.\\?\\!]`, 'gi');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        moments.push({
          type: 'explicit',
          text: match[0],
          phrase: phrase
        });
      }
    });
    
    // Look for personal stories (first-person narratives)
    const personalStoryRegex = /\b(I|me|my|mine|myself)\b.*?\b(felt|experienced|learned|realized|discovered)\b.*?[\.\?\!]/gi;
    let match;
    
    while ((match = personalStoryRegex.exec(content)) !== null) {
      moments.push({
        type: 'personal_story',
        text: match[0]
      });
    }
    
    return moments;
  }
  
  calculateConnectionScore(content) {
    // Calculate a score representing connection potential (0-1)
    let score = 0;
    
    // Score based on connection phrases
    const connectionCount = this.connectionPhrases.reduce((count, phrase) => {
      const regex = new RegExp(phrase, 'gi');
      const matches = content.match(regex) || [];
      return count + matches.length;
    }, 0);
    
    // Score based on invitation phrases
    const invitationCount = this.invitationPhrases.reduce((count, phrase) => {
      const regex = new RegExp(phrase, 'gi');
      const matches = content.match(regex) || [];
      return count + matches.length;
    }, 0);
    
    // Score based on personal pronouns balance
    const firstPersonCount = (content.match(/\b(I|me|my|mine|myself)\b/gi) || []).length;
    const secondPersonCount = (content.match(/\b(you|your|yours|yourself)\b/gi) || []).length;
    const pronounBalance = Math.min(firstPersonCount, secondPersonCount) / 
                          Math.max(firstPersonCount, secondPersonCount, 1);
    
    // Score based on questions
    const questionCount = (content.match(/\?/g) || []).length;
    
    // Calculate final score
    const contentLength = content.length;
    const normalizedLength = Math.min(contentLength / 1000, 1); // Normalize to 1000 chars
    
    score += connectionCount * 0.1;
    score += invitationCount * 0.15;
    score += pronounBalance * 0.3;
    score += questionCount * 0.05;
    
    // Normalize score to 0-1 range
    return Math.min(score / (normalizedLength * 2), 1);
  }
  
  findParticipationOpportunities(content) {
    // Find opportunities for reader participation
    const opportunities = [];
    
    // Look for questions
    const questionRegex = /[^\.!\?]\s*([^\.\!\?]+\?)/g;
    let match;
    
    while ((match = questionRegex.exec(content)) !== null) {
      opportunities.push({
        type: 'question',
        text: match[1].trim()
      });
    }
    
    // Look for explicit invitations
    this.invitationPhrases.forEach(phrase => {
      const regex = new RegExp(`(.*${phrase}.*?)[\\.\\?\\!]`, 'gi');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        opportunities.push({
          type: 'invitation',
          text: match[0],
          phrase: phrase
        });
      }
    });
    
    return opportunities;
  }
  
  analyzeEmotionalResonance(content) {
    // Analyze emotional resonance of the content
    const emotionalProfile = {};
    
    // Count emotional words by category
    Object.entries(this.emotionalWords).forEach(([emotion, words]) => {
      const count = words.reduce((total, word) => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = content.match(regex) || [];
        return total + matches.length;
      }, 0);
      
      emotionalProfile[emotion] = count;
    });
    
    // Calculate total emotional words
    const totalEmotionalWords = Object.values(emotionalProfile).reduce((sum, count) => sum + count, 0);
    
    // Calculate emotional diversity (0-1)
    const emotionsPresent = Object.values(emotionalProfile).filter(count => count > 0).length;
    const emotionalDiversity = emotionsPresent / Object.keys(this.emotionalWords).length;
    
    // Calculate emotional intensity (0-1)
    const contentWords = content.split(/\s+/).length;
    const emotionalIntensity = Math.min(totalEmotionalWords / (contentWords * 0.05), 1);
    
    return {
      profile: emotionalProfile,
      diversity: emotionalDiversity,
      intensity: emotionalIntensity,
      primaryEmotion: this.getPrimaryEmotion(emotionalProfile)
    };
  }
  
  getPrimaryEmotion(emotionalProfile) {
    // Get the primary emotion in the content
    let maxEmotion = null;
    let maxCount = 0;
    
    Object.entries(emotionalProfile).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxEmotion = emotion;
        maxCount = count;
      }
    });
    
    return maxEmotion;
  }
  
  generateConnectionSuggestions(content) {
    // Generate suggestions to improve connection
    const suggestions = [];
    const analysis = {
      connectionMoments: this.findConnectionMoments(content),
      participationOpportunities: this.findParticipationOpportunities(content),
      emotionalResonance: this.analyzeEmotionalResonance(content)
    };
    
    // Suggest adding connection phrases if few exist
    if (analysis.connectionMoments.length < 2) {
      suggestions.push('Add phrases like "Many of us have experienced..." or "You might recognize this feeling..." to create more "me too" moments.');
    }
    
    // Suggest adding questions if few exist
    if (analysis.participationOpportunities.filter(o => o.type === 'question').length < 1) {
      suggestions.push('Include questions that invite readers to reflect on their own experience.');
    }
    
    // Suggest adding explicit invitations if none exist
    if (analysis.participationOpportunities.filter(o => o.type === 'invitation').length < 1) {
      suggestions.push('Add an explicit invitation like "I\'d love to hear your story" or "Share your experience in the comments."');
    }
    
    // Suggest emotional balance if needed
    if (analysis.emotionalResonance.diversity < 0.3) {
      suggestions.push('Include a wider range of emotions to help different readers connect with your content.');
    }
    
    // Suggest personal story if none found
    if (!analysis.connectionMoments.some(m => m.type === 'personal_story')) {
      suggestions.push('Share a brief personal story or experience to create authenticity and connection.');
    }
    
    return suggestions;
  }
}
```

### 3.4.5 Command Line Setup

```bash
# Create the resonance module directory
mkdir -p src/modules/resonance

# Create the necessary files
touch src/modules/resonance/novel-integration.js
touch src/modules/resonance/authentic-voice.js
touch src/modules/resonance/engagement-analyzer.js
touch src/modules/resonance/content-continuity.js

# Install dependencies
npm install novel react react-dom

# Create a test script
cat > scripts/test-resonance-editor.js << 'EOF'
require('dotenv').config();
const { JSDOM } = require('jsdom');
const { ResonanceEditor } = require('../src/modules/resonance/novel-integration');

// Mock browser environment for testing
const dom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
global.window = dom.window;
global.document = dom.window.document;

async function main() {
  const projectId = process.argv[2];
  
  if (!projectId) {
    console.error('Please provide a project ID');
    process.exit(1);
  }
  
  try {
    console.log('Loading client data...');
    
    // Mock client data for testing
    const clientData = {
      projectId,
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
    
    console.log('Initializing Resonance Editor...');
    const editor = new ResonanceEditor(clientData);
    await editor.initialize('editor');
    
    console.log('Resonance Editor initialized successfully!');
    console.log('Editor instance created with the following components:');
    console.log('- Authentic Voice Preserver');
    console.log('- Content Continuity System');
    console.log('- Engagement Analyzer');
    
    // Cleanup
    editor.destroy();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
EOF

# Run the test script
node scripts/test-resonance-editor.js YOUR_PROJECT_ID
```
