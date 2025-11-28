import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export interface Message {
  id: string | number;
  role: "user" | "assistant";
  content: string;
  createdAt: string | Date;
}

export function useAlshamAgent() {
  // Estado Local
  const [selectedAgentId, setSelectedAgentId] = useState<string>("talia-x-1");
  const [inputMessage, setInputMessage] = useState("");

  // 1. Buscar Lista de Agentes (Do Supabase)
  const { data: agentsList, isLoading: isLoadingAgents } = trpc.agents.list.useQuery();

  // 2. Buscar Dados do Agente Selecionado
  const { data: currentAgent } = trpc.agents.getById.useQuery(
    { id: selectedAgentId },
    { enabled: !!selectedAgentId }
  );

  // 3. Buscar Histórico de Conversa
  const { data: history, refetch: refetchHistory } = trpc.chat.getHistory.useQuery(
    { agentId: selectedAgentId },
    { enabled: !!selectedAgentId }
  );

  // Mutation para Enviar Mensagem
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: async () => {
      setInputMessage("");
      await refetchHistory();
    },
    onError: (error) => {
      toast.error("Erro na conexão neural: " + error.message);
    },
  });

  // Handler de Envio
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !selectedAgentId) return;

    sendMessageMutation.mutate({
      message: content,
      agentId: selectedAgentId,
    });
  }, [selectedAgentId, sendMessageMutation]);

  // Formatar mensagens para UI
  const messages: Message[] = history?.map(msg => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    createdAt: msg.createdAt || new Date(),
  })) || [];

  return {
    // Dados
    agents: agentsList || [],
    currentAgent: currentAgent || {
      name: "Carregando...",
      role: "Sistema",
      version: "X.0",
      rarity: "Common",
      cluster: "Geral",
    },
    messages,

    // Estados
    selectedAgentId,
    isTyping: sendMessageMutation.isPending,
    isLoadingAgents,
    hasMessages: messages.length > 0,

    // Ações
    setAgentId: setSelectedAgentId,
    sendMessage,
    setInputMessage,
    inputMessage,
    currentAgentId: selectedAgentId,
  };
}