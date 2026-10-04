import { api } from './client';
import type {
  Address,
  Book,
  BorrowRequest,
  CreateBookRequest,
  Fulfillment,
  Loan,
  UserProfile,
} from '../types';

export const authApi = {
  register: (data: { email: string; password: string; displayName: string }) =>
    api.post<UserProfile>('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ accessToken: string; expiresIn: number }>('/api/auth/login', data),
  me: () => api.get<UserProfile>('/api/auth/me'),
  updateMe: (data: { displayName?: string; phone?: string }) =>
    api.put<UserProfile>('/api/auth/me', data),
  addresses: () => api.get<Address[]>('/api/auth/addresses'),
  createAddress: (data: Partial<Address>) => api.post<Address>('/api/auth/addresses', data),
  updateAddress: (id: string, data: Partial<Address>) =>
    api.put<Address>(`/api/auth/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/api/auth/addresses/${id}`),
};

export const booksApi = {
  browse: (params?: { title?: string; author?: string; postalCode?: string }) =>
    api.get<Book[]>('/api/books', { params }),
  get: (id: string) => api.get<Book>(`/api/books/${id}`),
  mine: () => api.get<Book[]>('/api/books/mine'),
  create: (data: CreateBookRequest) => api.post<Book>('/api/books', data),
  update: (id: string, data: CreateBookRequest) => api.put<Book>(`/api/books/${id}`, data),
  remove: (id: string) => api.delete(`/api/books/${id}`),
};

export const borrowsApi = {
  createRequest: (data: { bookId: string; message?: string }) =>
    api.post<BorrowRequest>('/api/borrows/requests', data),
  incoming: () => api.get<BorrowRequest[]>('/api/borrows/requests/incoming'),
  outgoing: () => api.get<BorrowRequest[]>('/api/borrows/requests/outgoing'),
  approve: (id: string) => api.post<Loan>(`/api/borrows/requests/${id}/approve`),
  reject: (id: string) => api.post<BorrowRequest>(`/api/borrows/requests/${id}/reject`),
  cancel: (id: string) => api.post<BorrowRequest>(`/api/borrows/requests/${id}/cancel`),
  loans: () => api.get<Loan[]>('/api/borrows/loans'),
  returnLoan: (id: string) => api.post<Loan>(`/api/borrows/loans/${id}/return`),
};

export const fulfillmentApi = {
  getByLoan: (loanId: string) => api.get<Fulfillment>(`/api/fulfillment/loan/${loanId}`),
  create: (data: { loanId: string; type: 'MEETUP' | 'MAIL' }) =>
    api.post<Fulfillment>('/api/fulfillment', data),
  updateMeetup: (id: string, data: Record<string, unknown>) =>
    api.put<Fulfillment>(`/api/fulfillment/${id}/meetup`, data),
  updateShipment: (id: string, data: Record<string, unknown>) =>
    api.put<Fulfillment>(`/api/fulfillment/${id}/shipment`, data),
  patchStatus: (id: string, status: string) =>
    api.patch<Fulfillment>(`/api/fulfillment/${id}/status`, { status }),
};
