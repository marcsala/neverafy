// =================================
// Dashboard Utils Tests
// =================================

import { describe, it, expect } from 'vitest';
import {
  convertSupabaseProduct,
  getExpiryBadge,
  getUrgentProducts,
  calculateDashboardStats,
  validateProductForm,
  calculateDaysLeft
} from '../utils';
import type { Product, SupabaseProduct } from '../types';

describe('Dashboard Utils', () => {
  describe('convertSupabaseProduct', () => {
    it('should convert Supabase product correctly', () => {
      const supabaseProduct: SupabaseProduct = {
        id: '1',
        name: 'Test Product',
        category: 'test',
        expiry_date: '2025-08-01',
        quantity: '2 units',
        source: 'manual',
        user_id: 'user123',
        created_at: '2025-07-29T00:00:00Z',
        updated_at: '2025-07-29T00:00:00Z'
      };

      const result = convertSupabaseProduct(supabaseProduct);

      expect(result).toEqual({
        id: 1,
        name: 'Test Product',
        quantity: '2 units',
        expiryDate: '2025-08-01',
        daysLeft: expect.any(Number)
      });
    });
  });

  describe('getExpiryBadge', () => {
    it('should return urgent badge for products expiring today', () => {
      const badge = getExpiryBadge(0);
      expect(badge).toEqual({ class: 'urgent', text: 'Hoy' });
    });

    it('should return urgent badge for products expiring tomorrow', () => {
      const badge = getExpiryBadge(1);
      expect(badge).toEqual({ class: 'urgent', text: 'Mañana' });
    });

    it('should return warning badge for products expiring soon', () => {
      const badge = getExpiryBadge(3);
      expect(badge).toEqual({ class: 'warning', text: 'Pronto' });
    });

    it('should return safe badge for fresh products', () => {
      const badge = getExpiryBadge(7);
      expect(badge).toEqual({ class: 'safe', text: 'Fresco' });
    });
  });

  describe('getUrgentProducts', () => {
    it('should filter urgent products correctly', () => {
      const products: Product[] = [
        { id: 1, name: 'Urgent 1', quantity: '1', expiryDate: '2025-07-29', daysLeft: 0 },
        { id: 2, name: 'Urgent 2', quantity: '1', expiryDate: '2025-07-30', daysLeft: 1 },
        { id: 3, name: 'Safe', quantity: '1', expiryDate: '2025-08-05', daysLeft: 7 }
      ];

      const urgent = getUrgentProducts(products);
      expect(urgent).toHaveLength(2);
      expect(urgent.map(p => p.name)).toEqual(['Urgent 1', 'Urgent 2']);
    });
  });

  describe('calculateDashboardStats', () => {
    it('should calculate stats correctly', () => {
      const products: Product[] = [
        { id: 1, name: 'Product 1', quantity: '1', expiryDate: '2025-07-29', daysLeft: 0 },
        { id: 2, name: 'Product 2', quantity: '1', expiryDate: '2025-07-30', daysLeft: 1 },
        { id: 3, name: 'Product 3', quantity: '1', expiryDate: '2025-08-05', daysLeft: 7 }
      ];

      const stats = calculateDashboardStats(products);
      
      expect(stats.totalProducts).toBe(3);
      expect(stats.expiringSoon).toBe(2); // Products with daysLeft < 4
    });
  });

  describe('validateProductForm', () => {
    it('should validate correct form data', () => {
      const data = {
        name: 'Test Product',
        expiryDate: '2025-08-01',
        quantity: '2 units'
      };

      const errors = validateProductForm(data);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for missing name', () => {
      const data = {
        name: '',
        expiryDate: '2025-08-01',
        quantity: '2 units'
      };

      const errors = validateProductForm(data);
      expect(errors).toContain('El nombre del producto es requerido');
    });

    it('should return errors for missing expiry date', () => {
      const data = {
        name: 'Test Product',
        expiryDate: '',
        quantity: '2 units'
      };

      const errors = validateProductForm(data);
      expect(errors).toContain('La fecha de caducidad es requerida');
    });

    it('should return errors for past expiry date', () => {
      const data = {
        name: 'Test Product',
        expiryDate: '2020-01-01',
        quantity: '2 units'
      };

      const errors = validateProductForm(data);
      expect(errors).toContain('La fecha de caducidad debe ser futura');
    });
  });

  describe('calculateDaysLeft', () => {
    it('should calculate days left correctly', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split('T')[0];

      const daysLeft = calculateDaysLeft(tomorrowString);
      expect(daysLeft).toBe(1);
    });
  });
});
