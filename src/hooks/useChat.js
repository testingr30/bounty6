import { useState, useCallback, useRef } from "react";
import { sendFirstMessage, sendFollowUpMessage } from "../utils/api";

const HISTORY_KEY = "toolhouse-chat-history";

export function useChat(agent) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const runIdRef = useRef(null);

    const saveToHistory = useCallback(
        (msgs) => {
            if (!agent || msgs.length === 0) return;
            try {
                const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
                const existingIndex = history.findIndex(
                    (h) =>
                        h.agentId === agent.id &&
                        h.runId === runIdRef.current
                );

                const entry = {
                    id: existingIndex >= 0 ? history[existingIndex].id : Date.now().toString(),
                    agentId: agent.id,
                    agentName: agent.name,
                    agentColor: agent.color,
                    agentIcon: agent.icon,
                    runId: runIdRef.current,
                    messages: msgs,
                    preview: msgs[0]?.content?.slice(0, 80) || "",
                    timestamp: new Date().toISOString(),
                };

                if (existingIndex >= 0) {
                    history[existingIndex] = entry;
                } else {
                    history.unshift(entry);
                }

                // Keep max 50 conversations
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
            } catch (e) {
                console.error("Failed to save history:", e);
            }
        },
        [agent]
    );

    const sendMessage = useCallback(
        async (content) => {
            if (!agent || !content.trim() || isLoading) return;

            const userMessage = { role: "user", content: content.trim() };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setIsLoading(true);

            // Add placeholder for assistant
            const assistantMessage = { role: "assistant", content: "" };
            setMessages([...newMessages, assistantMessage]);

            try {
                const onChunk = (text) => {
                    setMessages((prev) => {
                        const updated = [...prev];
                        updated[updated.length - 1] = { role: "assistant", content: text };
                        return updated;
                    });
                };

                let result;
                if (!runIdRef.current) {
                    result = await sendFirstMessage(agent.endpoint, content.trim(), onChunk);
                    runIdRef.current = result.runId;
                } else {
                    result = await sendFollowUpMessage(
                        agent.endpoint,
                        runIdRef.current,
                        content.trim(),
                        onChunk
                    );
                }

                // Final update with complete text
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: result.fullText,
                    };
                    saveToHistory(updated);
                    return updated;
                });
            } catch (error) {
                console.error("Chat error:", error);
                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: "assistant",
                        content: `⚠️ Error: ${error.message}. Please try again.`,
                    };
                    return updated;
                });
            } finally {
                setIsLoading(false);
            }
        },
        [agent, messages, isLoading, saveToHistory]
    );

    const clearChat = useCallback(() => {
        setMessages([]);
        runIdRef.current = null;
    }, []);

    const loadConversation = useCallback((savedMessages, savedRunId) => {
        setMessages(savedMessages);
        runIdRef.current = savedRunId;
    }, []);

    return { messages, isLoading, sendMessage, clearChat, loadConversation };
}

export function getChatHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
        return [];
    }
}

export function clearChatHistory() {
    localStorage.removeItem(HISTORY_KEY);
}

export function deleteChatEntry(id) {
    try {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        const filtered = history.filter((h) => h.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
        return filtered;
    } catch {
        return [];
    }
}
