// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Usar variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tbactydpgltluljssvym.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYWN0eWRwZ2x0bHVsanNzdnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NTQ0NDksImV4cCI6MjA2ODUzMDQ0OX0.q7VssmjbSLSiOXDZaXjVPrzrGCW1C8JIWQk0LZ8su7k'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos para TypeScript
export interface Product {
  id?: string;
  user_id: string;
  name: string;
  category: string;
  expiry_date: string;
  quantity: number;
  price?: number;
  source: string;
  created_at?: string;
}

export interface UserStats {
  id?: string;
  user_id: string;
  total_saved: number;
  co2_saved: number;
  points: number;
  streak: number;
  level: number;
  ocr_used: number;
  recipes_generated: number;
  updated_at?: string;
}

// Funciones para manejar productos
export const saveProductToSupabase = async (product: Omit<Product, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error saving product:', error)
    throw error
  }
}

export const getUserProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) throw error
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Funciones para estadísticas de usuario
export const getUserStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

export const updateUserStats = async (userId: string, stats: Partial<UserStats>) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .upsert([
        {
          user_id: userId,
          ...stats,
          updated_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) throw error
    return data?.[0]
  } catch (error) {
    console.error('Error updating stats:', error)
    throw error
  }
}

// Función para inicializar las estadísticas de un nuevo usuario
export const initializeUserStats = async (userId: string) => {
  const defaultStats: Omit<UserStats, 'id' | 'updated_at'> = {
    user_id: userId,
    total_saved: 0,
    co2_saved: 0,
    points: 0,
    streak: 0,
    level: 1,
    ocr_used: 0,
    recipes_generated: 0
  }
  
  return updateUserStats(userId, defaultStats)
}

// Función para autenticación
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Hook para escuchar cambios de autenticación
export const onAuthStateChange = (callback: (session: any) => void) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}