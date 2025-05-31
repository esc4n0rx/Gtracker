// contexts/realtime-context.tsx
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket }
from 'socket.io-client'; //
import { useAuth } from './auth-context'; //
import { getStoredToken, messagesApi, notificationsApi } from '@/lib/api'; //
import {
  chatService,
  NewPrivateMessagePayload, //
  // Adicionar tipo para payload de new_notification se definido em chat.ts ou notifications.json
} from '@/lib/chat'; //
import { useToast } from '@/components/ui/toast'; //

// Payload para new_notification do WebSocket (baseado em notifications.json)
interface NewNotificationPayload { //
  id: string;
  type: string;
  title: string;
  message: string;
  action_url: string | null;
  created_at: string; // ISO_DATE
  // metadata?: any; // Se o backend enviar
}

interface LevelUpNotificationPayload {
 type: 'level_up'
 title: string
 message: string
 data: {
   old_level: number
   new_level: number
   old_xp: number
   new_xp: number
   xp_gained: number
   level_up: boolean
   level_progress: {
     current_level: number
     level_name: string
     xp_to_next: number
     percentage: number
   }
 }
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
  const { user, isAuthenticated, isLoading: authLoading } = useAuth(); //
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const { info, error: showErrorToast } = useToast(); //
  const handleLevelUpNotification = useCallback((payload: LevelUpNotificationPayload) => {
 console.log("RealtimeProvider: Usuário subiu de nível!", payload);
 
  // Mostrar notificação especial para level up
  info(
    `${payload.title} - ${payload.message}`
  );
  
  // Atualizar contagem se necessário (o level up pode vir junto com outras notificações)
  setUnreadNotificationsCount(prev => prev + 1);
  }, [info]);

  const fetchInitialCounts = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const msgResponse = await messagesApi.getUnreadCount(); //
        if (msgResponse.success && msgResponse.data) {
          setUnreadMessagesCount(msgResponse.data.unread_count);
        }
      } catch (err) {
        console.error("RealtimeContext: Erro ao buscar contagem de mensagens:", err);
      }
      try {
        const notifResponse = await notificationsApi.getUnreadCount(); //
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
      const token = getStoredToken(); //
      if (token) {
        console.log("RealtimeProvider: Tentando conectar WebSocket...");
        const newSocket = chatService.connect(token, {
          connect: () => {
            setIsConnected(true);
            setSocketInstance(newSocket); // Armazena a instância do socket
            console.log("RealtimeProvider: WebSocket Conectado.");
            fetchInitialCounts(); // Busca contagens iniciais após conectar
          },
          disconnect: (reason) => {
            setIsConnected(false);
            // setSocketInstance(null); // Não anular aqui para permitir reconexão automática pelo socket.io
            console.log("RealtimeProvider: WebSocket Desconectado -", reason);
          },
          error: (err) => { // Erros de transporte/conexão do socket.io
            setIsConnected(false);
            // setSocketInstance(null);
            console.error("RealtimeProvider: WebSocket Erro de Conexão -", err.message);
            // showErrorToast("Erro de Chat", `Não foi possível conectar: ${err.message}`);
          },
          server_error: (data) => { // Erros emitidos pelo servidor via evento 'error'
             console.error("RealtimeProvider: Erro do servidor de chat -", data.message);
             showErrorToast("Erro no Servidor de Chat", data.message);
          },
          new_private_message: (message: NewPrivateMessagePayload) => { //
            console.log("RealtimeProvider: Nova mensagem privada recebida", message);
            // Só incrementa se a mensagem não for do próprio usuário (o backend pode já tratar isso)
            if (message.sender.id !== user.id) {
              setUnreadMessagesCount(prev => prev + 1);
              // Aqui você poderia também disparar um toast/som de notificação
              info("Nova Mensagem Privada", `De: ${message.sender.nickname}`);
            }
          },
          new_notification: (notification: NewNotificationPayload) => { //
            console.log("RealtimeProvider: Nova notificação geral recebida", notification);
            setUnreadNotificationsCount(prev => prev + 1);
            // Disparar toast/som
            info(notification.title, notification.message);
          },
          // Outros listeners globais podem ser adicionados aqui, como 'user_status_changed'
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

    // A função de limpeza do useEffect principal do Provider só deve desconectar se o Provider for desmontado
    // A desconexão por logout é tratada acima.
    // return () => {
    //   if (socketInstance) { // Apenas se o provider for desmontado com um socket ativo
    //     console.log("RealtimeProvider: Desmontando, desconectando WebSocket.");
    //     chatService.disconnect();
    //     setSocketInstance(null);
    //     setIsConnected(false);
    //   }
    // };
  }, [isAuthenticated, user, socketInstance, authLoading, fetchInitialCounts, info, showErrorToast]);


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