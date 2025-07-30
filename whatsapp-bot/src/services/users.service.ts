import { supabase } from '../config/supabase';
import { WhatsAppUser } from '../types/shared.types';
import { logger } from '../utils/logger';

export class UsersService {
  async getOrCreateWhatsAppUser(phoneNumber: string): Promise<WhatsAppUser> {
    try {
      // Formatear número de teléfono
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Buscar usuario existente
      const { data: existingUser, error: searchError } = await supabase
        .from('whatsapp_users')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single();
      
      if (existingUser && !searchError) {
        logger.info(`Existing WhatsApp user found: ${formattedPhone}`);
        return existingUser;
      }
      
      // Si no existe, crear nuevo usuario
      const newUser = {
        phone_number: formattedPhone,
        user_id: null, // Por ahora no vinculamos con auth.users
        subscription_tier: 'free' as const,
        is_active: true,
        preferred_alert_time: '09:00:00',
        timezone: 'Europe/Madrid',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: createdUser, error: createError } = await supabase
        .from('whatsapp_users')
        .insert(newUser)
        .select()
        .single();
      
      if (createError) {
        logger.error('Error creating WhatsApp user:', createError);
        throw createError;
      }
      
      logger.info(`New WhatsApp user created: ${formattedPhone}`);
      return createdUser;
      
    } catch (error) {
      logger.error('Error in getOrCreateWhatsAppUser:', error);
      throw error;
    }
  }
  
  async getUserByPhone(phoneNumber: string): Promise<WhatsAppUser | null> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const { data, error } = await supabase
        .from('whatsapp_users')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        logger.error('Error getting user by phone:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      logger.error('Error in getUserByPhone:', error);
      return null;
    }
  }
  
  async updateUserActivity(userId: string): Promise<void> {
    try {
      await supabase
        .from('whatsapp_users')
        .update({ 
          updated_at: new Date().toISOString(),
          is_active: true 
        })
        .eq('id', userId);
    } catch (error) {
      logger.error('Error updating user activity:', error);
    }
  }
  
  async getUserStats(userId: string): Promise<any> {
    try {
      // Obtener estadísticas básicas del usuario
      const { data: user } = await supabase
        .from('whatsapp_users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!user) return null;
      
      return {
        phone_number: user.phone_number,
        subscription_tier: user.subscription_tier,
        created_at: user.created_at,
        is_active: user.is_active
      };
    } catch (error) {
      logger.error('Error getting user stats:', error);
      return null;
    }
  }
  
  private formatPhoneNumber(phoneNumber: string): string {
    // Remover espacios, guiones y caracteres especiales
    return phoneNumber.replace(/[\s\-\(\)\+]/g, '');
  }
}
