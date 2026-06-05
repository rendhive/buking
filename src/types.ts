/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OdooFile {
  path: string;
  filename: string;
  language: 'python' | 'xml' | 'csv';
  description: string;
  content: string;
}

export interface Asset {
  id: number;
  name: string;
  code: string;
  category: 'room' | 'vehicle' | 'equipment' | 'other';
  description: string;
  active: boolean;
  image_url?: string;
}

export interface Booking {
  id: number;
  asset_id: number;
  asset_name: string;
  borrower_name: string;
  whatsapp_number: string;
  start_datetime: string; // ISO string or datetime string YYYY-MM-DD HH:MM:SS
  end_datetime: string;   // ISO string or datetime string YYYY-MM-DD HH:MM:SS
  purpose: string;
  state: 'draft' | 'confirmed' | 'cancelled';
}

export interface OrmLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}
