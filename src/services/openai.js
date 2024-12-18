import { openaiClient } from './openaiClient';
import { getConditionTemplate } from './conditionCriteria';
import { MARKET_SOURCES, getRelevantMarketSources } from './marketSources';
import { compressImage, createImageDescription } from '../utils/imageUtils';

export async function detectObjects(originalBase64Image) {
  try {
    if (!originalBase64Image) {
      throw new Error('No image provided');
    }

    // Ensure the base64 string has the correct prefix
    const base64WithPrefix = originalBase64Image.startsWith('data:image') 
      ? originalBase64Image 
      : `data:image/jpeg;base64,${originalBase64Image}`;

    // Step 1: Initial object identification and type analysis
    console.log('Identifying object type...');
    const typeResponse = await openaiClient.chat.completions.create({
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
                url: base64WithPrefix
              }
            }
          ],
        },
      ],
      max_tokens: 150
    });

    if (!typeResponse?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from type identification');
    }

    const objectType = typeResponse.choices[0].message.content.toLowerCase().trim();
    const conditionTemplate = getConditionTemplate(objectType);

    // Step 2: Detailed identification
    console.log('Getting detailed identification...');
    const identificationResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Provide a detailed identification of this object. Include:

# Object Details
- Exact name/title
- Year/era if identifiable
- Manufacturer/creator/brand
- Materials/construction
- Special features or characteristics
- Any unique identifiers or markings
- Size/dimensions if relevant

Format using markdown with headers and bullet points.` 
            },
            { 
              type: "image_url",
              image_url: {
                url: base64WithPrefix
              }
            }
          ],
        },
      ],
      max_tokens: 500
    });

    if (!identificationResponse?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get identification details');
    }

    // Step 3: Condition assessment
    console.log('Assessing condition...');
    const conditionResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze the condition of this object using these criteria:

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
).join('\n')}`
            },
            { 
              type: "image_url",
              image_url: {
                url: base64WithPrefix
              }
            }
          ],
        },
      ],
      max_tokens: 500
    });

    if (!conditionResponse?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get condition assessment');
    }

    // Get market sources
    const marketSources = getRelevantMarketSources(objectType);

    // Step 4: Market value analysis
    console.log('Analyzing market value...');
    const valueResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Based on the identification and condition assessment, provide a market analysis:

# Market Value Analysis

## Market Sources
Using these relevant sources for this type of item:
${marketSources.map(source => `- ${source.name} (${source.type})`).join('\n')}

First, find and provide ONLY a JSON block with REAL, CURRENT listings from these sources (no other text):
\`\`\`json
{
  "sources": [
    {
      "name": "Source Name",
      "value": "$XX.XX",
      "condition": "Listed condition",
      "type": "marketplace|auction|price_guide|dealer",
      "url": "Full URL to the listing",
      "comparison": "How this listing compares to the analyzed item (similarities/differences)"
    }
  ]
}
\`\`\`

Then, after the JSON block, provide:

## Value Matrix
Create a markdown table showing current market values for each condition grade

## Market Information
- Current market trends and recent sales
- Active listing price ranges
- Recent price history
- Special factors affecting current value
- Where this item is actively being sold
- Current market demand and availability

Use the following details:
${identificationResponse.choices[0].message.content}

${conditionResponse.choices[0].message.content}`
            },
            { 
              type: "image_url",
              image_url: {
                url: base64WithPrefix
              }
            }
          ],
        },
      ],
      max_tokens: 1000
    });

    if (!valueResponse?.choices?.[0]?.message?.content) {
      throw new Error('Failed to get market analysis');
    }

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

    // Extract price range
    const priceResponse = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Based on the market analysis below, return ONLY two numbers separated by a comma representing the minimum and maximum price in USD for the assessed condition. For example: "25.50,100.75"
          No other text or explanation.

          Analysis:
          ${valueResponse.choices[0].message.content}`
        }
      ],
      max_tokens: 50
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
      specificType: objectType === 'pokemon_card' ? 'Pokemon Card' : 'Collectible Item',
      identification: identificationResponse.choices[0].message.content,
      condition: {
        assessment: conditionResponse.choices[0].message.content,
        template: conditionTemplate
      },
      marketAnalysis: {
        sources,
        relevantSources: marketSources,
        analysis: valueResponse.choices[0].message.content.replace(/```json\n[\s\S]*?\n```/g, '')
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
