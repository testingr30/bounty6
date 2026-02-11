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
    CheckSquare, Twitter, Copy, Check, MessageSquare
} from "lucide-react";

const iconMap = {
    Mail, Clock, FileText, Linkedin, Briefcase, BookOpen,
    GraduationCap, Code, FileCheck, BarChart3, PenTool,
    Youtube, Rocket, Send: SendIcon, ShoppingCart, Target, Plane,
    User: UserIcon, CheckSquare, Twitter,
};

const CodeBlock = ({ children }) => {
    const [copied, setCopied] = useState(false);
    const code = String(children).replace(/\n$/, "");

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="code-block-container">
            <button className="copy-button" onClick={handleCopy} title="Copy code">
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <pre>
                <code>{children}</code>
            </pre>
        </div>
    );
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
    }, [searchParams, loadConversation, agentId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [agentId]);

    if (!agent) {
        return (
            <div className="chat-page" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="chat-not-found">
                    <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <h2>Agent ID mismatch in registry</h2>
                    <button onClick={() => navigate("/")} className="btn-primary">
                        Return to Command Center
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
        <div className="chat-page-container fade-in">
            <div className="chat-header">
                <button onClick={() => navigate("/")} className="back-btn">
                    <ArrowLeft size={18} />
                    <span>Hub</span>
                </button>
                <div className="chat-agent-info">
                    <div
                        className="chat-agent-icon"
                        style={{ background: `${agent.color}15`, color: agent.color, border: `1px solid ${agent.color}40` }}
                    >
                        <Icon size={18} />
                    </div>
                    <div>
                        <h2 className="chat-agent-name">{agent.name}</h2>
                        <div className="chat-agent-status">
                            <span className="status-dot pulsed"></span>
                            <span>ENTITY_ONLINE</span>
                        </div>
                    </div>
                </div>
                <button onClick={clearChat} className="clear-btn" title="Clear buffer">
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        <div
                            className="welcome-icon"
                            style={{ background: `${agent.color}10`, color: agent.color, border: `1px solid ${agent.color}30` }}
                        >
                            <Icon size={40} />
                        </div>
                        <h2>{agent.name} Initialized</h2>
                        <p className="welcome-desc">{agent.description}</p>

                        <div className="welcome-suggestions">
                            <span className="suggestions-label">RECOMMENDED QUERIES:</span>
                            <div className="suggestions-grid-welcome">
                                {agent.suggestions?.map((s, i) => (
                                    <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.role}`}>
                        <div className="bubble-avatar">
                            {msg.role === "user" ? (
                                <UserIcon size={16} />
                            ) : (
                                <Bot size={16} />
                            )}
                        </div>
                        <div className="bubble-content">
                            {msg.role === "assistant" ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code: ({ node, inline, className, children, ...props }) => {
                                            return !inline ? (
                                                <CodeBlock {...props}>{children}</CodeBlock>
                                            ) : (
                                                <code className={className} {...props}>{children}</code>
                                            )
                                        }
                                    }}
                                >
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
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>PROCESSING QUEUE...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
                {messages.length > 0 && agent.suggestions && !isLoading && (
                    <div className="suggestions-bar">
                        {agent.suggestions.slice(0, 3).map((s, i) => (
                            <button key={i} className="suggestion-chip-small" onClick={() => sendMessage(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                <form className="chat-input-form" onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Communicate with ${agent.name}...`}
                            disabled={isLoading}
                            className="chat-input"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="send-button"
                        >
                            {isLoading ? <Loader2 size={18} className="spin" /> : <SendIcon size={18} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
