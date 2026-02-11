import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { agents } from "../data/agents";
import { useChat, getChatHistory } from "../hooks/useChat";
import {
    ArrowLeft, Send as SendIcon, Loader2, Bot, User as UserIcon, Trash2, Sparkles,
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, ShoppingCart, Target, Plane,
    CheckSquare, Twitter,
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send: SendIcon, ShoppingCart, Target, Plane,
    User: UserIcon, CheckSquare, Twitter,
};

export default function ChatPage() {
    const { agentId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const agent = useMemo(
        () => agents.find((a) => a.id === agentId),
        [agentId]
    );

    const { messages, isLoading, sendMessage, clearChat, loadConversation } = useChat(agent);

    // Load from history if historyId present
    useEffect(() => {
        const historyId = searchParams.get("historyId");
        if (historyId) {
            const history = getChatHistory();
            const entry = history.find((h) => h.id === historyId);
            if (entry) {
                loadConversation(entry.messages, entry.runId);
            }
        }
    }, [searchParams, loadConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    if (!agent) {
        return (
            <div className="chat-page">
                <div className="chat-not-found">
                    <h2>Agent not found</h2>
                    <button onClick={() => navigate("/")} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput("");
        }
    };

    const Icon = iconMap[agent.icon] || Sparkles;

    return (
        <div className="chat-page">
            <div className="chat-header">
                <button onClick={() => navigate("/")} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Home</span>
                </button>
                <div className="chat-agent-info">
                    <div
                        className="chat-agent-icon"
                        style={{ background: `${agent.color}20`, color: agent.color }}
                    >
                        <Icon size={20} />
                    </div>
                    <div>
                        <h2 className="chat-agent-name">{agent.name}</h2>
                        <span className="chat-agent-category">{agent.category}</span>
                    </div>
                </div>
                <button onClick={clearChat} className="clear-btn" title="Clear chat">
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <div
                            className="welcome-icon"
                            style={{ background: `${agent.color}15`, color: agent.color }}
                        >
                            <Icon size={48} />
                        </div>
                        <h2>{agent.name}</h2>
                        <p>{agent.description}</p>
                        <div className="welcome-hints">
                            <p className="hints-label">How this agent works:</p>
                            <ul>
                                <li>Type your message below and press Send</li>
                                <li>The agent streams its response in real-time</li>
                                <li>Continue the conversation for follow-up questions</li>
                                <li>Your chat history is saved automatically</li>
                            </ul>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                        <div className="bubble-avatar">
                            {msg.role === "user" ? (
                                <UserIcon size={18} />
                            ) : (
                                <Bot size={18} />
                            )}
                        </div>
                        <div className="bubble-content">
                            {msg.role === "assistant" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {msg.content || "..."}
                                </ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && messages[messages.length - 1]?.content === "" && (
                    <div className="chat-loading">
                        <Loader2 size={20} className="spin" />
                        <span>Agent is thinking...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-form" onSubmit={handleSubmit}>
                <div className="chat-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`Message ${agent.name}...`}
                        disabled={isLoading}
                        className="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="send-btn"
                        style={{ background: input.trim() && !isLoading ? agent.color : undefined }}
                    >
                        {isLoading ? <Loader2 size={18} className="spin" /> : <SendIcon size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
