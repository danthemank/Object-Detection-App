import OpenAI from 'openai';
import { getConditionTemplate } from './conditionCriteria';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey || apiKey === 'your-openai-api-key-here') {
  throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export async function detectObjects(base64Image) {
  try {
    if (!base64Image) {
      throw new Error('No image provided');
    }

    // Step 1: Initial object identification and type
    console.log('Identifying object type...');
    const typeResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "What type of object is this? Respond with just: pokemon_card or collectible" 
            },
            { 
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ],
        },
      ],
      max_tokens: 50,
    });

    const objectType = typeResponse.choices[0].message.content.toLowerCase().trim();
    const conditionTemplate = getConditionTemplate(objectType);

    // Step 2: Detailed identification
    console.log('Getting detailed identification...');
    const identificationResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Provide a detailed identification of this ${objectType}. Include:
              
              # Object Details
              - Exact name/title
              - Year/series
              - Manufacturer/publisher
              - Special features or variants
              - Unique identifiers
              
              Format using markdown with headers and bullet points.` 
            },
            { 
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    // Step 3: Condition assessment
    console.log('Assessing condition...');
    const conditionPrompt = `Analyze the condition of this ${objectType} using these criteria:

# Condition Assessment Criteria
${conditionTemplate.criteria.map(c => `## ${c.name} (${c.points} points)
- ${c.description}
- Assess condition and assign points (0-${c.points})`).join('\n\n')}

Provide a detailed markdown report with:
1. Points assigned for each criterion
2. Specific observations
3. Total points calculated
4. Overall grade based on this scale:

${conditionTemplate.grades.map(g => 
  `- ${g.grade} (${g.value}): ${g.minPoints}+ points - ${g.description}`
).join('\n')}`;

    const conditionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: conditionPrompt
            },
            { 
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ],
        },
      ],
      max_tokens: 500,
    });

    // Step 4: Market value analysis with sources
    console.log('Analyzing market value...');
    const valuePrompt = `Based on the identification and condition assessment, provide a market analysis:

# Market Value Analysis

## Market Sources
Provide 3 specific sources where this item is currently listed for sale, including:
- Source name (e.g., eBay, TCGPlayer, PSA)
- Listed price
- Condition description
- URL to listing

Format as JSON within markdown code block like this:
\`\`\`json
{
  "sources": [
    {
      "name": "Source Name",
      "value": "$XX.XX",
      "condition": "Condition description",
      "url": "https://example.com"
    }
  ]
}
\`\`\`

## Value Matrix
Create a markdown table showing values for each condition grade

## Market Information
- Current market trends
- Notable value factors
- Price history trends

Use the following details:
${identificationResponse.choices[0].message.content}

${conditionResponse.choices[0].message.content}`;

    const valueResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: valuePrompt
        }
      ],
      max_tokens: 500,
    });

    // Extract sources from the response
    const sourcesMatch = valueResponse.choices[0].message.content.match(/```json\n([\s\S]*?)\n```/);
    let sources = [];
    if (sourcesMatch) {
      try {
        sources = JSON.parse(sourcesMatch[1]).sources;
      } catch (e) {
        console.error('Failed to parse sources JSON:', e);
      }
    }

    // Extract price range for assessed condition
    const priceResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Based on the market analysis below, provide only the minimum and maximum price in USD for the assessed condition as numbers separated by a comma. For example: "25.50,100.75"

          Analysis:
          ${valueResponse.choices[0].message.content}`
        }
      ],
      max_tokens: 50,
    });

    const [minPrice, maxPrice] = priceResponse.choices[0].message.content
      .split(',')
      .map(price => parseFloat(price.trim()));
    
    const avgPrice = (minPrice + maxPrice) / 2;
    
    // Determine value category
    let category;
    if (avgPrice >= 100) {
      category = 'Valuable';
    } else if (avgPrice >= 25) {
      category = 'Somewhat Valuable';
    } else {
      category = 'Not Valuable';
    }

    return {
      type: objectType,
      identification: identificationResponse.choices[0].message.content,
      condition: {
        assessment: conditionResponse.choices[0].message.content,
        template: conditionTemplate
      },
      marketAnalysis: {
        sources,
        analysis: valueResponse.choices[0].message.content.replace(/```json\n[\s\S]*?\n```/g, '') // Remove JSON block from display
      },
      value: {
        category,
        range: {
          min: minPrice,
          max: maxPrice,
          average: avgPrice
        }
      }
    };
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing OpenAI API key. Please check your configuration.');
    }
    throw new Error(`Failed to analyze image: ${error.message}`);
  }
}
