// contexts/realtime-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { getStoredToken, messagesApi, notificationsApi } from '@/lib/api';
import {
  chatService,
  NewPrivateMessagePayload,
  LevelUpNotificationPayload,
} from '@/lib/chat';
import { useToast } from '@/components/ui/toast';

// Payload para new_notification do WebSocket (baseado em notifications.json)
interface NewNotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  created_at: string; // ISO_DATE
}

interface RealtimeContextType {
  socket: Socket | null;
  isConnected: boolean;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  decrementMessageCount: (count?: number) => void;
  decrementNotificationCount: (count?: number) => void;
  fetchInitialCounts: () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const { info, error: showErrorToast, success } = useToast();

  const handleLevelUpNotification = useCallback((payload: LevelUpNotificationPayload) => {
    console.log("RealtimeProvider: Usuário subiu de nível!", payload);
    
    // Mostrar notificação especial para level up
    success(
      `🎉 ${payload.title}`,
      `${payload.message} - Você agora é ${payload.data.level_progress.level_name}!`
    );
    
    // Atualizar contagem de notificações
    setUnreadNotificationsCount(prev => prev + 1);
  }, [success]);

  const fetchInitialCounts = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const msgResponse = await messagesApi.getUnreadCount();
        if (msgResponse.success && msgResponse.data) {
          setUnreadMessagesCount(msgResponse.data.unread_count);
        }
      } catch (err) {
        console.error("RealtimeContext: Erro ao buscar contagem de mensagens:", err);
      }
      try {
        const notifResponse = await notificationsApi.getUnreadCount();
        if (notifResponse.success && notifResponse.data) {
          setUnreadNotificationsCount(notifResponse.data.unread_count);
        }
      } catch (err) {
        console.error("RealtimeContext: Erro ao buscar contagem de notificações:", err);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user && !socketInstance && !authLoading) {
      const token = getStoredToken();
      if (token) {
        console.log("RealtimeProvider: Tentando conectar WebSocket...");
        const newSocket = chatService.connect(token, {
          connect: () => {
            setIsConnected(true);
            setSocketInstance(newSocket);
            console.log("RealtimeProvider: WebSocket Conectado.");
            fetchInitialCounts();
          },
          disconnect: (reason) => {
            setIsConnected(false);
            console.log("RealtimeProvider: WebSocket Desconectado -", reason);
          },
          error: (err) => {
            setIsConnected(false);
            console.error("RealtimeProvider: WebSocket Erro de Conexão -", err.message);
          },
          server_error: (data) => {
             console.error("RealtimeProvider: Erro do servidor de chat -", data.message);
             showErrorToast("Erro no Servidor de Chat", data.message);
          },
          new_private_message: (message: NewPrivateMessagePayload) => {
            console.log("RealtimeProvider: Nova mensagem privada recebida", message);
            if (message.sender.id !== user.id) {
              setUnreadMessagesCount(prev => prev + 1);
              info("Nova Mensagem Privada", `De: ${message.sender.nickname}`);
            }
          },
          new_notification: (notification: NewNotificationPayload) => {
            console.log("RealtimeProvider: Nova notificação geral recebida", notification);
            setUnreadNotificationsCount(prev => prev + 1);
            info(notification.title, notification.message);
          },
          level_up_notification: handleLevelUpNotification,
        });
        
        if (!newSocket) {
            console.error("RealtimeProvider: Falha ao iniciar conexão com chatService.");
        }
      }
    } else if (!isAuthenticated && socketInstance) {
      console.log("RealtimeProvider: Usuário deslogado, desconectando WebSocket.");
      chatService.disconnect();
      setSocketInstance(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, user, socketInstance, authLoading, fetchInitialCounts, info, showErrorToast, handleLevelUpNotification]);

  const decrementMessageCount = (count = 1) => {
    setUnreadMessagesCount(prev => Math.max(0, prev - count));
  };
  
  const decrementNotificationCount = (count = 1) => {
    setUnreadNotificationsCount(prev => Math.max(0, prev - count));
  };

  return (
    <RealtimeContext.Provider value={{ 
        socket: socketInstance, 
        isConnected, 
        unreadMessagesCount, 
        unreadNotificationsCount,
        decrementMessageCount,
        decrementNotificationCount,
        fetchInitialCounts
    }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime deve ser usado dentro de um RealtimeProvider');
  }
  return context;
}