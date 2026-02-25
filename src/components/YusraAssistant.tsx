import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, type Chat } from '@google/genai';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, X, Mic, MicOff, Send, Image as ImageIcon,
  Sparkles, Volume2, VolumeX
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';

const SYSTEM_INSTRUCTION = `
You are Yusra, the official virtual customer manager of Alpha Ultimate Ltd.

IDENTITY:
• Your name is Yusra.
• You are a virtual clone of Ezreen Al Yusra.
• You were planned and developed by Mohammad Maymul Hasan Shaon.
• When asked who you are, reply EXACTLY: "I'm Yusra, a virtual clone of Ezreen Al Yusra. I am planned and developed by Mohammad Maymul Hasan Shaon, and he dedicated me to his baby daughter Ezreen Al Yusra."

SECRECY:
• NEVER mention Gemini, Google, or any AI platform. Decline if asked.

PERSONALITY: Calm, confident, professional, helpful. Short clear replies. Never break character.

ROLE: Help with Pricing, Booking, Services, Estimation, Gallery, Contact, WhatsApp guidance.

MULTI-LANGUAGE: ALWAYS reply in the user's language (Arabic, Bangla, English). Detect from input.

SERVICES:
1. Post-Construction Cleaning – from SAR 500
2. Move-In/Move-Out Cleaning – from SAR 450
3. Full Home Deep Cleaning – from SAR 300
4. Standard Home Cleaning – from SAR 150
5. Kitchen Deep Cleaning – from SAR 200
6. Bathroom Deep Cleaning – from SAR 150
7. Sofa & Mattress Cleaning – from SAR 100/item
8. Office & Commercial Cleaning – quote on request

24/7 SERVICE. WhatsApp: +966563906822.

PORTAL: Name must contain 'W', number must contain '181989'. If both met: grant access.
`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'yusra';
  timestamp: Date;
  attachment?: { type: string; url: string };
}

function selectVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | null {
  if (lang === 'ar') {
    const preferred = ['Laila', 'Zainab', 'Majed'];
    for (const n of preferred) {
      const v = voices.find(v => v.name.includes(n) && v.lang.startsWith('ar'));
      if (v) return v;
    }
    return voices.find(v => v.lang.startsWith('ar') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('ar')) || null;
  }
  if (lang === 'bn') {
    return voices.find(v => v.lang.startsWith('bn') && v.name.includes('Google'))
      || voices.find(v => v.lang.startsWith('bn')) || null;
  }
  // English female voices
  const enFemale = ['Samantha', 'Zira', 'Google US English', 'Victoria', 'Karen', 'Moira', 'Ava'];
  for (const n of enFemale) {
    const v = voices.find(v => v.name.includes(n) && v.lang.startsWith('en'));
    if (v) return v;
  }
  return voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en')) || null;
}

export default function YusraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [yusraIconUrl, setYusraIconUrl] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const language = i18n.language?.split('-')[0] || 'en';
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Init chat + icon
  useEffect(() => {
    const init = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) return;
      const ai = new GoogleGenAI({ apiKey });
      setChatSession(ai.chats.create({
        model: 'gemini-2.0-flash',
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      }));
    };
    init();

    fetch('/api/admin/yusra-icon')
      .then(r => r.ok ? r.blob() : Promise.reject())
      .then(b => setYusraIconUrl(URL.createObjectURL(b)))
      .catch(() => null);
  }, []);

  // Welcome message (language-aware)
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      text: t('yusra.welcome'),
      sender: 'yusra',
      timestamp: new Date(),
    }]);
  }, [language, t]);

  // Speech recognition
  useEffect(() => {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = language === 'ar' ? 'ar-SA' : language === 'bn' ? 'bn-BD' : 'en-US';
    r.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInputValue(text);
      sendMessage(text);
    };
    r.onend = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    recognitionRef.current = r;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // TTS speak
  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window) || !voiceEnabled) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = language === 'ar' ? 'ar-SA' : language === 'bn' ? 'bn-BD' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    const v = selectVoice(voices, language);
    if (v) u.voice = v;
    u.pitch = 1.05;
    u.rate = 0.95;
    u.volume = 1.0;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [language, voiceEnabled]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  // Language detect
  const detectLang = useCallback((text: string) => {
    if (/[\u0600-\u06FF]/.test(text) && language !== 'ar') i18n.changeLanguage('ar');
    else if (/[\u0980-\u09FF]/.test(text) && language !== 'bn') i18n.changeLanguage('bn');
    else if (/[a-zA-Z]/.test(text) && language !== 'en') i18n.changeLanguage('en');
  }, [i18n, language]);

  // Send
  const sendMessage = useCallback(async (text: string = inputValue) => {
    if (!text.trim() || !chatSession) return;
    detectLang(text);
    if (isSpeaking) stopSpeaking();

    setMessages(prev => [...prev, {
      id: Date.now().toString(), text, sender: 'user', timestamp: new Date(),
    }]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await chatSession.sendMessage({ message: text });
      const reply = res.text || "I'm sorry, I didn't catch that.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), text: reply, sender: 'yusra', timestamp: new Date(),
      }]);
      if (voiceEnabled) setTimeout(() => speak(reply), 150);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: 'I apologize, I\'m having trouble connecting. Please try again.',
        sender: 'yusra', timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, chatSession, detectLang, isSpeaking, stopSpeaking, voiceEnabled, speak]);

  // File upload
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatSession) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), text: '', sender: 'user', timestamp: new Date(),
        attachment: { type: file.type, url: reader.result as string },
      }]);
      setIsTyping(true);
      try {
        const res = await chatSession.sendMessage({
          message: "I've uploaded a file for a visual quote. Please acknowledge and guide me.",
        });
        const reply = res.text || 'Thank you for the upload. Our team will review it shortly.';
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(), text: reply, sender: 'yusra', timestamp: new Date(),
        }]);
        if (voiceEnabled) setTimeout(() => speak(reply), 150);
      } catch {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Sorry, I had trouble processing that file. Please try again.',
          sender: 'yusra', timestamp: new Date(),
        }]);
      } finally {
        setIsTyping(false);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  }, [chatSession, voiceEnabled, speak]);

  const quickReplies = t('yusra.quickReplies', { returnObjects: true }) as string[];
  const hasSR = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <>
      {/* FAB */}
      <motion.div
        className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] ${dir === 'rtl' ? 'left-6' : 'right-6'} z-50`}
        initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.08 }}
      >
        <button
          onClick={() => setIsOpen(o => !o)}
          className="relative bg-black border-2 border-teal-500 text-teal-500 rounded-full p-4 shadow-[0_0_20px_rgba(45,212,191,0.55)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)] transition-all duration-300"
        >
          {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
          )}
        </button>
      </motion.div>

      {/* Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            dir={dir}
        className={`fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] ${dir === 'rtl' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-50 w-[min(calc(100vw-2rem),390px)] flex flex-col bg-[#090909]/96 backdrop-blur-2xl border border-teal-500/25 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden`}
            style={{ maxHeight: 'min(640px, calc(100svh - 130px - env(safe-area-inset-bottom, 0px)))' }}
          >
            {/* Header */}
            <div className="bg-black/50 px-4 py-3 border-b border-teal-500/20 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-700 to-teal-400 flex items-center justify-center overflow-hidden border border-teal-500/40">
                    {yusraIconUrl
                      ? <img src={yusraIconUrl} alt="Yusra" className="w-full h-full object-cover" loading="lazy" />
                      : <span className="text-black font-bold text-base">Y</span>}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-none">Yusra</p>
                  <p className="text-[10px] mt-0.5 text-teal-400/80">
                    {isSpeaking ? `🔊 ${t('yusra.speaking')}` : isListening ? `🎤 ${t('yusra.listening')}` : 'Virtual Customer Manager'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasTTS && (
                  <button
                    onClick={() => { if (isSpeaking) stopSpeaking(); setVoiceEnabled(v => !v); }}
                    title={voiceEnabled ? t('yusra.voiceOff') : t('yusra.voiceOn')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-all ${
                      voiceEnabled
                        ? 'bg-teal-500/15 border-teal-500/60 text-teal-400'
                        : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                    <span>{voiceEnabled ? t('yusra.voiceOn') : t('yusra.voiceMode')}</span>
                  </button>
                )}
                <Sparkles className="text-teal-500/40 w-4 h-4" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent min-h-0">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-1.5`}
                >
                  {msg.sender === 'yusra' && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mb-0.5 text-[9px] font-bold text-black">Y</div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-teal-600/90 text-white rounded-br-sm'
                      : 'bg-[#1a1a1a] border border-white/5 text-gray-200 rounded-bl-sm'
                  }`}>
                    {msg.attachment?.type.startsWith('image/') && (
                      <img src={msg.attachment.url} alt="upload" className="rounded-lg max-w-full h-auto mb-1.5" loading="lazy" />
                    )}
                    {msg.attachment?.type.startsWith('video/') && (
                      <video src={msg.attachment.url} controls className="rounded-lg max-w-full h-auto mb-1.5" />
                    )}
                    {msg.text && (
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0 [&>ul]:mb-1 [&>ul]:pl-4">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                    {msg.sender === 'yusra' && hasTTS && msg.text && (
                      <button
                        onClick={() => speak(msg.text)}
                        className="mt-1.5 flex items-center gap-1 text-[10px] text-teal-500/50 hover:text-teal-400 transition-colors"
                      >
                        <Volume2 size={9} /> Speak
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-end gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mb-0.5 text-[9px] font-bold text-black">Y</div>
                  <div className="bg-[#1a1a1a] border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                    {[0, 150, 300].map(delay => (
                      <span key={delay} className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {Array.isArray(quickReplies) && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none flex-shrink-0 border-t border-white/5">
                {quickReplies.map((r: string) => (
                  <button key={r} onClick={() => sendMessage(r)}
                    className="whitespace-nowrap px-3 py-1.5 bg-[#1a1a1a] border border-teal-500/25 text-teal-400 text-xs rounded-full hover:bg-teal-500/10 hover:border-teal-500/50 transition-all flex-shrink-0"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 bg-black/50 border-t border-teal-500/15 flex-shrink-0">
              <div className={`flex items-center gap-2 bg-[#181818] border rounded-full px-4 py-2.5 transition-all ${
                isListening ? 'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.25)]' : 'border-white/8 focus-within:border-teal-500/40'
              }`}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/mp4" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} title="Upload file"
                  className="text-gray-600 hover:text-teal-400 transition-colors flex-shrink-0">
                  <ImageIcon size={17} />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={t('yusra.typeMessage')}
                  dir={dir}
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-gray-600 min-w-0"
                />

                {hasSR && (
                  <button onClick={() => {
                    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
                    else { try { recognitionRef.current?.start(); setIsListening(true); } catch { /* ignore */ } }
                  }} title={isListening ? 'Stop' : 'Voice input'}
                    className={`flex-shrink-0 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-600 hover:text-teal-400'}`}>
                    {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                  </button>
                )}

                <button onClick={() => sendMessage()} disabled={!inputValue.trim()}
                  className="flex-shrink-0 text-teal-500 hover:text-teal-300 transition-colors disabled:opacity-25 disabled:cursor-not-allowed">
                  <Send size={17} />
                </button>
              </div>

              <AnimatePresence>
                {isListening && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-1.5 text-center text-[11px] text-red-400 flex items-center justify-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                    {t('yusra.listening')}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
