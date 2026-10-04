import type { BookFormData, CreateBookRequest } from '../types';

export const emptyBookForm: BookFormData = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  condition: 'GOOD',
  coverImageUrl: '',
};

export function toBookPayload(form: BookFormData): CreateBookRequest {
  const payload: CreateBookRequest = {
    title: form.title.trim(),
    condition: form.condition,
  };
  const author = form.author.trim();
  const isbn = form.isbn.trim();
  const description = form.description.trim();
  const coverImageUrl = form.coverImageUrl.trim();
  if (author) payload.author = author;
  if (isbn) payload.isbn = isbn;
  if (description) payload.description = description;
  if (coverImageUrl) payload.coverImageUrl = coverImageUrl;
  return payload;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { detail?: string } } }).response;
    if (response?.data?.detail) return response.data.detail;
  }
  return fallback;
}
