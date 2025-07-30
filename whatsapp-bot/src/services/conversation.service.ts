import { supabase } from '../config/supabase';
import { ConversationContext, WhatsAppUser } from '../types/shared.types';
import { logger } from '../utils/logger';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: any;
}

export class ConversationService {
  async getContext(userId: string): Promise<ConversationContext | null> {
    try {
      const { data, error } = await supabase
        .from('conversation_context')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        logger.error('Error getting conversation context:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      logger.error('Error in getContext:', error);
      return null;
    }
  }
  
  async setContext(userId: string, contextData: Partial<ConversationContext>): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      
      // Limpiar contextos anteriores
      await this.clearExpiredContexts(userId);
      
      const newContext = {
        user_id: userId,
        last_intent: contextData.last_intent || null,
        pending_action: contextData.pending_action || null,
        context_data: contextData.context_data || {},
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      };
      
      await supabase
        .from('conversation_context')
        .insert(newContext);
        
      logger.info('Context set successfully for user:', userId);
    } catch (error) {
      logger.error('Error setting context:', error);
    }
  }
  
  async updateContext(userId: string, updates: Partial<ConversationContext>): Promise<void> {
    try {
      const context = await this.getContext(userId);
      if (!context) {
        await this.setContext(userId, updates);
        return;
      }
      
      const updatedData = {
        ...context.context_data,
        ...updates.context_data
      };
      
      await supabase
        .from('conversation_context')
        .update({
          last_intent: updates.last_intent || context.last_intent,
          pending_action: updates.pending_action || context.pending_action,
          context_data: updatedData,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        })
        .eq('id', context.id);
        
    } catch (error) {
      logger.error('Error updating context:', error);
    }
  }
  
  async clearContext(userId: string): Promise<void> {
    try {
      await supabase
        .from('conversation_context')
        .delete()
        .eq('user_id', userId);
        
      logger.info('Context cleared for user:', userId);
    } catch (error) {
      logger.error('Error clearing context:', error);
    }
  }
  
  async saveMessage(userId: string, role: 'user' | 'assistant', content: string, intent?: string): Promise<void> {
    try {
      // Guardar en tabla de historial de mensajes
      await supabase
        .from('conversation_history')
        .insert({
          user_id: userId,
          role,
          content,
          intent,
          timestamp: new Date().toISOString()
        });
        
      // Limpiar mensajes antiguos (mantener solo últimos 50)
      await this.cleanOldMessages(userId);
    } catch (error) {
      logger.error('Error saving message:', error);
    }
  }
  
  async getRecentHistory(userId: string, limit: number = 10): Promise<ConversationMessage[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_history')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) {
        logger.error('Error getting conversation history:', error);
        return [];
      }
      
      return (data || []).reverse().map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        intent: msg.intent
      }));
    } catch (error) {
      logger.error('Error in getRecentHistory:', error);
      return [];
    }
  }
  
  private async clearExpiredContexts(userId: string): Promise<void> {
    try {
      await supabase
        .from('conversation_context')
        .delete()
        .eq('user_id', userId)
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      logger.error('Error clearing expired contexts:', error);
    }
  }
  
  private async cleanOldMessages(userId: string): Promise<void> {
    try {
      // Mantener solo los últimos 50 mensajes por usuario
      const { data: oldMessages } = await supabase
        .from('conversation_history')
        .select('id')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .range(50, 1000);
      
      if (oldMessages && oldMessages.length > 0) {
        const idsToDelete = oldMessages.map(msg => msg.id);
        await supabase
          .from('conversation_history')
          .delete()
          .in('id', idsToDelete);
      }
    } catch (error) {
      logger.error('Error cleaning old messages:', error);
    }
  }
}
