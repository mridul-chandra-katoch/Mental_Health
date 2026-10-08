import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar/Navbar';

const Therapist = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your personal AI therapist. I'm here to listen and support you. How are you feeling today? 💙" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const chatBoxRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Frontend rate limiting: minimum 1 second between requests
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 1000) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'Please wait a moment before sending another message. ⏱️' 
      }]);
      return;
    }
    
    const userMessage = input;
    const newMessage = { sender: 'user', text: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);
    setLastRequestTime(now);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/therapist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          userId: 'default-user' 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || `HTTP ${response.status}`;
        
        if (response.status === 429) {
          // Show countdown for rate limit
          let waitTime = 60;
          const countdownMsg = `Too many requests. Waiting... (${waitTime}s)`;
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: countdownMsg 
          }]);
          
          const countdown = setInterval(() => {
            waitTime--;
            setMessages(prev => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg.sender === 'ai' && lastMsg.text.includes('Waiting...')) {
                return [...prev.slice(0, -1), { 
                  sender: 'ai', 
                  text: `Too many requests. Waiting... (${waitTime}s)` 
                }];
              }
              return prev;
            });
            
            if (waitTime <= 0) clearInterval(countdown);
          }, 1000);
        } else {
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: errorMsg 
          }]);
        }
        return;
      }
      
      const data = await response.json();
      await new Promise(r => setTimeout(r, 300));
      
      let responseText = data.response;
      if (data.cached) {
        responseText += '\n\n*[Cached response - faster! ⚡]*';
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    } catch (err) {
      let msg = 'I apologize, I encountered an error. Please try again.';
      
      if (err.message?.includes('429')) {
        msg = 'I\'m getting too many requests. Please wait a minute and try again. 🙏';
      } else if (err.message?.includes('401')) {
        msg = 'Authentication error. Please check the configuration. 🔑';
      } else if (err.message?.includes('Failed to fetch')) {
        msg = 'Cannot connect to server. Make sure backend is running at http://localhost:4000 🔌';
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages, loading]);

  const suggestions = ['I feel anxious today', 'I need help with stress', 'I feel lonely', 'Help me relax'];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 pt-20 pb-6 px-4">
        <div className="max-w-3xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">AI Therapist</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-500">Always here for you</span>
              </div>
            </div>
          </div>

          {/* Chat Box */}
          <div ref={chatBoxRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🤖</div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1">👤</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm mr-2">🤖</div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setInput(s)}
                  className="px-3 py-1.5 rounded-full bg-white border border-purple-100 text-sm text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all shadow-sm">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-3 flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Share what's on your mind..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm leading-relaxed py-1 max-h-32"
              style={{ minHeight: '36px' }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex-shrink-0">
              <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Therapist;
