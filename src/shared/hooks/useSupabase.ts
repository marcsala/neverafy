// shared/hooks/useSupabase.ts

import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import type { User, Session } from '@supabase/supabase-js';

/**
 * Hook para manejar autenticación con Supabase
 */
export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user
  };
};

/**
 * Hook para operaciones CRUD de productos con Supabase
 */
export const useSupabaseProducts = (userId: string | undefined) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos del usuario
  const fetchProducts = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto
  const addProduct = async (product: any) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          user_id: userId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setProducts(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // Eliminar producto
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Marcar como consumido
  const markAsConsumed = async (product: any, wasConsumed: boolean = true) => {
    if (!userId) return;
    
    try {
      // Mover a tabla consumed_products
      const { error: consumedError } = await supabase
        .from('consumed_products')
        .insert([{
          user_id: userId,
          original_product_id: product.id,
          name: product.name,
          category: product.category,
          expiry_date: product.expiry_date,
          consumed_date: new Date().toISOString().split('T')[0],
          was_consumed: wasConsumed,
          price: product.price || 0
        }]);
      
      if (consumedError) throw consumedError;
      
      // Eliminar de productos activos
      await deleteProduct(product.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userId]);

  return {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    markAsConsumed,
    refetch: fetchProducts
  };
};

/**
 * Hook para estadísticas de usuario con Supabase
 */
export const useSupabaseUserStats = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas
  const fetchUserStats = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      setUserStats(data || {
        user_id: userId,
        points: 0,
        level: 1,
        streak: 0,
        total_saved: 0,
        co2_saved: 0,
        ocr_used: 0,
        recipes_generated: 0
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estadísticas
  const updateUserStats = async (newStats: Partial<any>) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .upsert([{
          user_id: userId,
          ...userStats,
          ...newStats,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      setUserStats(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  return {
    userStats,
    loading,
    error,
    updateUserStats,
    refetch: fetchUserStats
  };
};
