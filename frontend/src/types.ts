export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface Book {
  id: string;
  ownerId: string;
  ownerDisplayName?: string;
  ownerPostalCode?: string;
  title: string;
  author?: string;
  isbn?: string;
  description?: string;
  condition: string;
  coverImageUrl?: string;
  status: 'AVAILABLE' | 'BORROWED' | 'UNLISTED';
  createdAt: string;
  updatedAt: string;
}

/** Fields sent when creating or updating a book listing. */
export interface CreateBookRequest {
  title: string;
  author?: string;
  isbn?: string;
  description?: string;
  condition?: string;
  coverImageUrl?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  condition: string;
  coverImageUrl: string;
}

export interface BorrowRequest {
  id: string;
  bookId: string;
  borrowerId: string;
  lenderId: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  borrowRequestId: string;
  bookId: string;
  borrowerId: string;
  lenderId: string;
  status: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
}

export interface Fulfillment {
  id: string;
  loanId: string;
  type?: 'MEETUP' | 'MAIL';
  status: string;
  createdAt: string;
  meetup?: {
    proposedLocation?: string;
    proposedAt?: string;
    confirmedAt?: string;
    notes?: string;
  };
  shipment?: {
    shipFromAddressId?: string;
    shipToAddressId?: string;
    carrier?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
}
