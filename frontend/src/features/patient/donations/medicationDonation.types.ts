export type DonationTab = 'browse' | 'post' | 'my-requests' | 'my-donations';
export type DonationCategory = 'all' | 'medication' | 'equipment';
export type DonationType = 'medication' | 'equipment';
export type DonationStatus = 'available' | 'reserved' | 'given';
export type DonationCondition = 'new' | 'very-good' | 'good';
export type DonationPostStep = 1 | 2 | 3;

export interface Donation {
  id: string;
  type: DonationType;
  name: string;
  brand?: string;
  category: string;
  condition: DonationCondition;
  quantity: number;
  unit: string;
  location: string;
  expiryDate?: string;
  requiresPrescription: boolean;
  status: DonationStatus;
  donorName: string;
  donorRating: number;
  donorVerified: boolean;
  donorBadge?: string;
  postedDate: string;
  description?: string;
  image?: string;
}

export interface DonationRequestItem {
  id: string;
  donationName: string;
  donorName: string;
  requestDate: string;
  status: 'pending' | 'accepted';
  message: string;
}

export interface DonationPostItem {
  id: string;
  name: string;
  type: DonationType;
  status: DonationStatus;
  postedDate: string;
  requests: number;
}

export interface DonationPostForm {
  type: DonationType;
  name: string;
  brand: string;
  category: string;
  condition: DonationCondition;
  quantity: string;
  unit: string;
  location: string;
  expiryDate: string;
  requiresPrescription: boolean;
  description: string;
}

export interface DonationTabOption {
  id: DonationTab;
  label: string;
  icon: string;
}

export interface DonationCategoryOption {
  id: DonationCategory;
  label: string;
  count: number;
}

export interface DonationPostStepOption {
  id: DonationPostStep;
  label: string;
}
