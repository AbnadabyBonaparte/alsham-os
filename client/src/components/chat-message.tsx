import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import { Message } from "ai";
import { StatsCard } from "./dashboard/StatsCard";
import { ActivityGraph } from "./dashboard/ActivityGraph";
import { ActiveAgentsList } from "./dashboard/ActiveAgentsList";

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, x: isUser ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex gap-4 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <Avatar
                    className={`h-10 w-10 ${isUser ? "border-2 border-secondary" : "border-2 border-primary"
                        }`}
                >
                    <AvatarFallback
                        className={
                            isUser
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-gradient-primary text-white"
                        }
                    >
                        {isUser ? "U" : "T"}
                    </AvatarFallback>
                </Avatar>

                {!isUser && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5"
                    >
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </motion.div>
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"
                    }`}
            >
                {message.content && (
                    <div
                        className={`relative px-5 py-3.5 text-sm md:text-base ${isUser
                                ? "bg-white/10 backdrop-blur-md text-white rounded-2xl rounded-tr-sm border border-white/5"
                                : "bg-transparent text-foreground/90 font-mono tracking-wide"
                            }`}
                    >
                        <Streamdown>{message.content}</Streamdown>
                    </div>
                )}

                {/* Tool Invocations */}
                {message.toolInvocations?.map((toolInvocation) => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    if (state === "result") {
                        const { result } = toolInvocation;
                        return (
                            <motion.div
                                key={toolCallId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mt-3 w-full max-w-md"
                            >
                                {toolName === "getFinancialStats" && <StatsCard {...result} />}
                                {toolName === "getSalesStats" && <StatsCard {...result} />}
                                {toolName === "getSystemActivity" && <ActivityGraph />}
                                {toolName === "getAgentStatus" && <ActiveAgentsList />}
                            </motion.div>
                        );
                    }
                    return null;
                })}

                <span className="text-[10px] text-muted-foreground/60 mt-1 px-2">
                    {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                        : new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    }
                </span>
            </div>
        </motion.div>
    );
}
