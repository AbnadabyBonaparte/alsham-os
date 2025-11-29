import { useRef, useEffect, useState } from "react";
import { useAlshamAgent } from "../hooks/use-alsham-agent";
import { Send, Bot, Loader2 } from "lucide-react";
import { useSoundEngine } from "../hooks/useSoundEngine";

interface TaliaChatProps {
  messages: Array<{ role: string; content: string }>;
  onSendMessage: (message: string) => void;
  isTyping: boolean;
}

export function TaliaChat({ messages, onSendMessage, isTyping }: TaliaChatProps) {
  const { currentAgent } = useAlshamAgent();
  const [inputMessage, setInputMessage] = useState("");
  const { playClick } = useSoundEngine();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    playClick();
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-gray-950 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">

      {/* Cabeçalho do Agente */}
      <div className="flex items-center p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
          <Bot className="text-white w-6 h-6" />
        </div>
        <div className="ml-3">
          <h3 className="text-white font-bold text-lg">{currentAgent?.name || "Carregando..."}</h3>
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
            {currentAgent?.role || "Conectando..."}
          </p>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Conexão estabelecida com o ALSHAM OS.</p>
            <p className="text-sm">Pergunte algo ao especialista.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 px-4 shadow-md text-sm leading-relaxed ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-tr-none"
                : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700"
                }`}
            >
              <div className="font-bold text-[10px] mb-1 opacity-50 uppercase">
                {msg.role === "user" ? "Comandante" : currentAgent?.name}
              </div>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Indicador de Digitação */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 border border-gray-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-gray-400 text-xs animate-pulse">Processando...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input de Texto */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
        <input
          className="flex-1 bg-gray-950 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
          placeholder={`Mensagem para ${currentAgent?.name || "IA"}...`}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={isTyping || !inputMessage.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all shadow-lg shadow-blue-900/20"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}