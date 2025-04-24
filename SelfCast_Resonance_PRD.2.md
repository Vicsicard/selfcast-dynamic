# SelfCast Resonance PRD - Part 2: Foundation Module

## 3.3 Foundation Module Integration

### 3.3.1 Requirements

- Integrate with Content Generator Suite (App 3) to access initial content
- Enhance content structure to emphasize "Resonance Points"
- Create "Story Arcs" that invite readers into a shared journey
- Develop "Invitation Moments" where readers are encouraged to see themselves in the narrative

### 3.3.2 API Integration Example

```javascript
// src/modules/foundation/content-enhancer.js
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';

export class ContentEnhancer {
  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  
  async fetchInitialContent(projectId) {
    // Fetch all content types from App 3's output
    const contentTypes = [
      'blog',
      'newsletter',
      'social_posts',
      'bio',
      'website'
    ];
    
    const content = {};
    
    for (const type of contentTypes) {
      try {
        const { data, error } = await this.supabase
          .storage
          .from('documents')
          .download(`${projectId}/output_${type}.md`);
          
        if (!error) {
          content[type] = await data.text();
        }
      } catch (err) {
        console.warn(`Content type ${type} not found for project ${projectId}`);
      }
    }
    
    return content;
  }
  
  async fetchResonanceMap(projectId) {
    try {
      const { data, error } = await this.supabase
        .storage
        .from('documents')
        .download(`${projectId}/resonance_map.json`);
        
      if (error) {
        throw new Error(`Failed to fetch resonance map: ${error.message}`);
      }
      
      const text = await data.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn(`Resonance map not found for project ${projectId}, creating default`);
      return { 
        projectId, 
        topConnectionPoints: [],
        themeMap: {}
      };
    }
  }
  
  async fetchEnhancedProfile(projectId) {
    try {
      const { data, error } = await this.supabase
        .storage
        .from('documents')
        .download(`${projectId}/enhanced-style-profile.json`);
        
      if (error) {
        throw new Error(`Failed to fetch enhanced profile: ${error.message}`);
      }
      
      const text = await data.text();
      return JSON.parse(text);
    } catch (err) {
      console.warn(`Enhanced profile not found for project ${projectId}`);
      return null;
    }
  }
  
  async enhanceContent(projectId) {
    // Fetch all necessary data
    const initialContent = await this.fetchInitialContent(projectId);
    const resonanceMap = await this.fetchResonanceMap(projectId);
    const enhancedProfile = await this.fetchEnhancedProfile(projectId);
    
    // Create enhanced content with resonance points
    const enhancedContent = {};
    
    for (const [type, content] of Object.entries(initialContent)) {
      enhancedContent[type] = await this.addResonanceElements(
        content,
        type,
        resonanceMap,
        enhancedProfile
      );
    }
    
    // Store the enhanced content
    await this.storeEnhancedContent(projectId, enhancedContent);
    
    return enhancedContent;
  }
  
  async addResonanceElements(content, contentType, resonanceMap, enhancedProfile) {
    // Different enhancement strategies for different content types
    switch (contentType) {
      case 'blog':
        return this.enhanceBlogContent(content, resonanceMap, enhancedProfile);
      case 'social_posts':
        return this.enhanceSocialContent(content, resonanceMap, enhancedProfile);
      case 'bio':
        return this.enhanceBioContent(content, resonanceMap, enhancedProfile);
      default:
        return content; // Return unchanged if no specific enhancement
    }
  }
  
  async enhanceBlogContent(content, resonanceMap, enhancedProfile) {
    // Use OpenAI to enhance blog content with resonance elements
    const prompt = this.createBlogEnhancementPrompt(content, resonanceMap, enhancedProfile);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert content enhancer that adds elements to create reader connection and 'me too' moments. You preserve the original content while adding resonance points, story arcs, and invitation moments."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return completion.choices[0].message.content;
  }
  
  createBlogEnhancementPrompt(content, resonanceMap, enhancedProfile) {
    return `
    ORIGINAL BLOG CONTENT:
    ${content}
    
    RESONANCE MAP:
    Top Connection Points: ${JSON.stringify(resonanceMap.topConnectionPoints)}
    
    ENHANCED PROFILE:
    Voice Characteristics: ${JSON.stringify(enhancedProfile?.voiceCharacteristics || {})}
    Bridge Narratives: ${JSON.stringify(enhancedProfile?.bridgeNarratives || [])}
    
    INSTRUCTIONS:
    1. Enhance this blog post to create more "me too" moments for readers
    2. Add 2-3 "Resonance Points" - moments where readers can see themselves in the story
    3. Create a "Story Arc" that invites readers into a shared journey
    4. Add 1-2 "Invitation Moments" where readers are explicitly invited to reflect on their own experience
    5. Maintain the original voice, tone, and message
    6. Do not remove any original content
    7. Format in Markdown
    `;
  }
  
  async enhanceSocialContent(content, resonanceMap, enhancedProfile) {
    // Similar to blog enhancement but adapted for social media
    const prompt = this.createSocialEnhancementPrompt(content, resonanceMap, enhancedProfile);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert social media content enhancer that adds elements to create reader connection and engagement. You preserve the original content while adding resonance points and invitation moments."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });
    
    return completion.choices[0].message.content;
  }
  
  createSocialEnhancementPrompt(content, resonanceMap, enhancedProfile) {
    return `
    ORIGINAL SOCIAL MEDIA CONTENT:
    ${content}
    
    RESONANCE MAP:
    Top Connection Points: ${JSON.stringify(resonanceMap.topConnectionPoints)}
    
    ENHANCED PROFILE:
    Voice Characteristics: ${JSON.stringify(enhancedProfile?.voiceCharacteristics || {})}
    
    INSTRUCTIONS:
    1. Enhance these social media posts to create more engagement and "me too" moments
    2. Add question prompts that invite readers to share their own experiences
    3. Include relatable statements that normalize the reader's similar experiences
    4. Maintain the original voice, tone, and message
    5. Keep each post within appropriate character limits for each platform
    6. Format in Markdown with clear separation between posts
    `;
  }
  
  async enhanceBioContent(content, resonanceMap, enhancedProfile) {
    // Bio enhancement focuses on relatability and connection
    const prompt = this.createBioEnhancementPrompt(content, resonanceMap, enhancedProfile);
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert at enhancing professional biographies to create human connection while maintaining professionalism. You preserve the original content while adding elements that make the person more relatable."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    return completion.choices[0].message.content;
  }
  
  createBioEnhancementPrompt(content, resonanceMap, enhancedProfile) {
    return `
    ORIGINAL BIO CONTENT:
    ${content}
    
    RESONANCE MAP:
    Top Connection Points: ${JSON.stringify(resonanceMap.topConnectionPoints)}
    
    ENHANCED PROFILE:
    Voice Characteristics: ${JSON.stringify(enhancedProfile?.voiceCharacteristics || {})}
    Bridge Narratives: ${JSON.stringify(enhancedProfile?.bridgeNarratives || [])}
    
    INSTRUCTIONS:
    1. Enhance this professional bio to create more human connection
    2. Add 1-2 relatable elements that show the person behind the professional
    3. Include a bridge between their professional journey and universal human experiences
    4. Maintain the professional tone while adding warmth
    5. Do not remove any original content or achievements
    6. Format in Markdown
    `;
  }
  
  async storeEnhancedContent(projectId, enhancedContent) {
    for (const [type, content] of Object.entries(enhancedContent)) {
      const { error } = await this.supabase
        .storage
        .from('documents')
        .upload(
          `${projectId}/enhanced_${type}.md`,
          content,
          { contentType: 'text/markdown', upsert: true }
        );
        
      if (error) {
        console.error(`Failed to store enhanced ${type} content: ${error.message}`);
      }
    }
  }
}
```

### 3.3.3 Command Line Setup

```bash
# Create the foundation module directory
mkdir -p src/modules/foundation

# Install dependencies
npm install openai

# Create the content enhancer
touch src/modules/foundation/content-enhancer.js

# Create a test script
cat > scripts/test-content-enhancer.js << 'EOF'
require('dotenv').config();
const { ContentEnhancer } = require('../src/modules/foundation/content-enhancer');

async function main() {
  const enhancer = new ContentEnhancer();
  const projectId = process.argv[2];
  
  if (!projectId) {
    console.error('Please provide a project ID');
    process.exit(1);
  }
  
  try {
    console.log('Enhancing content...');
    const enhancedContent = await enhancer.enhanceContent(projectId);
    console.log('Content enhanced successfully!');
    console.log('Enhanced content types:', Object.keys(enhancedContent).join(', '));
    
    // Print a sample of the enhanced blog content
    if (enhancedContent.blog) {
      console.log('\nSample of enhanced blog content:');
      console.log(enhancedContent.blog.substring(0, 500) + '...');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
EOF

# Run the test script
node scripts/test-content-enhancer.js YOUR_PROJECT_ID
```

### 3.3.4 Story Arc Structure

The enhanced content follows a specific Story Arc structure designed to create reader connection:

1. **Personal Experience**: The client's authentic experience from the interview
2. **Universal Bridge**: Connection to universal human experiences
3. **Invitation Point**: Explicit invitation for readers to reflect on their own experience
4. **Shared Journey**: Framing that creates a sense of traveling the path together
5. **Open Resolution**: Ending that invites continued engagement and sharing

Example Story Arc in a blog post:

```markdown
## My Journey with Imposter Syndrome

When I first started my business, I would wake up every morning wondering if today would be the day everyone realized I had no idea what I was doing. [Personal Experience]

This feeling of being an imposter is something that connects so many of us, especially when we're stepping into new territory or taking on challenges that stretch our capabilities. [Universal Bridge]

**Have you ever felt like you were just pretending to know what you're doing?** That moment when you're sitting in a meeting or presenting to a client, and there's a voice in your head saying "they're going to find out soon"? [Invitation Point]

The journey from self-doubt to self-confidence isn't a straight line—it's a path we navigate together, sometimes moving forward, sometimes stepping back, but always learning. [Shared Journey]

I'm still on this path, and I'd love to hear about your experiences with imposter syndrome and how you've navigated it. Share your story in the comments or reach out directly. Your insight might be exactly what someone else needs to hear today. [Open Resolution]
```
