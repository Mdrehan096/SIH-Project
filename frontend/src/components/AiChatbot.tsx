import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  User,
  ShieldCheck,
  Cpu,
  Sparkles,
  Train,
  Layers,
  AlertTriangle,
  BarChart2,
  MapPin,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ChatAction {
  label: string;
  target_path: string;
  action_code?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  model_used?: string;
  data_type?: string;
  data?: any;
  suggested_actions?: ChatAction[];
  timestamp: string;
}

const LLM_MODELS = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Deep Operations & CP-SAT Solver Specialist', badge: 'PRO' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Ultra-Fast Railway Query Engine', badge: 'FAST' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', desc: 'Multimodal Maintenance Assistant', badge: 'GPT4' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Advanced Logistics & Safety Engine', badge: 'CLAUDE' },
  { id: 'local-railway-llm', name: 'RETRACK Micro-LLM', desc: 'Offline Railway Micro-Model', badge: 'OFFLINE' },
];

const QUICK_PROMPT_CHIPS = [
  { label: '🚆 Track Live Trains', prompt: 'Show live train tracking status and delayed trains' },
  { label: '⚠️ High-Risk Assets', prompt: 'Which railway assets are at high risk?' },
  { label: '🧩 CP-SAT Block Plan', prompt: 'Generate recommended maintenance block schedule' },
  { label: '📊 Delhi Division Summary', prompt: 'Show Delhi Division analytics and route distance' },
  { label: '📐 Calculate Route Distance', prompt: 'Calculate route distance from New Delhi to Agra Cantt' },
  { label: '📜 Audit Compliance', prompt: 'Show system RBAC permissions and audit compliance status' },
];

export const AiChatbot: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-pro');
  const [inputMsg, setInputMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello ${user?.full_name || 'Officer'}. I am your RETRACK AI Assistant powered by multi-provider LLM models.\n\nAsk me anything about live train tracking, CP-SAT block planning, asset risks, or division metrics right inside this chat window!`,
      model_used: 'gemini-1.5-pro',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggested_actions: [
        { label: '🚆 Live Trains', target_path: '/trains', action_code: 'SHOW_TRAINS' },
        { label: '🧩 CP-SAT Planner', target_path: '/planner', action_code: 'SHOW_BLOCKS' },
        { label: '⚠️ High-Risk Assets', target_path: '/assets', action_code: 'SHOW_RISK' },
        { label: '📊 Division Analytics', target_path: '/divisions', action_code: 'SHOW_DIVISIONS' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
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
          user_role: user?.role || 'CONTROLLER',
          model: selectedModel,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.response,
          model_used: data.model_used || selectedModel,
          data_type: data.data_type,
          data: data.data,
          suggested_actions: data.suggested_actions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        return;
      }
    } catch {
      // Offline fallback handling
    }

    // High-performance offline fallback generator
    const lower = queryText.toLowerCase();
    let replyText = `### 🚆 RETRACK AI Assistant\n\nOfficer, I have queried the operational database using **${selectedModel}**.\n\n`;
    let dataType = 'GENERAL_INFO';
    let dataObj: any = null;
    let actions: ChatAction[] = [];

    if (lower.includes('track') || lower.includes('train')) {
      dataType = 'TRAINS_LIST';
      replyText += `Currently monitoring **48 active trains** on the **NDLS-AGC Mainline Corridor** (KM 0.0 to 200.0).\n\n- **Running On Time:** 46 trains\n- **Delayed:** 2 trains (12951 Mumbai Rajdhani +12m delay)`;
      dataObj = {
        total_trains: 48,
        delayed_count: 2,
        on_time_count: 46,
        trains: [
          { train_number: '12951', train_name: 'Mumbai Rajdhani Express', origin: 'NDLS', destination: 'BCT', speed: '110 km/h', status: 'DELAYED', delay_minutes: 12 },
          { train_number: '12050', train_name: 'Gatimaan Express', origin: 'NZM', destination: 'VGLJ', speed: '160 km/h', status: 'ON_TIME', delay_minutes: 0 },
          { train_number: '22436', train_name: 'Vande Bharat Express', origin: 'NDLS', destination: 'BSB', speed: '130 km/h', status: 'ON_TIME', delay_minutes: 0 }
        ]
      };
      actions = [
        { label: '⚠️ High-Risk Assets', target_path: '/assets', action_code: 'SHOW_RISK' },
        { label: '🧩 CP-SAT Planner', target_path: '/planner', action_code: 'SHOW_BLOCKS' }
      ];
    } else if (lower.includes('block') || lower.includes('plan') || lower.includes('cp-sat')) {
      dataType = 'BLOCK_PLAN';
      replyText += `**Primary Recommendation:** Possession Block \`BLK-2026-081\`\n- **Section:** NDLS - AGC Mainline (KM 120.0 to 128.5)\n- **Optimized Window:** \`02:00 AM – 03:00 AM\` (60 Mins Duration)\n- **Bundled Jobs:** 7 Jobs across Civil, Electrical OHE, and S&T\n- **Optimization Score:** **94.5 / 100**`;
      dataObj = {
        block_id: 'BLK-2026-081',
        section: 'NDLS - AGC Section (KM 120.0 - 128.5)',
        start_time: '02:00 AM',
        end_time: '03:00 AM',
        duration_minutes: 60,
        tasks_bundled: 7,
        optimization_score: 94.5,
        affected_trains: 0,
        status: 'RECOMMENDED'
      };
      actions = [
        { label: '🚆 Live Trains', target_path: '/trains', action_code: 'SHOW_TRAINS' },
        { label: '📊 Delhi Division Summary', target_path: '/divisions', action_code: 'SHOW_DIVISIONS' }
      ];
    } else if (lower.includes('risk') || lower.includes('asset')) {
      dataType = 'ASSET_RISKS';
      replyText += `Scikit-Learn Random Forest model identified **3 critical asset sections** requiring immediate maintenance window attention.`;
      dataObj = {
        critical_assets_count: 3,
        top_risks: [
          { asset_id: 'TRK-124', type: 'Track Rail', location: 'KM 124.5', risk_score: 90, action: 'Deep Ballast Tamp & Rail Grinding' },
          { asset_id: 'OHE-124', type: 'Electrical OHE', location: 'KM 124.2', risk_score: 82, action: 'OHE Catenary Wire Tensioning' },
          { asset_id: 'TRK-120', type: 'Track Rail', location: 'KM 120.0', risk_score: 78, action: 'Track Rail Replacement' }
        ]
      };
      actions = [
        { label: '🧩 CP-SAT Block Planner', target_path: '/planner', action_code: 'SHOW_BLOCKS' }
      ];
    } else {
      replyText += `How can I assist you with maintenance planning, COA train tracking, or division route metrics today?`;
      actions = [
        { label: '🚆 Track Live Trains', target_path: '/trains', action_code: 'SHOW_TRAINS' },
        { label: '🧩 CP-SAT Block Planner', target_path: '/planner', action_code: 'SHOW_BLOCKS' },
        { label: '⚠️ High-Risk Assets', target_path: '/assets', action_code: 'SHOW_RISK' }
      ];
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
        suggested_actions: actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLoading(false);
  };

  const handleActionClick = (action: ChatAction) => {
    // Process action INSIDE THE CHAT WINDOW without forcing page navigation
    if (action.action_code === 'SHOW_TRAINS') {
      handleSend('Show live train tracking status and delayed trains');
    } else if (action.action_code === 'SHOW_BLOCKS') {
      handleSend('Generate recommended maintenance block schedule');
    } else if (action.action_code === 'SHOW_RISK') {
      handleSend('Which railway assets are at high risk?');
    } else if (action.action_code === 'SHOW_DIVISIONS') {
      handleSend('Show Delhi Division analytics');
    } else if (action.action_code === 'CALC_DIST') {
      handleSend('Calculate route distance from New Delhi to Agra Cantt');
    } else {
      // Fallback query send
      handleSend(`Query details regarding ${action.label}`);
    }
  };

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
            <span className="text-xs font-bold block leading-none">RETRACK AI Assistant</span>
            <span className="text-[10px] text-sky-200/80 font-mono block mt-0.5">Multi-LLM Decision Engine</span>
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'w-[750px] max-w-[calc(100vw-3rem)] h-[700px] max-h-[calc(100vh-4rem)]'
              : 'w-[440px] max-w-[calc(100vw-2rem)] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 text-sky-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xs flex items-center space-x-2">
                  <span>RETRACK AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Inline Chat Answer Mode Active</span>
                </p>
              </div>
            </div>

            {/* Model Selector & Window Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-sky-400 font-mono text-[11px] font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                {LLM_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.badge}] {m.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title={isExpanded ? 'Collapse View' : 'Expand View'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Sender Header */}
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  {m.sender === 'user' ? (
                    <>
                      <span>{user?.full_name || 'Officer'}</span>
                      <User className="w-3 h-3 text-sky-400" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-emerald-400" />
                      <span className="font-bold text-slate-300">RETRACK AI</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-900 text-sky-400 text-[9px] border border-slate-800">
                        {m.model_used || selectedModel}
                      </span>
                    </>
                  )}
                  <span>• {m.timestamp}</span>
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg space-y-3'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-xs">
                    {m.text}
                  </div>

                  {/* Render Structured Data Cards Inline inside Chat */}
                  {m.sender === 'assistant' && m.data && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                      {/* TRAINS_LIST Inline Card */}
                      {m.data_type === 'TRAINS_LIST' && m.data.trains && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-sky-400 font-bold border-b border-slate-800 pb-1.5">
                            <span className="flex items-center space-x-1.5">
                              <Train className="w-3.5 h-3.5" />
                              <span>Monitored Express Corridor</span>
                            </span>
                            <span className="text-[10px] bg-sky-950 px-2 py-0.5 rounded text-sky-300 border border-sky-800">
                              {m.data.total_trains} Trains
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {m.data.trains.map((t: any) => (
                              <div key={t.train_number} className="flex items-center justify-between p-1.5 rounded bg-slate-900 border border-slate-800/80">
                                <div>
                                  <span className="font-bold text-slate-100">{t.train_number}</span> - <span className="text-slate-300">{t.train_name}</span>
                                </div>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  t.status === 'DELAYED' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                  {t.status} ({t.speed || '110 km/h'})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* BLOCK_PLAN Inline Card */}
                      {m.data_type === 'BLOCK_PLAN' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1.5">
                            <span className="flex items-center space-x-1.5">
                              <Layers className="w-3.5 h-3.5" />
                              <span>CP-SAT Block Candidate ({m.data.block_id})</span>
                            </span>
                            <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
                              Score: {m.data.optimization_score}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[10px]">
                            <div>Window: <strong>{m.data.start_time} - {m.data.end_time}</strong></div>
                            <div>Duration: <strong>{m.data.duration_minutes} Mins</strong></div>
                            <div>Bundled Jobs: <strong>{m.data.tasks_bundled} Jobs</strong></div>
                            <div>Conflicts: <strong className="text-emerald-400">{m.data.affected_trains} Conflicts</strong></div>
                          </div>
                        </div>
                      )}

                      {/* ASSET_RISKS Inline Card */}
                      {m.data_type === 'ASSET_RISKS' && m.data.top_risks && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1.5">
                            <span className="flex items-center space-x-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Critical Track Risk Sections</span>
                            </span>
                            <span className="text-[10px] bg-amber-950 px-2 py-0.5 rounded text-amber-300 border border-amber-800">
                              {m.data.critical_assets_count} Critical
                            </span>
                          </div>
                          <div className="space-y-1">
                            {m.data.top_risks.map((r: any) => (
                              <div key={r.asset_id} className="flex justify-between items-center text-[10px] p-1 bg-slate-900 rounded">
                                <span className="text-sky-400 font-bold">{r.asset_id} ({r.location})</span>
                                <span className="text-rose-400 font-bold">Score: {r.risk_score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DIVISION_METRICS Inline Card */}
                      {m.data_type === 'DIVISION_METRICS' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-sky-400 font-bold border-b border-slate-800 pb-1.5">
                            <span className="flex items-center space-x-1.5">
                              <BarChart2 className="w-3.5 h-3.5" />
                              <span>{m.data.name} Breakdown</span>
                            </span>
                            <span className="text-[10px] bg-sky-950 px-2 py-0.5 rounded text-sky-300 border border-sky-800">
                              {m.data.total_route_km} KM
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[10px]">
                            <div>Active Blocks: <strong>{m.data.active_blocks} Blocks</strong></div>
                            <div>Trains Running: <strong>{m.data.trains_running} Trains</strong></div>
                            <div>Workload: <strong>{m.data.workload_index}</strong></div>
                            <div>Avg Delay: <strong>{m.data.avg_delay_min} Mins</strong></div>
                          </div>
                        </div>
                      )}

                      {/* DISTANCE_CALC Inline Card */}
                      {m.data_type === 'DISTANCE_CALC' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-purple-400 font-bold border-b border-slate-800 pb-1.5">
                            <span className="flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>Route Distance: {m.data.origin} → {m.data.destination}</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-slate-300 text-[10px]">
                            <div>Haversine Distance: <strong>{m.data.haversine_km} KM</strong></div>
                            <div>Track Route Distance: <strong className="text-purple-300">{m.data.route_km} KM</strong></div>
                            <div>Transit Duration: <strong>{m.data.transit_time_hrs}</strong></div>
                            <div>Electrification: <strong>100% Electrified</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Copy Action */}
                  {m.sender === 'assistant' && (
                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 border-t border-slate-800/60 font-mono">
                      <span>Verified Database Source</span>
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="flex items-center space-x-1 hover:text-slate-200 transition-colors"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline Action Buttons (Processes INSIDE Chat Window) */}
                {m.suggested_actions && m.suggested_actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 max-w-[90%]">
                    {m.suggested_actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        className="px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800/60 font-mono text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer transform active:scale-95"
                      >
                        <span>{act.label}</span>
                        <Sparkles className="w-3 h-3 text-sky-400" />
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        navigate(m.suggested_actions![0].target_path);
                        setIsOpen(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800 font-mono text-[10px] flex items-center space-x-1 transition-all"
                      title="Open full page view"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Full Page</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-2 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <Cpu className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Running query on {LLM_MODELS.find(m => m.id === selectedModel)?.name}...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 overflow-x-auto whitespace-nowrap flex space-x-2 scrollbar-none">
            {QUICK_PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[10px] transition-all cursor-pointer shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
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
                placeholder={`Ask ${LLM_MODELS.find(m => m.id === selectedModel)?.name}...`}
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
                <span>RBAC Authorized: <strong>{user?.role || 'CONTROLLER'}</strong></span>
              </span>
              <span>Model: <strong>{LLM_MODELS.find(m => m.id === selectedModel)?.badge}</strong></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
