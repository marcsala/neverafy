// =================================
// Dashboard Components Tests
// =================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UrgentAlerts, ProductsList, MainActionButtons } from '../components';
import type { Product } from '../types';

describe('Dashboard Components', () => {
  const mockProducts: Product[] = [
    { id: 1, name: 'Urgent Product', quantity: '1 unit', expiryDate: '2025-07-29', daysLeft: 0 },
    { id: 2, name: 'Normal Product', quantity: '2 units', expiryDate: '2025-08-05', daysLeft: 7 }
  ];

  const urgentProducts = mockProducts.filter(p => p.daysLeft < 2);

  describe('UrgentAlerts', () => {
    it('should render urgent products', () => {
      const mockOnViewRecipes = vi.fn();
      
      render(
        <UrgentAlerts
          urgentProducts={urgentProducts}
          onViewRecipes={mockOnViewRecipes}
        />
      );

      expect(screen.getByText(/Urgent Product/)).toBeInTheDocument();
      expect(screen.getByText(/caduca hoy/)).toBeInTheDocument();
    });

    it('should call onViewRecipes when button is clicked', () => {
      const mockOnViewRecipes = vi.fn();
      
      render(
        <UrgentAlerts
          urgentProducts={urgentProducts}
          onViewRecipes={mockOnViewRecipes}
        />
      );

      fireEvent.click(screen.getByText(/Ver recetas/));
      expect(mockOnViewRecipes).toHaveBeenCalled();
    });

    it('should not render when no urgent products', () => {
      const mockOnViewRecipes = vi.fn();
      
      const { container } = render(
        <UrgentAlerts
          urgentProducts={[]}
          onViewRecipes={mockOnViewRecipes}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('ProductsList', () => {
    it('should render products list', () => {
      render(
        <ProductsList
          products={mockProducts}
          maxVisible={10}
        />
      );

      expect(screen.getByText('Mi nevera')).toBeInTheDocument();
      expect(screen.getByText('Urgent Product')).toBeInTheDocument();
      expect(screen.getByText('Normal Product')).toBeInTheDocument();
    });

    it('should show empty state when no products', () => {
      render(
        <ProductsList
          products={[]}
        />
      );

      expect(screen.getByText('Tu nevera está vacía')).toBeInTheDocument();
    });

    it('should limit visible products', () => {
      render(
        <ProductsList
          products={mockProducts}
          maxVisible={1}
        />
      );

      expect(screen.getByText('Urgent Product')).toBeInTheDocument();
      expect(screen.queryByText('Normal Product')).not.toBeInTheDocument();
      expect(screen.getByText(/Y 1 productos más/)).toBeInTheDocument();
    });
  });

  describe('MainActionButtons', () => {
    it('should render action buttons', () => {
      const mockOnAddProduct = vi.fn();
      const mockOnGenerateRecipes = vi.fn();
      
      render(
        <MainActionButtons
          onAddProduct={mockOnAddProduct}
          onGenerateRecipes={mockOnGenerateRecipes}
        />
      );

      expect(screen.getByText('Añadir producto')).toBeInTheDocument();
      expect(screen.getByText(/Generar Recetas IA/)).toBeInTheDocument();
    });

    it('should call callbacks when buttons are clicked', () => {
      const mockOnAddProduct = vi.fn();
      const mockOnGenerateRecipes = vi.fn();
      
      render(
        <MainActionButtons
          onAddProduct={mockOnAddProduct}
          onGenerateRecipes={mockOnGenerateRecipes}
        />
      );

      fireEvent.click(screen.getByText('Añadir producto'));
      expect(mockOnAddProduct).toHaveBeenCalled();

      fireEvent.click(screen.getByText(/Generar Recetas IA/));
      expect(mockOnGenerateRecipes).toHaveBeenCalled();
    });

    it('should show recipes count when provided', () => {
      const mockOnAddProduct = vi.fn();
      const mockOnGenerateRecipes = vi.fn();
      
      render(
        <MainActionButtons
          onAddProduct={mockOnAddProduct}
          onGenerateRecipes={mockOnGenerateRecipes}
          showRecipesCount={5}
        />
      );

      expect(screen.getByText(/5 ingredientes/)).toBeInTheDocument();
    });
  });
});
