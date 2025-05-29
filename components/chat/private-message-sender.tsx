// components/chat/private-message-sender.tsx
"use client";

import { useState, useEffect } from "react";
import { User, Send, Loader2, AlertCircle } from "lucide-react";
import { privateChatApi, User as ApiUser } from "@/lib/api"; //
import { RetroButton } from "@/components/ui/retro-button"; //
import { useAuth } from "@/contexts/auth-context"; //
import { useToast } from "@/components/ui/toast"; //
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; //

interface PrivateMessageSenderProps {
  className?: string;
  onMessageSent?: (recipientId: string) => void; // Callback para talvez atualizar a UI principal
}

export function PrivateMessageSender({ className, onMessageSent }: PrivateMessageSenderProps) {
  const { user: currentUser } = useAuth(); //
  const { success, error: showError } = useToast(); //

  const [users, setUsers] = useState<ApiUser[]>([]); //
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [messageContent, setMessageContent] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setFetchError(null);
      try {
        const response = await privateChatApi.getUsers();
        if (response.success && response.data) {
          // Filtrar o usuário atual da lista de destinatários
          setUsers(response.data.filter(u => u.id !== currentUser?.id) || []);
        } else {
          setFetchError(response.message || "Falha ao carregar usuários.");
        }
      } catch (err: any) {
        setFetchError(err.message || "Erro ao buscar usuários para chat privado.");
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (currentUser) {
        fetchUsers();
    }
  }, [currentUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !messageContent.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await privateChatApi.sendMessage(selectedUserId, messageContent.trim());
      if (response.success) {
        success("Mensagem Privada Enviada!", `Para: ${users.find(u => u.id === selectedUserId)?.nickname || 'Usuário'}`);
        setMessageContent("");
        // setSelectedUserId(""); // Descomente se quiser resetar o usuário selecionado após o envio
        onMessageSent?.(selectedUserId);
      } else {
        showError("Erro ao Enviar", response.message || "Não foi possível enviar a mensagem privada.");
      }
    } catch (err: any) {
      showError("Erro ao Enviar", err.message || "Ocorreu um problema ao enviar a mensagem.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`retro-panel p-6 ${className}`}>
      <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-retro-blue" />
        Enviar Mensagem Privada
      </h3>

      {fetchError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {fetchError}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="space-y-4">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-retro-text mb-1">
            Para:
          </label>
          {isLoadingUsers ? (
            <div className="flex items-center text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Carregando usuários...
            </div>
          ) : (
            <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={isSending}>
              <SelectTrigger className="retro-input w-full" id="recipient">
                <SelectValue placeholder="Selecione um usuário..." />
              </SelectTrigger>
              <SelectContent className="retro-panel border-slate-600 bg-slate-800 text-retro-text">
                {users.length > 0 ? (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="hover:bg-slate-700 focus:bg-slate-700">
                      {user.nickname} ({user.nome})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-slate-400 text-sm">Nenhum usuário encontrado.</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <label htmlFor="private-message" className="block text-sm font-medium text-retro-text mb-1">
            Mensagem:
          </label>
          <textarea
            id="private-message"
            className="retro-input w-full h-28 resize-none"
            placeholder="Digite sua mensagem privada aqui..."
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            maxLength={5000} // Conforme chat.json
            disabled={isSending || isLoadingUsers}
          />
          <div className="text-xs text-slate-500 mt-1 text-right">
            {messageContent.length}/5000 caracteres
          </div>
        </div>

        <RetroButton type="submit" className="w-full" disabled={!selectedUserId || !messageContent.trim() || isSending || isLoadingUsers}>
          {isSending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" /> Enviar Mensagem
            </>
          )}
        </RetroButton>
      </form>
    </div>
  );
}