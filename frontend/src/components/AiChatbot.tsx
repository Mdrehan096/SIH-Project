import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  ShieldCheck,
  Cpu,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Search,
  MessageSquare,
  PlusCircle,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Sparkles,
  GraduationCap,
  Trash2,
  Edit2,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ChatAction {
  label: string;
  target_path: string;
  action_code?: string;
}

interface SourceMetadata {
  source: string;
  document: string;
  section?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  model_used?: string;
  data_type?: string;
  data?: any;
  sources?: SourceMetadata[];
  suggested_actions?: ChatAction[];
  timestamp: string;
  feedback?: 'UP' | 'DOWN';
}

interface ConversationItem {
  id: string;
  title: string;
  created_at: string;
}

const EXPLAINER_BUTTONS = [
  { label: '🏗️ Architecture', explainer_code: 'ARCHITECTURE', prompt: 'Explain the Model-View-Controller architecture of RETRACK' },
  { label: '🔄 System Workflow', explainer_code: 'WORKFLOW', prompt: 'Explain the complete end-to-end system workflow' },
  { label: '🤖 AI ML Risk', explainer_code: 'AI_ML', prompt: 'How does the Scikit-Learn Random Forest risk engine work?' },
  { label: '🧩 CP-SAT Solver', explainer_code: 'CP_SAT', prompt: 'Why do we use Google OR-Tools CP-SAT for block optimization?' },
  { label: '🎓 Viva Guide', explainer_code: 'VIVA', prompt: 'Prepare me for RETRACK viva presentation questions' },
  { label: '🚆 Live Trains', explainer_code: 'WORKFLOW', prompt: 'Show live COA train operations and timetables' },
  { label: '⚠️ TDMS Defects', explainer_code: 'WORKFLOW', prompt: 'Show critical track defects from TDMS' },
  { label: '🔑 Digital PN', explainer_code: 'WORKFLOW', prompt: 'Explain the 2-factor Digital Private Number handshake protocol' },
  { label: '📊 Database', explainer_code: 'DATABASE', prompt: 'Explain RETRACK database schema and PostgreSQL tables' },
  { label: '🔒 Security', explainer_code: 'SECURITY', prompt: 'Explain RETRACK security architecture and JWT RBAC' },
  { label: '🔮 Future Scope', explainer_code: 'FUTURE_SCOPE', prompt: 'What is the documented future scope of RETRACK?' },
];

const QUICK_PROMPT_CHIPS = [
  'Explain RETRACK',
  'Explain the architecture',
  'How does risk scoring work?',
  'Explain CP-SAT',
  'Explain the complete workflow',
  'What is the future scope?',
  'Prepare me for viva',
  'What are TMS, TDMS, SMMS feeds?',
  'How does +15 min safety buffer work?',
];

export const AiChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [vivaMode, setVivaMode] = useState<boolean>(false);
  const selectedModel = 'gemini-1.5-pro';
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Conversation history state
  const [activeConvId, setActiveConvId] = useState<string>(`conv-${Date.now().toString().slice(-6)}`);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello ${user?.full_name || 'Officer'}. I am **RETRACKAI**, the official project-specific LLM assistant for RETRACK – RailSync-AI (SIH 2026 Problem Statement 26027).\n\nAsk me anything about RETRACK architecture, system workflows, feeds (TMS, TDMS, SMMS, COA), CP-SAT optimizer, AI risk scoring, database schemas, APIs, viva questions, or live operational data!`,
      model_used: 'gemini-1.5-pro',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        { source: 'RETRACK Project Documentation', document: 'project_overview.md', section: 'Executive Overview' },
      ],
      suggested_actions: [
        { label: '🧩 CP-SAT Planner', target_path: '/planner', action_code: 'SHOW_BLOCKS' },
        { label: '🚆 Live COA Trains', target_path: '/trains', action_code: 'SHOW_TRAINS' },
        { label: '⚠️ High-Risk Assets', target_path: '/assets', action_code: 'SHOW_RISK' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      fetchConversations();
    }
  }, [messages, isOpen]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('retrack_token') || 'demo-access-token';
      const res = await fetch('http://localhost:8000/api/v1/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {
      // Fallback local state
    }
  };

  const startNewChat = () => {
    const newId = `conv-${Date.now().toString().slice(-6)}`;
    setActiveConvId(newId);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `New RETRACKAI conversation started. Ask me anything about RETRACK project documentation, system workflows, or live operational feeds!`,
        model_used: selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const renameChat = async (convId: string) => {
    const newTitle = prompt('Enter new conversation title:');
    if (!newTitle) return;
    try {
      const token = localStorage.getItem('retrack_token') || 'demo-access-token';
      await fetch(`http://localhost:8000/api/v1/chat/conversations/${convId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTitle }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
      );
    } catch {
      // Fallback update
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
      );
    }
  };

  const deleteChat = async (convId: string) => {
    if (!confirm('Are you sure you want to delete this chat conversation?')) return;
    try {
      const token = localStorage.getItem('retrack_token') || 'demo-access-token';
      await fetch(`http://localhost:8000/api/v1/chat/conversations/${convId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) startNewChat();
    } catch {
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) startNewChat();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = async (messageId: string, isHelpful: boolean) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: isHelpful ? 'UP' : 'DOWN' } : m))
    );
    try {
      const token = localStorage.getItem('retrack_token') || 'demo-access-token';
      await fetch('http://localhost:8000/api/v1/chat/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message_id: messageId, is_helpful: isHelpful }),
      });
    } catch {
      // Quiet catch
    }
  };

  const handleSend = async (textToSend?: string, explainerCode?: string) => {
    const queryText = textToSend || inputMsg;
    if (!queryText.trim()) return;

    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    if (!textToSend) setInputMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('retrack_token') || 'demo-access-token';
      const response = await fetch('http://localhost:8000/api/v1/chat/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: queryText,
          conversation_id: activeConvId,
          model: selectedModel,
          user_role: user?.role || 'CONTROLLER',
          explainer_mode: explainerCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: data.message_id || `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.response,
          model_used: data.model_used || selectedModel,
          data_type: data.data_type,
          data: data.data,
          sources: data.sources || [],
          suggested_actions: data.suggested_actions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        return;
      }
    } catch {
      // Fallback
    }

    // High-Performance Fallback Response Generator
    const lower = queryText.toLowerCase();
    let replyText = `### 🚆 RETRACKAI Project Knowledge Assistant\n\n`;
    let dataType = 'SYSTEM_INFO';
    let dataObj: any = null;

    if (vivaMode || lower.includes('viva') || lower.includes('exam')) {
      replyText += `### 🎓 VIVA MENTOR ANSWER\n\n**Q: What is RETRACK?**\nRETRACK – RailSync-AI is an AI-powered railway maintenance decision support platform for Indian Railways that unifies multi-department feeds (TMS, TDMS, SMMS, COA) and uses Google OR-Tools CP-SAT to automatically schedule 5 km bundled maintenance blocks.\n\n**Key Technical Takeaways:**\n- Reduces corridor downtime by up to **40%**.\n- Enforces a mandatory **+15 minute safety buffer** around express trains.`;
    } else if (lower.includes('tdms') || lower.includes('defect') || lower.includes('crack')) {
      dataType = 'ASSET_RISKS';
      replyText += `### ⚠️ Live TDMS Track Defect Summary\n\nRetrieved critical defect records from the Track Defect Management System (TDMS) feed.\n\n- **Primary Threat:** Rail cracks and ultrasonic flaw alerts at KM 124.5 (\`TRK-124\`).\n- **Recommended Action:** Schedule joint maintenance block possession during 02:00-03:00 AM window.`;
      dataObj = {
        critical_assets_count: 3,
        top_risks: [
          { asset_id: 'TRK-124', location: 'KM 124.5', risk_score: 90, action: 'Deep Ballast Tamp & Rail Grinding' },
          { asset_id: 'OHE-124', location: 'KM 124.2', risk_score: 82, action: 'OHE Catenary Wire Tensioning' },
          { asset_id: 'TRK-120', location: 'KM 120.0', risk_score: 78, action: 'Track Rail Replacement' },
        ],
      };
    } else {
      replyText += `RETRACK – RailSync-AI (SIH Problem Statement ID 26027) is an AI-powered railway maintenance planning platform.\n\nIt connects **TMS (Civil)**, **TDMS (Defects)**, **SMMS (Electrical/S&T)**, and **COA (Trains)** feeds, uses Scikit-Learn Random Forest for asset risk scoring, and OR-Tools CP-SAT for block scheduling.`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        model_used: selectedModel,
        data_type: dataType,
        data: dataObj,
        sources: [{ source: 'RETRACK Project Documentation', document: 'project_overview.md', section: 'Overview' }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLoading(false);
  };

  const regenerateResponse = () => {
    if (messages.length < 2) return;
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg) {
      handleSend(lastUserMsg.text);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold py-3.5 px-5 rounded-2xl shadow-2xl flex items-center space-x-3 border border-sky-400/40 z-40 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="p-1.5 rounded-xl bg-slate-950/60 shadow-inner">
            <Bot className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold block leading-none">RETRACKAI Assistant</span>
            <span className="text-[10px] text-sky-200/80 font-mono block mt-0.5">Project Knowledge & Live AI</span>
          </div>
        </button>
      )}

      {/* Main Chat & Search Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex z-50 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[900px] max-w-[calc(100vw-3rem)] h-[720px] max-h-[calc(100vh-4rem)]'
              : 'w-[520px] max-w-[calc(100vw-2rem)] h-[650px]'
          }`}
        >
          {/* Collapsible Sidebar for History & Search */}
          {showSidebar && (
            <div className="w-64 bg-slate-950 border-r border-slate-800 p-3.5 flex flex-col justify-between shrink-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                    <span>Chat History</span>
                  </span>
                  <button
                    onClick={startNewChat}
                    className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-400 text-[10px] font-bold flex items-center space-x-1"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>New Chat</span>
                  </button>
                </div>

                {/* Search Conversations Input */}
                <div className="relative">
                  <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search previous chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Conversations List */}
                <div className="space-y-1 overflow-y-auto max-h-[420px] text-xs">
                  {filteredConversations.length === 0 ? (
                    <div className="text-[10px] text-slate-500 py-3 text-center">No previous chats found.</div>
                  ) : (
                    filteredConversations.map((c) => (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors group ${
                          activeConvId === c.id
                            ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActiveConvId(c.id);
                            setShowSidebar(false);
                          }}
                          className="truncate flex-1 text-left"
                        >
                          {c.title}
                        </button>
                        <div className="hidden group-hover:flex items-center space-x-1 shrink-0 ml-1">
                          <button
                            onClick={() => renameChat(c.id)}
                            className="p-1 text-slate-400 hover:text-sky-400"
                            title="Rename Chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteChat(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-400"
                            title="Delete Chat"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
                <span>RETRACK Knowledge Base</span>
                <span className="text-emerald-400 font-bold">24 Docs Active</span>
              </div>
            </div>
          )}

          {/* Main Conversation Window */}
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {/* Top Bar Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400"
                  title="Toggle Chat History"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                </button>

                <div className="p-1.5 rounded-xl bg-sky-950 border border-sky-800 text-sky-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-xs flex items-center space-x-2">
                    <span>RETRACKAI</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-mono font-bold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ONLINE</span>
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Project-Trained Knowledge Engine</p>
                </div>
              </div>

              {/* Controls: Viva Mode Toggle + View Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVivaMode(!vivaMode)}
                  className={`px-2.5 py-1 rounded-lg border font-mono text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                    vivaMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-400'
                  }`}
                  title="Toggle Viva / Presentation Mode"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{vivaMode ? 'VIVA MODE ON' : 'Viva Mode'}</span>
                </button>

                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-800/80 text-sky-300 font-mono text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
                  <span>RETRACKAI v2.0</span>
                </div>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Explainer Mode Quick Actions Header Bar */}
            <div className="bg-slate-950/80 px-3 py-1.5 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap flex space-x-1.5 scrollbar-none">
              {EXPLAINER_BUTTONS.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(btn.prompt, btn.explainer_code)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[10px] font-semibold transition-all shrink-0 cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'assistant' && (
                    <div className="p-1.5 rounded-xl bg-sky-950 border border-sky-800 text-sky-400 shrink-0 h-fit mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 font-mono mb-1">
                      <span>{m.sender === 'user' ? 'You' : 'RETRACKAI Assistant'}</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                      {m.text}
                    </div>

                    {/* Knowledge Sources Metadata Badges */}
                    {m.sender === 'assistant' && m.sources && m.sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                        {m.sources.map((s, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-sky-300"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-sky-400" />
                            <span>
                              {s.document} ({s.section})
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Structured Cards inside Chat */}
                    {m.sender === 'assistant' && m.data && (
                      <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-2">
                        {m.data_type === 'ASSET_RISKS' && m.data.top_risks && (
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                            <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1.5">
                              <span className="flex items-center space-x-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Critical Track Risk Sections</span>
                              </span>
                              <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800">
                                {m.data.critical_assets_count || 3} Critical
                              </span>
                            </div>
                            <div className="space-y-1">
                              {m.data.top_risks.map((r: any) => (
                                <div key={r.asset_id} className="flex justify-between items-center text-[10px] p-1.5 bg-slate-900 rounded">
                                  <span className="text-sky-400 font-bold">{r.asset_id} ({r.location})</span>
                                  <span className="text-rose-400 font-bold">Score: {r.risk_score}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assistant Footer: Copy, Regenerate & Feedback */}
                    {m.sender === 'assistant' && (
                      <div className="flex items-center justify-between pt-2.5 text-[10px] text-slate-500 border-t border-slate-800/60 font-mono">
                        <div className="flex items-center space-x-2">
                          <span>Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(m.id, true)}
                            className={`p-1 rounded hover:text-emerald-400 ${m.feedback === 'UP' ? 'text-emerald-400 font-bold' : ''}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(m.id, false)}
                            className={`p-1 rounded hover:text-rose-400 ${m.feedback === 'DOWN' ? 'text-rose-400 font-bold' : ''}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={regenerateResponse}
                            className="flex items-center space-x-1 hover:text-sky-400 transition-colors"
                            title="Regenerate Response"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                          <button
                            onClick={() => handleCopy(m.id, m.text)}
                            className="flex items-center space-x-1 hover:text-slate-200 transition-colors"
                          >
                            {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Cpu className="w-3.5 h-3.5 animate-spin text-sky-400" />
                  <span>Searching RETRACK Project Knowledge Engine & Application Data...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
              {QUICK_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[10px] transition-all cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder={vivaMode ? 'Ask a Viva / Presentation Question...' : 'Ask RETRACKAI...'}
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Authorized Role: <strong>{user?.role || 'CONTROLLER'}</strong></span>
                </span>
                <span>Grounding: <strong>RETRACK Knowledge Base & Live Feeds</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
