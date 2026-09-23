import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {
  generateBudgetPlanWithGemini,
  generatePartyPlanWithGemini,
  generateJewelryPlanWithGemini,
} from './geminiService';
import { getHistory, saveHistoryRecord, deleteHistoryRecord } from './historyStore';
import { mockCatalogProducts } from '../src/data/mockProducts';
import { HomeInteriorInput, PartyPlannerInput, JewelryPlannerInput } from '../src/types';

dotenv.config();

export const app = express();

// Support JSON bodies up to 10mb for optional outfit image uploads
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'PocketSmart AI Core API',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    time: new Date().toISOString(),
  });
});

// POST: Generate Home Interior Budget Plan
app.post('/api/recommendations/generate', async (req: Request, res: Response) => {
  try {
    const { room, budget, style, requirements, additionalPreferences } = req.body;

    const numericBudget = Number(budget);
    if (!numericBudget || isNaN(numericBudget) || numericBudget <= 0) {
      res.status(400).json({ error: 'Please provide a valid budget greater than ₹0.' });
      return;
    }

    if (!room || typeof room !== 'string') {
      res.status(400).json({ error: 'Please specify a valid room.' });
      return;
    }

    if (!style || typeof style !== 'string') {
      res.status(400).json({ error: 'Please specify an interior style.' });
      return;
    }

    const reqArray = Array.isArray(requirements) && requirements.length > 0
      ? requirements
      : ['Bed', 'Wardrobe', 'Lighting'];

    const sanitizedInput: HomeInteriorInput = {
      room: room as any,
      budget: numericBudget,
      style: style as any,
      requirements: reqArray,
      additionalPreferences: additionalPreferences ? String(additionalPreferences).slice(0, 500) : '',
    };

    const plan = await generateBudgetPlanWithGemini(sanitizedInput);

    // Auto-save to session history
    saveHistoryRecord({
      module: 'home-interior',
      input: sanitizedInput,
      plan,
    });

    res.json(plan);
  } catch (err: any) {
    console.error('Error generating home recommendation:', err);
    res.status(500).json({
      error: 'Unable to generate budget plan. Please check your inputs and try again.',
    });
  }
});

// POST: Generate Party Budget Plan
app.post('/api/recommendations/party', async (req: Request, res: Response) => {
  try {
    const {
      eventType,
      guests,
      location,
      budget,
      foodPreferences,
      venuePreference,
      decorationPreference,
      additionalRequirements,
    } = req.body;

    const numericBudget = Number(budget);
    if (!numericBudget || isNaN(numericBudget) || numericBudget <= 0) {
      res.status(400).json({ error: 'Please provide a valid budget greater than ₹0.' });
      return;
    }

    const numericGuests = Number(guests);
    if (!numericGuests || isNaN(numericGuests) || numericGuests <= 0) {
      res.status(400).json({ error: 'Number of guests must be a positive number greater than 0.' });
      return;
    }

    if (!eventType || typeof eventType !== 'string') {
      res.status(400).json({ error: 'Please select an event type.' });
      return;
    }

    const foodArray = Array.isArray(foodPreferences) && foodPreferences.length > 0
      ? foodPreferences
      : ['Vegetarian'];

    const sanitizedInput: PartyPlannerInput = {
      eventType: String(eventType),
      guests: Math.round(numericGuests),
      location: location ? String(location).slice(0, 100) : 'India',
      budget: numericBudget,
      foodPreferences: foodArray,
      venuePreference: venuePreference ? String(venuePreference) : 'Any',
      decorationPreference: decorationPreference ? String(decorationPreference) : 'Simple',
      additionalRequirements: additionalRequirements ? String(additionalRequirements).slice(0, 500) : '',
    };

    const plan = await generatePartyPlanWithGemini(sanitizedInput);

    saveHistoryRecord({
      module: 'party-planner',
      input: sanitizedInput,
      plan,
    });

    res.json(plan);
  } catch (err: any) {
    console.error('Error generating party recommendation:', err);
    res.status(500).json({
      error: 'Unable to generate party plan. Please check your inputs and try again.',
    });
  }
});

// POST: Generate Jewelry Budget Plan
app.post('/api/recommendations/jewelry', async (req: Request, res: Response) => {
  try {
    const {
      occasion,
      jewelryType,
      budget,
      style,
      metalPreference,
      additionalPreferences,
      outfitImage,
    } = req.body;

    const numericBudget = Number(budget);
    if (!numericBudget || isNaN(numericBudget) || numericBudget <= 0) {
      res.status(400).json({ error: 'Please provide a valid budget greater than ₹0.' });
      return;
    }

    if (!occasion || typeof occasion !== 'string') {
      res.status(400).json({ error: 'Please select an occasion.' });
      return;
    }

    if (!jewelryType || typeof jewelryType !== 'string') {
      res.status(400).json({ error: 'Please select a jewelry type.' });
      return;
    }

    const sanitizedInput: JewelryPlannerInput = {
      occasion: String(occasion),
      jewelryType: String(jewelryType),
      budget: numericBudget,
      style: style ? String(style) : 'Traditional',
      metalPreference: metalPreference ? String(metalPreference) : 'Gold',
      additionalPreferences: additionalPreferences ? String(additionalPreferences).slice(0, 500) : '',
      outfitImage: outfitImage && outfitImage.data ? {
        data: String(outfitImage.data),
        mimeType: String(outfitImage.mimeType || 'image/jpeg'),
        previewUrl: outfitImage.previewUrl,
      } : undefined,
    };

    const plan = await generateJewelryPlanWithGemini(sanitizedInput);

    // Save without huge base64 payload in history for fast storage
    const inputForHistory = {
      ...sanitizedInput,
      outfitImage: sanitizedInput.outfitImage ? {
        data: '',
        mimeType: sanitizedInput.outfitImage.mimeType,
        previewUrl: sanitizedInput.outfitImage.previewUrl,
      } : undefined,
    };

    saveHistoryRecord({
      module: 'jewelry-planner',
      input: inputForHistory as any,
      plan,
    });

    res.json(plan);
  } catch (err: any) {
    console.error('Error generating jewelry recommendation:', err);
    res.status(500).json({
      error: 'Unable to generate jewelry plan. Please check your inputs and try again.',
    });
  }
});

// GET: History of plans
app.get('/api/history', (req: Request, res: Response) => {
  try {
    const records = getHistory();
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// POST: Explicitly save plan to history
app.post('/api/history', (req: Request, res: Response) => {
  try {
    const { module = 'home-interior', input, plan } = req.body;
    if (!input || !plan) {
      res.status(400).json({ error: 'Missing input or plan payload' });
      return;
    }
    const record = saveHistoryRecord({ module, input, plan });
    res.status(201).json(record);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save record' });
  }
});

// DELETE: Delete a history record
app.delete('/api/history/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = deleteHistoryRecord(id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// GET: Product Catalog
app.get('/api/products', (req: Request, res: Response) => {
  const { category, style, room, maxPrice } = req.query;
  let products = [...mockCatalogProducts];

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }
  if (style) {
    products = products.filter(
      (p) => p.style.toLowerCase() === String(style).toLowerCase() || p.style === 'Universal'
    );
  }
  if (room) {
    products = products.filter(
      (p) => p.room.toLowerCase() === String(room).toLowerCase() || p.room === 'All'
    );
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      products = products.filter((p) => p.price <= max);
    }
  }

  res.json(products);
});

export default app;
