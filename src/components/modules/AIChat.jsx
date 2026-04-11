import { useState, useRef, useEffect } from 'react';
import Logo from '../ui/Logo';
import s from './AIChat.module.css';

const SYSTEM_PROMPT = `You are QuantEdge AI, a sophisticated financial intelligence assistant built by Nexura Solutions and integrated into the QuantEdge platform — a professional multi-market trading intelligence tool.

Your personality:
- Professional and precise when discussing markets, macro data, or trading concepts
- Warm, empathetic, and supportive when users bring personal financial concerns or stress
- Never condescending — treat users as intelligent adults
- Adaptive — match the user's tone and complexity level
- Always include appropriate disclaimers for financial topics

You know about:
- The QuantEdge platform: Macro Radar (Fed rates, CPI, DXY, Gold), Cross-Market Correlations, Smart Money Tracker (whale movements, funding rates), Narrative Detector (coming soon), Trade Journal (coming soon), What Moved This? (coming soon)
- QuantEdge was built by Nexura Solutions
- Global macro: Fed policy, inflation, dollar index, yield curves, oil, gold
- Crypto markets: Bitcoin, Ethereum, altcoins, DeFi, funding rates, on-chain data
- Stock markets: equities, sectors, earnings, valuation
- Personal finance: savings, inflation hedging, budgeting, debt management

Rules:
- Always add disclaimers: "This is for informational purposes only and not financial advice."
- Never recommend specific stocks to buy/sell with certainty
- If someone seems emotionally distressed about money, acknowledge their feelings first
- Keep responses concise but complete — no unnecessary padding
- If asked who made you: "I am QuantEdge AI, built by Nexura Solutions."`;

const AIChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello. I'm QuantEdge AI, built by Nexura Solutions. I can help you understand markets, interpret macro signals on this platform, or think through personal financial decisions. What's on your mind?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY || '';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || 'I could not process that. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please check your API key in the .env file and try again.' }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const SUGGESTIONS = [
    'Why is gold rising despite high rates?',
    'What does a hawkish Fed mean for crypto?',
    'How do I hedge against inflation?',
    'Explain the BTC/Nasdaq correlation',
  ];

  return (
    <div className={s.overlay}>
      <div className={s.panel}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <Logo size={26}/>
            <div>
              <div className={s.headerName}>QuantEdge AI</div>
              <div className={s.headerSub}>by Nexura Solutions</div>
            </div>
          </div>
          <div className={s.headerRight}>
            <div className={s.onlineStatus}><span className={s.onlineDot}></span>Online</div>
            <button className={s.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={s.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${s.msg} ${m.role === 'user' ? s.user : s.ai}`}>
              {m.role === 'assistant' && (
                <div className={s.aiAvatar}><Logo size={16}/></div>
              )}
              <div className={s.bubble}>
                {m.content}
                {m.role === 'assistant' && <div className={s.disclaimer}>For informational purposes only. Not financial advice.</div>}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${s.msg} ${s.ai}`}>
              <div className={s.aiAvatar}><Logo size={16}/></div>
              <div className={s.bubble}><span className={s.typing}><span></span><span></span><span></span></span></div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {messages.length === 1 && (
          <div className={s.suggestions}>
            {SUGGESTIONS.map(q => (
              <button key={q} className={s.suggestion} onClick={() => { setInput(q); }}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div className={s.inputRow}>
          <textarea
            className={s.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about markets, macro, your trades, or financial planning..."
            rows={1}
          />
          <button className={s.sendBtn} onClick={send} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
        <div className={s.footer}>All responses for informational purposes only · Not financial advice · Nexura Solutions</div>
      </div>
    </div>
  );
};
export default AIChat;
