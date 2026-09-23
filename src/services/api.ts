import {
  BudgetPlan,
  CatalogProduct,
  HistoryRecord,
  HomeInteriorInput,
  PartyPlan,
  PartyPlannerInput,
  JewelryPlan,
  JewelryPlannerInput,
  PlanningModule,
  AnyPlannerInput,
  AnyPlanResult,
} from '../types';

const STORAGE_KEY = 'pocketsmart_local_history';

export async function generateInteriorPlan(input: HomeInteriorInput): Promise<BudgetPlan> {
  const response = await fetch('/api/recommendations/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const plan: BudgetPlan = await response.json();
  saveLocalHistoryRecord('home-interior', input, plan);
  return plan;
}

export async function generatePartyPlan(input: PartyPlannerInput): Promise<PartyPlan> {
  const response = await fetch('/api/recommendations/party', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const plan: PartyPlan = await response.json();
  saveLocalHistoryRecord('party-planner', input, plan);
  return plan;
}

export async function generateJewelryPlan(input: JewelryPlannerInput): Promise<JewelryPlan> {
  const response = await fetch('/api/recommendations/jewelry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const plan: JewelryPlan = await response.json();
  // Don't store large base64 string in localStorage
  const cleanInput: JewelryPlannerInput = {
    ...input,
    outfitImage: input.outfitImage ? {
      data: '',
      mimeType: input.outfitImage.mimeType,
      previewUrl: input.outfitImage.previewUrl,
    } : undefined,
  };
  saveLocalHistoryRecord('jewelry-planner', cleanInput, plan);
  return plan;
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  try {
    const response = await fetch('/api/history');
    if (response.ok) {
      const records: HistoryRecord[] = await response.json();
      if (records.length > 0) {
        return records;
      }
    }
  } catch (err) {
    console.warn('Backend history fetch failed, using local backup:', err);
  }

  // Fallback to local storage
  return getLocalHistory();
}

export async function deleteHistoryRecord(id: string): Promise<boolean> {
  try {
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Server delete failed, deleting locally:', err);
  }

  // Remove from localStorage
  const local = getLocalHistory().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
  return true;
}

export async function fetchProducts(category?: string, style?: string): Promise<CatalogProduct[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (style) params.append('style', style);

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to load products');
  }
  return response.json();
}

// LocalStorage helpers
function getLocalHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalHistoryRecord(module: PlanningModule, input: AnyPlannerInput, plan: AnyPlanResult) {
  try {
    const existing = getLocalHistory();
    const record: HistoryRecord = {
      id: plan.id || `hist-${Date.now()}`,
      module,
      timestamp: Date.now(),
      input,
      plan,
    };
    const updated = [record, ...existing.filter((r) => r.id !== record.id)].slice(0, 30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store history in localStorage:', e);
  }
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
