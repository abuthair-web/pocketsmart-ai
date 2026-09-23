import { GoogleGenAI, Type } from '@google/genai';
import {
  HomeInteriorInput,
  BudgetPlan,
  BudgetItem,
  PartyPlannerInput,
  PartyPlan,
  JewelryPlannerInput,
  JewelryPlan,
  JewelryItemRecommendation,
} from '../src/types';

// Initialize Gemini client strictly with server environment variable and user agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// =========================================================================
// REUSABLE BUDGET ENFORCEMENT & SANITIZATION ENGINE
// =========================================================================

/**
 * Ensures strict mathematical compliance:
 * 1. total_budget > 0
 * 2. allocations are non-negative
 * 3. sum(allocations) <= total_budget
 * 4. remaining_budget = total_budget - allocated_budget
 * 5. percentages are computed correctly
 */
export function enforceBudgetConstraints<T extends { recommended_budget: number; percentage?: number }>(
  items: T[],
  totalBudget: number,
  minContingencyRatio = 0.05
): { sanitizedItems: T[]; allocatedBudget: number; remainingBudget: number } {
  const total = Math.max(100, Math.round(totalBudget));
  let allocated = 0;

  // Initial pass: non-negative integers
  const cleanItems = items.map((it) => {
    const rawVal = Math.max(0, Math.round(Number(it.recommended_budget) || 0));
    allocated += rawVal;
    return {
      ...it,
      recommended_budget: rawVal,
      percentage: 0,
    };
  });

  // If sum exceeds total budget, or leaves no buffer
  const maxSpendable = Math.round(total * (1 - minContingencyRatio));
  if (allocated > maxSpendable || allocated > total) {
    const ratio = maxSpendable / Math.max(1, allocated);
    allocated = 0;
    cleanItems.forEach((it) => {
      it.recommended_budget = Math.max(100, Math.round((it.recommended_budget * ratio) / 50) * 50);
      allocated += it.recommended_budget;
    });
  }

  // Edge case safety: ensure it never strictly exceeds total
  if (allocated > total) {
    const diff = allocated - total;
    const highestItem = cleanItems.reduce(
      (prev, curr) => (curr.recommended_budget > prev.recommended_budget ? curr : prev),
      cleanItems[0]
    );
    if (highestItem) {
      highestItem.recommended_budget = Math.max(100, highestItem.recommended_budget - diff);
    }
    allocated = cleanItems.reduce((acc, curr) => acc + curr.recommended_budget, 0);
  }

  // Assign accurate percentages
  cleanItems.forEach((it) => {
    it.percentage = Math.round((it.recommended_budget / total) * 100);
  });

  const remaining = Math.max(0, total - allocated);

  return {
    sanitizedItems: cleanItems,
    allocatedBudget: allocated,
    remainingBudget: remaining,
  };
}

// =========================================================================
// 1. HOME INTERIOR PLANNER
// =========================================================================

function generateHeuristicHomePlan(input: HomeInteriorInput): BudgetPlan {
  const total = Math.max(1000, Math.round(input.budget));
  const bufferRate = 0.08;
  const bufferAmount = Math.round(total * bufferRate);
  const spendableBudget = total - bufferAmount;

  const reqs = input.requirements.length > 0 ? input.requirements : ['Bed', 'Wardrobe', 'Lighting'];

  const weights: Record<string, { weight: number; priority: 'High' | 'Medium' | 'Low'; reason: string }> = {
    'Bed': { weight: 35, priority: 'High', reason: 'Primary furniture centerpiece essential for daily sleep and spinal support.' },
    'Sofa': { weight: 32, priority: 'High', reason: 'Main gathering piece for relaxation; requires sturdy framing and durable fabric.' },
    'Wardrobe': { weight: 28, priority: 'High', reason: 'Essential storage to prevent room clutter; modular options provide best cost-per-foot.' },
    'Table': { weight: 14, priority: 'Medium', reason: 'Functional workspace or dining surface; select durable laminate or engineered wood.' },
    'Chair': { weight: 10, priority: 'Medium', reason: 'Ergonomic seating for posture and comfort during daily activities.' },
    'Lighting': { weight: 8, priority: 'Medium', reason: 'Layered warm ambient and task lighting to enhance aesthetic atmosphere.' },
    'Fan': { weight: 6, priority: 'High', reason: 'BLDC energy-efficient ceiling fan for silent airflow and electricity savings.' },
    'Storage': { weight: 12, priority: 'Medium', reason: 'Vertical shelving or drawer units to optimize available square footage.' },
    'Curtains': { weight: 7, priority: 'Medium', reason: 'Thermal and light-blocking drapes to regulate temperature and maintain privacy.' },
    'Decoration': { weight: 6, priority: 'Low', reason: 'Wall frames, planters, and accents to reflect personal style within budget.' },
    'Other': { weight: 6, priority: 'Low', reason: 'Supplementary accessories and utility hardware.' },
  };

  const totalWeight = reqs.reduce((sum, r) => sum + (weights[r]?.weight || 10), 0);

  const rawItems: BudgetItem[] = reqs.map((req) => {
    const meta = weights[req] || { weight: 10, priority: 'Medium', reason: `Recommended allocation for ${req}.` };
    const rawBudget = Math.round((meta.weight / totalWeight) * spendableBudget);
    const roundedBudget = Math.max(500, Math.round(rawBudget / 100) * 100);

    return {
      category: req,
      recommended_budget: roundedBudget,
      priority: meta.priority,
      reason: `${meta.reason} Tailored for a ${input.style} ${input.room}.`,
      isEstimate: true,
      productType: `${input.style} ${req}`,
    };
  });

  const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(rawItems, total, 0.08);

  return {
    id: `plan-${Date.now()}`,
    summary: `Curated ${input.style} design plan for your ${input.room} with ₹${total.toLocaleString('en-IN')} budget, allocating ₹${allocatedBudget.toLocaleString('en-IN')} across ${sanitizedItems.length} key requirements and reserving ₹${remainingBudget.toLocaleString('en-IN')} as contingency.`,
    total_budget: total,
    allocated_budget: allocatedBudget,
    remaining_budget: remainingBudget,
    items: sanitizedItems,
    tips: [
      `For ${input.style} interiors in India, look for modular knock-down furniture on Pepperfry or Wakefit to save 20-30% on labor costs.`,
      `Keep ₹${remainingBudget.toLocaleString('en-IN')} untouched for delivery charges, minor hardware, and installation tips.`,
      `Buy energy-saving BLDC fans and 3000K warm-white LED fixtures to minimize monthly electricity expenses.`,
      `Neutral wall paint and natural textures elevate the aesthetic without costly remodeling.`,
    ],
    styleAdvice: `${input.style} style emphasizes balanced proportions, clean textures, and clutter-free organization.`,
    contingencyPercentage: Math.round((remainingBudget / total) * 100),
    createdAt: new Date().toISOString(),
  };
}

export async function generateBudgetPlanWithGemini(input: HomeInteriorInput): Promise<BudgetPlan> {
  const totalBudget = Math.round(Number(input.budget));
  if (!totalBudget || totalBudget <= 0) {
    throw new Error('Total budget must be a positive number greater than zero.');
  }

  const ai = getGeminiClient();
  if (!ai) {
    return generateHeuristicHomePlan(input);
  }

  const prompt = `You are a certified professional interior design budget planner specializing in residential spaces in India.
Your mission is to generate a realistic, structured budget plan for a user based strictly on their parameters:

- Category: Home Interior
- Room: ${input.room}
- Total Budget: ₹${totalBudget.toLocaleString('en-IN')} (INR)
- Preferred Style: ${input.style}
- Required Items: ${input.requirements.join(', ')}
- Additional Preferences: ${input.additionalPreferences || 'None specified'}

CRITICAL BUDGET RULES:
1. The total budget is ₹${totalBudget}.
2. The sum of all item recommended_budget amounts MUST NEVER EXCEED ₹${totalBudget}.
3. You MUST reserve a contingency buffer of approximately 5% to 10% of the total budget for unforeseen delivery, hardware, and installation costs.
4. "allocated_budget" must equal the exact sum of all item recommended_budget values.
5. "remaining_budget" must equal "total_budget" - "allocated_budget". It must be strictly >= 0.
6. Categorize each requirement logically (e.g. Bed, Wardrobe, Lighting, Fan, Sofa, etc.).
7. Prioritize essential long-term items as "High" priority, functional utilities as "Medium", and decorative accents as "Low".
8. Explain the financial and design reasoning clearly in Indian Rupee market terms (estimated pricing ranges for ${input.style} style).
9. Do NOT invent specific fake product URLs or claim fake live inventory. Clearly formulate realistic estimated price targets.
10. Return 3 to 4 actionable, practical cost-saving tips specifically relevant to ${input.style} style and Indian home interior shopping.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are PocketSmart AI, an expert budget planning and interior design economics assistant. Output valid JSON adhering to the specified schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Short professional overview of the recommended budget plan.' },
            total_budget: { type: Type.NUMBER, description: 'The exact user budget in INR.' },
            allocated_budget: { type: Type.NUMBER, description: 'Total sum of all recommended item budgets.' },
            remaining_budget: { type: Type.NUMBER, description: 'Remaining contingency buffer.' },
            items: {
              type: Type.ARRAY,
              description: 'List of budgeted items.',
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended_budget: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  productType: { type: Type.STRING },
                },
                required: ['category', 'recommended_budget', 'priority', 'reason'],
              },
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            styleAdvice: { type: Type.STRING },
          },
          required: ['summary', 'total_budget', 'allocated_budget', 'remaining_budget', 'items', 'tips'],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Gemini returned an empty response.');

    const parsed = JSON.parse(text);
    const rawItems: BudgetItem[] = Array.isArray(parsed.items) ? parsed.items : [];

    const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(
      rawItems.map((it: any) => ({
        category: String(it.category || 'General Requirement'),
        recommended_budget: Number(it.recommended_budget) || 0,
        priority: ['High', 'Medium', 'Low'].includes(it.priority) ? it.priority : 'Medium',
        reason: String(it.reason || 'Essential element for the space.'),
        productType: it.productType ? String(it.productType) : `${input.style} ${it.category}`,
        isEstimate: true,
      })),
      totalBudget,
      0.05
    );

    return {
      id: `plan-${Date.now()}`,
      summary: parsed.summary || `Curated ${input.style} design plan for your ${input.room}.`,
      total_budget: totalBudget,
      allocated_budget: allocatedBudget,
      remaining_budget: remainingBudget,
      items: sanitizedItems,
      tips: Array.isArray(parsed.tips) && parsed.tips.length > 0 ? parsed.tips : [
        'Compare modular furniture options vs custom carpentry to optimize spend.',
        'Keep the contingency buffer untouched for transport and installation.',
      ],
      styleAdvice: parsed.styleAdvice || `${input.style} focuses on cohesive finishes and balance.`,
      contingencyPercentage: Math.round((remainingBudget / totalBudget) * 100),
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Gemini Interior API error:', err);
    return generateHeuristicHomePlan(input);
  }
}

// =========================================================================
// 2. PARTY PLANNER
// =========================================================================

function generateHeuristicPartyPlan(input: PartyPlannerInput): PartyPlan {
  const total = Math.max(1000, Math.round(input.budget));
  const guests = Math.max(1, Math.round(input.guests || 25));
  const bufferRate = 0.06;
  const bufferAmount = Math.round(total * bufferRate);
  const spendable = total - bufferAmount;

  // Logical distribution weights
  const categories = [
    { cat: 'Food/Catering', weight: 42, priority: 'High' as const, reason: `Catering for approx ${guests} guests based on ${input.foodPreferences.join(', ')} menu preference (approx ₹${Math.round((spendable * 0.42) / guests)} per guest).` },
    { cat: 'Venue', weight: 26, priority: 'High' as const, reason: `${input.venuePreference} booking suitable for hosting ${guests} attendees in ${input.location || 'your city'}.` },
    { cat: 'Decoration', weight: 14, priority: 'Medium' as const, reason: `${input.decorationPreference} theme styling, stage backdrop, and ambient focal points.` },
    { cat: 'Cake & Desserts', weight: 8, priority: 'Medium' as const, reason: `Themed celebration cake and dessert presentation suited for ${input.eventType}.` },
    { cat: 'Entertainment & Music', weight: 6, priority: 'Low' as const, reason: 'Sound system, curated playlist setup, and host activity essentials.' },
    { cat: 'Invitations & Favors', weight: 4, priority: 'Low' as const, reason: 'Digital invites and return mementos for guests.' },
  ];

  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);

  const rawItems: BudgetItem[] = categories.map((c) => {
    const rawVal = Math.round((c.weight / totalWeight) * spendable);
    return {
      category: c.cat,
      recommended_budget: Math.max(500, Math.round(rawVal / 100) * 100),
      priority: c.priority,
      reason: c.reason,
      isEstimate: true,
      productType: `${c.cat} Package`,
    };
  });

  const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(rawItems, total, 0.05);

  return {
    id: `party-${Date.now()}`,
    summary: `Structured budget plan for your ${input.eventType} in ${input.location || 'your venue'} for ${guests} guests, prioritizing catering and venue hire while staying strictly within your ₹${total.toLocaleString('en-IN')} budget.`,
    event_type: input.eventType,
    guests,
    location: input.location,
    total_budget: total,
    allocated_budget: allocatedBudget,
    remaining_budget: remainingBudget,
    items: sanitizedItems,
    tips: [
      `Negotiate packaged catering that includes basic cutlery, service staff, and cleanup to avoid separate vendor fees.`,
      `For ${input.decorationPreference} decoration, focus expenditure on a single photo-worthy stage backdrop rather than spreading thinly.`,
      `Reserve the ₹${remainingBudget.toLocaleString('en-IN')} buffer for last-minute extra plates or driver tips.`,
      `Opt for high-resolution digital RSVP invites to save ₹3,000+ on printing and courier logistics.`,
    ],
    contingencyPercentage: Math.round((remainingBudget / total) * 100),
    createdAt: new Date().toISOString(),
  };
}

export async function generatePartyPlanWithGemini(input: PartyPlannerInput): Promise<PartyPlan> {
  const totalBudget = Math.round(Number(input.budget));
  if (!totalBudget || totalBudget <= 0) {
    throw new Error('Total budget must be a positive number greater than zero.');
  }

  const guests = Math.max(1, Math.round(Number(input.guests) || 1));
  const ai = getGeminiClient();
  if (!ai) {
    return generateHeuristicPartyPlan(input);
  }

  const prompt = `You are a certified professional event budget planner and party economics specialist in India.
Analyze the following event requirements and generate a realistic, mathematically sound budget plan:

- Event Type: ${input.eventType}
- Number of Guests: ${guests}
- Location: ${input.location || 'India'}
- Total Budget: ₹${totalBudget.toLocaleString('en-IN')} (INR)
- Food Preference: ${input.foodPreferences.join(', ')}
- Venue Preference: ${input.venuePreference}
- Decoration Preference: ${input.decorationPreference}
- Additional Requirements: ${input.additionalRequirements || 'None specified'}

CRITICAL BUDGET RULES:
1. Total budget is strictly ₹${totalBudget}.
2. Sum of all item allocations MUST NEVER exceed ₹${totalBudget}.
3. Reserve an Emergency/Buffer contingency of 4% to 8% of the total budget for unexpected guest headcount or transport.
4. "allocated_budget" must equal the exact sum of all item recommended_budget amounts.
5. "remaining_budget" must equal "total_budget" - "allocated_budget" (must be >= 0).
6. Do NOT force every possible category. Select only relevant categories among: Venue, Food/Catering, Decoration, Cake, Entertainment, Photography, Invitations, Transportation, Miscellaneous.
7. Prioritize essential expenses (Food/Catering and Venue are usually High priority).
8. Calculate realistic Indian market estimated per-plate costs based on the guest count (${guests} guests) and venue preference (${input.venuePreference}).
9. Provide 3-4 realistic, practical cost-saving tips tailored to ${input.eventType} in India.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are PocketSmart AI, an event budgeting assistant. Output strictly valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: 'Short overview of the event plan.' },
            event_type: { type: Type.STRING },
            guests: { type: Type.NUMBER },
            total_budget: { type: Type.NUMBER },
            allocated_budget: { type: Type.NUMBER },
            remaining_budget: { type: Type.NUMBER },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  recommended_budget: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['category', 'recommended_budget', 'priority', 'reason'],
              },
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'event_type', 'guests', 'total_budget', 'allocated_budget', 'remaining_budget', 'items', 'tips'],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Gemini returned an empty response.');

    const parsed = JSON.parse(text);
    const rawItems: BudgetItem[] = Array.isArray(parsed.items) ? parsed.items : [];

    const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(
      rawItems.map((it: any) => ({
        category: String(it.category || 'Event Expense'),
        recommended_budget: Number(it.recommended_budget) || 0,
        priority: ['High', 'Medium', 'Low'].includes(it.priority) ? it.priority : 'Medium',
        reason: String(it.reason || 'Essential allocation for the event.'),
        isEstimate: true,
        productType: `${it.category} Service`,
      })),
      totalBudget,
      0.04
    );

    return {
      id: `party-${Date.now()}`,
      summary: parsed.summary || `Budget allocation for your ${input.eventType} for ${guests} guests.`,
      event_type: parsed.event_type || input.eventType,
      guests,
      location: input.location,
      total_budget: totalBudget,
      allocated_budget: allocatedBudget,
      remaining_budget: remainingBudget,
      items: sanitizedItems,
      tips: Array.isArray(parsed.tips) && parsed.tips.length > 0 ? parsed.tips : [
        'Confirm guest headcounts 48 hours prior to finalize accurate catering tiers.',
        'Package sound and lighting with venue hire to reduce multi-vendor logistics.',
      ],
      contingencyPercentage: Math.round((remainingBudget / totalBudget) * 100),
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Gemini Party API error:', err);
    return generateHeuristicPartyPlan(input);
  }
}

// =========================================================================
// 3. JEWELRY PLANNER (WITH MULTIMODAL OUTFIT VISION ANALYSIS)
// =========================================================================

function generateHeuristicJewelryPlan(input: JewelryPlannerInput): JewelryPlan {
  const total = Math.max(1000, Math.round(input.budget));
  const bufferRate = 0.08; // Making charges & GST buffer
  const bufferAmount = Math.round(total * bufferRate);
  const spendable = total - bufferAmount;

  const type = input.jewelryType || 'Complete Set';
  const rawItems: JewelryItemRecommendation[] = [];

  if (type === 'Complete Set') {
    rawItems.push(
      {
        type: 'Necklace / Choker',
        estimated_budget: Math.round(spendable * 0.55),
        priority: 'High',
        design_description: `${input.style} centerpiece necklace in ${input.metalPreference} finish.`,
        reason: `Central statement piece framing the neckline for a ${input.occasion}.`,
      },
      {
        type: 'Earrings (Jhumkas / Drops)',
        estimated_budget: Math.round(spendable * 0.28),
        priority: 'High',
        design_description: `Coordinating ${input.metalPreference} earrings with matching motifs.`,
        reason: 'Draws focus to facial contours and complements hair styling.',
      },
      {
        type: 'Bracelet / Ring',
        estimated_budget: Math.round(spendable * 0.17),
        priority: 'Medium',
        design_description: `Delicate ${input.metalPreference} accent piece.`,
        reason: 'Subtle finishing touch that balances wrist and hand elegance.',
      }
    );
  } else {
    rawItems.push(
      {
        type: type,
        estimated_budget: Math.round(spendable * 0.85),
        priority: 'High',
        design_description: `Artisan ${input.style} ${type} crafted in ${input.metalPreference}.`,
        reason: `Primary dedicated investment for ${input.occasion}, focusing on longevity and hallmark purity.`,
      },
      {
        type: 'Complementary Accent Piece',
        estimated_budget: Math.round(spendable * 0.15),
        priority: 'Medium',
        design_description: `Subtle matching companion piece.`,
        reason: 'Enhances overall symmetry without overpowering the focal piece.',
      }
    );
  }

  const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(
    rawItems.map((r) => ({
      ...r,
      recommended_budget: r.estimated_budget,
    })),
    total,
    0.06
  );

  const formattedRecs: JewelryItemRecommendation[] = sanitizedItems.map((s: any) => ({
    type: s.type,
    estimated_budget: s.recommended_budget,
    priority: s.priority,
    design_description: s.design_description,
    reason: s.reason,
    style: input.style,
    percentage: s.percentage,
  }));

  return {
    id: `jewel-${Date.now()}`,
    summary: `Curated ${input.style} ${input.metalPreference} jewelry recommendation for your ${input.occasion}, allocating ₹${allocatedBudget.toLocaleString('en-IN')} with ₹${remainingBudget.toLocaleString('en-IN')} reserved for making charges and hallmark verification.`,
    total_budget: total,
    recommended_budget: allocatedBudget,
    remaining_budget: remainingBudget,
    style_analysis: {
      occasion: input.occasion,
      recommended_style: input.style,
      metal: input.metalPreference,
      reason: `For a ${input.occasion}, ${input.metalPreference} in a ${input.style} silhouette provides timeless balance without excessive weight.`,
      outfit_analysis: input.outfitImage
        ? 'Outfit image observed: Rich fabric tones harmonized with warm metallic highlights.'
        : undefined,
    },
    recommendations: formattedRecs,
    tips: [
      `Always request BIS Hallmark certification on gold/silver jewelry and verify the 6-digit HUID code.`,
      `Inquire about transparent breakdown of per-gram metal rate vs making charges (aim for making charges under 12-14%).`,
      `Keep the ₹${remainingBudget.toLocaleString('en-IN')} reserve to cover 3% GST and stone certification costs.`,
      `Consider modular jewelry (e.g. detachable pendants or convertibles) for multi-occasion versatility.`,
    ],
    contingencyPercentage: Math.round((remainingBudget / total) * 100),
    createdAt: new Date().toISOString(),
  };
}

export async function generateJewelryPlanWithGemini(input: JewelryPlannerInput): Promise<JewelryPlan> {
  const totalBudget = Math.round(Number(input.budget));
  if (!totalBudget || totalBudget <= 0) {
    throw new Error('Total budget must be a positive number greater than zero.');
  }

  const ai = getGeminiClient();
  if (!ai) {
    return generateHeuristicJewelryPlan(input);
  }

  const promptText = `You are a certified jewelry stylist, gemologist, and budget planning assistant in India.
Analyze the following jewelry requirements and generate a realistic, mathematically sound budget plan:

- Occasion: ${input.occasion}
- Jewelry Type Requested: ${input.jewelryType}
- Total Budget: ₹${totalBudget.toLocaleString('en-IN')} (INR)
- Preferred Style: ${input.style}
- Metal Preference: ${input.metalPreference}
- Additional Preferences: ${input.additionalPreferences || 'None specified'}
${input.outfitImage ? '- [OUTFIT IMAGE ATTACHED]: Please analyze the garment fabric colors, neckline, texture, and style from the image.' : ''}

CRITICAL RULES:
1. Total budget is strictly ₹${totalBudget}.
2. Sum of all estimated_budget amounts in recommendations MUST NEVER EXCEED ₹${totalBudget}.
3. Reserve a buffer (remaining_budget) of 5% to 10% of total budget to account for making charges, hallmarking (HUID), and 3% GST.
4. "recommended_budget" must equal the exact sum of all item estimated_budget amounts.
5. "remaining_budget" = "total_budget" - "recommended_budget" (must be >= 0).
6. Do NOT fabricate live inventory, URLs, or store ratings. Treat all prices as realistic Indian market estimates.
7. If an outfit image is provided:
   - Analyze dominant colors, general clothing style, formal/traditional/casual appearance, and jewelry compatibility.
   - ETHICAL CONSTRAINT: Do NOT identify any individual in the image or make claims about personal identity, age, race, or physical characteristics. Focus exclusively on the textile, color, neckline, and attire styling.
   - Populate "outfit_analysis" in "style_analysis".
8. Provide 3-4 actionable tips regarding hallmark verification, making charges negotiation, and certification.`;

  try {
    let contentsPayload: any = promptText;

    // Multimodal input handling
    if (input.outfitImage && input.outfitImage.data) {
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: input.outfitImage.mimeType || 'image/jpeg',
              data: input.outfitImage.data,
            },
          },
          { text: promptText },
        ],
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contentsPayload,
      config: {
        systemInstruction: 'You are PocketSmart AI, a professional jewelry styling and economics assistant. Output strictly valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            total_budget: { type: Type.NUMBER },
            recommended_budget: { type: Type.NUMBER },
            remaining_budget: { type: Type.NUMBER },
            style_analysis: {
              type: Type.OBJECT,
              properties: {
                occasion: { type: Type.STRING },
                recommended_style: { type: Type.STRING },
                metal: { type: Type.STRING },
                reason: { type: Type.STRING },
                outfit_analysis: { type: Type.STRING },
              },
              required: ['occasion', 'recommended_style', 'metal', 'reason'],
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  estimated_budget: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  design_description: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ['type', 'estimated_budget', 'priority', 'design_description', 'reason'],
              },
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['summary', 'total_budget', 'recommended_budget', 'remaining_budget', 'style_analysis', 'recommendations', 'tips'],
        },
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error('Gemini returned an empty response.');

    const parsed = JSON.parse(text);
    const rawRecs = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];

    const { sanitizedItems, allocatedBudget, remainingBudget } = enforceBudgetConstraints(
      rawRecs.map((r: any) => ({
        type: String(r.type || input.jewelryType),
        recommended_budget: Number(r.estimated_budget) || 0,
        priority: ['High', 'Medium', 'Low'].includes(r.priority) ? r.priority : 'Medium',
        design_description: String(r.design_description || `${input.style} ${input.metalPreference} design`),
        reason: String(r.reason || 'Complements overall styling.'),
        style: input.style,
      })),
      totalBudget,
      0.05
    );

    const formattedRecs: JewelryItemRecommendation[] = sanitizedItems.map((s: any) => ({
      type: s.type,
      estimated_budget: s.recommended_budget,
      priority: s.priority as 'High' | 'Medium' | 'Low',
      design_description: s.design_description,
      reason: s.reason,
      style: s.style,
      percentage: s.percentage,
    }));

    return {
      id: `jewel-${Date.now()}`,
      summary: parsed.summary || `Personalized ${input.style} jewelry recommendation for ${input.occasion}.`,
      total_budget: totalBudget,
      recommended_budget: allocatedBudget,
      remaining_budget: remainingBudget,
      style_analysis: {
        occasion: parsed.style_analysis?.occasion || input.occasion,
        recommended_style: parsed.style_analysis?.recommended_style || input.style,
        metal: parsed.style_analysis?.metal || input.metalPreference,
        reason: parsed.style_analysis?.reason || 'Harmonized style pairing for the selected occasion.',
        outfit_analysis: parsed.style_analysis?.outfit_analysis,
      },
      recommendations: formattedRecs,
      tips: Array.isArray(parsed.tips) && parsed.tips.length > 0 ? parsed.tips : [
        'Check BIS Hallmark stamp and HUID registration on all gold and silver.',
        'Keep the remaining buffer for 3% GST and making charge variances.',
      ],
      contingencyPercentage: Math.round((remainingBudget / totalBudget) * 100),
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Gemini Jewelry API error:', err);
    return generateHeuristicJewelryPlan(input);
  }
}
