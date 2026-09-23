export type PlanningModule = 'home-interior' | 'party-planner' | 'jewelry-planner';

// =================== HOME INTERIOR TYPES ===================
export type RoomType =
  | 'Bedroom'
  | 'Living Room'
  | 'Kitchen'
  | 'Dining Room'
  | 'Home Office'
  | 'Other';

export type InteriorStyle =
  | 'Modern'
  | 'Minimalist'
  | 'Traditional'
  | 'Luxury'
  | 'Scandinavian'
  | 'Industrial';

export interface HomeInteriorInput {
  room: RoomType;
  budget: number;
  style: InteriorStyle;
  requirements: string[];
  additionalPreferences?: string;
}

export interface BudgetItem {
  category: string;
  recommended_budget: number;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  percentage?: number;
  productType?: string;
  isEstimate?: boolean;
}

export interface BudgetPlan {
  id?: string;
  summary: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  items: BudgetItem[];
  tips: string[];
  styleAdvice?: string;
  contingencyPercentage?: number;
  createdAt?: string;
}

// =================== PARTY PLANNER TYPES ===================
export type PartyEventType =
  | 'Birthday'
  | 'Wedding'
  | 'Engagement'
  | 'Anniversary'
  | 'Baby Shower'
  | 'Corporate Event'
  | 'College/Student Event'
  | 'Family Function'
  | 'Other';

export type FoodPreference =
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Vegan'
  | 'Jain'
  | 'Mixed';

export type VenuePreference =
  | 'Banquet Hall'
  | 'Restaurant'
  | 'Hotel'
  | 'Outdoor'
  | 'Home'
  | 'Community Hall'
  | 'Any';

export type DecorationPreference =
  | 'Simple'
  | 'Modern'
  | 'Traditional'
  | 'Luxury'
  | 'Minimal';

export interface PartyPlannerInput {
  eventType: PartyEventType | string;
  guests: number;
  location: string;
  budget: number;
  foodPreferences: string[];
  venuePreference: VenuePreference | string;
  decorationPreference: DecorationPreference | string;
  additionalRequirements?: string;
}

export interface PartyPlan {
  id?: string;
  summary: string;
  event_type: string;
  guests: number;
  location?: string;
  total_budget: number;
  allocated_budget: number;
  remaining_budget: number;
  items: BudgetItem[];
  tips: string[];
  contingencyPercentage?: number;
  createdAt?: string;
}

// =================== JEWELRY PLANNER TYPES ===================
export type JewelryOccasion =
  | 'Wedding'
  | 'Engagement'
  | 'Reception'
  | 'Festival'
  | 'Party'
  | 'Casual'
  | 'Traditional Function'
  | 'Gift';

export type JewelryType =
  | 'Necklace'
  | 'Earrings'
  | 'Bracelet'
  | 'Ring'
  | 'Bangles'
  | 'Pendant'
  | 'Complete Set'
  | 'Other';

export type JewelryStyle =
  | 'Traditional'
  | 'Modern'
  | 'Minimalist'
  | 'Bridal'
  | 'Elegant'
  | 'Statement'
  | 'Indo-Western';

export type MetalPreference =
  | 'Gold'
  | 'Silver'
  | 'Platinum'
  | 'Rose Gold'
  | 'No Preference';

export interface OutfitImagePayload {
  data: string; // base64 encoded data without data:image/xxx;base64, prefix
  mimeType: string;
  previewUrl?: string;
}

export interface JewelryPlannerInput {
  occasion: JewelryOccasion | string;
  jewelryType: JewelryType | string;
  budget: number;
  style: JewelryStyle | string;
  metalPreference: MetalPreference | string;
  additionalPreferences?: string;
  outfitImage?: OutfitImagePayload;
}

export interface JewelryItemRecommendation {
  type: string;
  estimated_budget: number;
  priority: 'High' | 'Medium' | 'Low';
  design_description: string;
  reason: string;
  style?: string;
  percentage?: number;
}

export interface JewelryStyleAnalysis {
  occasion: string;
  recommended_style: string;
  metal: string;
  reason: string;
  outfit_analysis?: string;
}

export interface JewelryPlan {
  id?: string;
  summary: string;
  total_budget: number;
  recommended_budget: number;
  remaining_budget: number;
  style_analysis: JewelryStyleAnalysis;
  recommendations: JewelryItemRecommendation[];
  tips: string[];
  contingencyPercentage?: number;
  createdAt?: string;
}

// =================== GENERAL & SHARED TYPES ===================
export type AnyPlannerInput = HomeInteriorInput | PartyPlannerInput | JewelryPlannerInput;
export type AnyPlanResult = BudgetPlan | PartyPlan | JewelryPlan;

export interface HistoryRecord {
  id: string;
  module: PlanningModule;
  timestamp: number;
  input: AnyPlannerInput;
  plan: AnyPlanResult;
}

export interface CatalogProduct {
  id: string;
  name: string;
  category: string;
  platform: 'IKEA' | 'Urban Ladder' | 'Pepperfry' | 'Amazon Home' | 'Wakefit';
  price: number;
  imageUrl: string;
  productUrl: string;
  style: InteriorStyle | 'Universal';
  availability: 'In Stock' | 'Limited Stock' | 'Made to Order';
  room: RoomType | 'All';
  estimatedDeliveryDays: number;
}
