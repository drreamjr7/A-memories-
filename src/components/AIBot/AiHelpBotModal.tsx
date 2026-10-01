import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const API_KEY_STORAGE_KEY = 'lumora_gemini_api_key';

const BOT_SYSTEM_INSTRUCTION = `You are Flora, the AI Botanical Curator and Memory Muse for LUMORA — Memories in Motion.
You speak with gentle elegance, poetic clarity, and deep knowledge of floriography (the language and symbolism of flowers), fine-art photography, memory journaling, and soundtrack pairing.
You help users explore the flower collections (Crimson Antique Rose, Midnight Violet Orchid, Golden Alpine Meadow, Pristine White Lotus, Rain Hydrangea, Blush Peony), create poetic album captions, recommend musical moods, and navigate Lumora's cinematic features (Memory Mode, 3D Carousel, Timeline, Fullscreen Lightbox). Keep responses evocative, concise, and helpful.`;

const PRESET_KNOWLEDGE: Record<string, string> = {
  symbolism: `🌸 **Symbolism in Lumora's Floral Gallery:**
- **Crimson Velvet Rose**: Timeless passion, enduring devotion, and memories that linger through the seasons.
- **Midnight Violet Orchid**: Mystery, rare beauty, solitude, and ethereal luminescence beneath starlight.
- **Pristine White Lotus**: Serenity, rebirth, and spiritual purity rising untouched from still waters.
- **Golden Sunflower & Wildflowers**: Joy, sun-drenched freedom, vitality, and nostalgia for golden hours.
- **Celestial Blue Hydrangea**: Heartfelt emotion, deep understanding, gratitude, and refreshing summer rain.
- **Blush Peony**: Romance, prosperity, bashful elegance, and fleeting morning light.`,

  caption: `✨ **Poetic Captions for Your Flower Album:**
1. *"We blossom not to be seen, but to exist in the quiet grace of the morning dew."*
2. *"Under the golden hour, every petal remembers the warmth of the sun before the dusk softly fell."*
3. *"Like water lilies upon dark obsidian ponds, stillness is where true beauty unfolds."*
4. *"A whisper of violet in the midnight canopy — some moments were meant only for the stars."*`,

  soundtrack: `🎵 **Soundtrack Mood Recommendations:**
- For **Velvet & Dew (Roses & Peonies)**: *Golden Meadow Reverie* (warm acoustic ambient drone in Dm9).
- For **Midnight Orchids & Lotus**: *Midnight Orchid Echoes* or *Lotus Obsidian Silence* (mystical, low-pass synth pad with gentle spatial detune).
- For **Rain Hydrangeas**: *Raindrops on Hydrangea* (soothing, gentle piano notes cascading like fresh rain).`,

  features: `💡 **Navigating Lumora:**
- **3D Memory Carousel**: Rotate through floral collections using mouse drag, mouse wheel, or left/right arrow keys.
- **Play Memories (Memory Mode)**: Hit Space or click 'Play Memories' for a fullscreen Ken Burns slideshow synced to procedural ambient music.
- **Create Album**: Upload your own flower photos (JPG, PNG, WEBP) and sound files directly into your browser's private IndexedDB storage.
- **Timeline**: Browse memories chronologically by month and year.`
};

export const AiHelpBotModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  });
  const [inputKey, setInputKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [showKeySecret, setShowKeySecret] = useState<boolean>(false);
  const [keyStatus, setKeyStatus] = useState<'none' | 'saved' | 'validating' | 'valid' | 'invalid'>('none');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Greetings, wanderer. I am **Flora**, your botanical curator and memory muse. How may I assist your voyage through these floral memories? Ask me about flower symbolism, poetic captions, soundtrack pairings, or Lumora features.`,
      timestamp: 'Now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (apiKey) {
      setKeyStatus('saved');
    }
  }, [apiKey]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleSaveKey = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) return;

    setKeyStatus('validating');
    try {
      // Test the key with gemini-3.8-flash
      const ai = new GoogleGenAI({
        apiKey: trimmed,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Hello, respond with only: OK'
      });

      if (response && response.text) {
        localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
        setApiKey(trimmed);
        setKeyStatus('valid');
        setShowKeyInput(false);
        setInputKey('');

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'bot',
            text: `✨ **Gemini API Key Connected!** You are now powered by live Google Gemini intelligence for dynamic conversations and custom creative generation.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        setKeyStatus('invalid');
      }
    } catch (err) {
      console.warn('Key validation failed:', err);
      // Still allow saving in case of sandbox network restrictions
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
      setApiKey(trimmed);
      setKeyStatus('saved');
      setShowKeyInput(false);
      setInputKey('');
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setKeyStatus('none');
    setShowKeyInput(false);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Try Gemini API if key is present
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const res = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: text,
          config: {
            systemInstruction: BOT_SYSTEM_INSTRUCTION
          }
        });

        const reply = res.text || 'I listened carefully to your thought, but the winds rustled the leaves. Could you rephrase?';
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
        return;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local muse:', err);
      }
    }

    // Client-side intelligent fallback response generator
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('symbol') || lower.includes('meaning') || lower.includes('flower') || lower.includes('orchid') || lower.includes('rose') || lower.includes('lotus')) {
        reply = PRESET_KNOWLEDGE.symbolism;
      } else if (lower.includes('caption') || lower.includes('quote') || lower.includes('poem') || lower.includes('words')) {
        reply = PRESET_KNOWLEDGE.caption;
      } else if (lower.includes('music') || lower.includes('song') || lower.includes('soundtrack') || lower.includes('audio')) {
        reply = PRESET_KNOWLEDGE.soundtrack;
      } else if (lower.includes('how') || lower.includes('carousel') || lower.includes('feature') || lower.includes('memory mode') || lower.includes('help')) {
        reply = PRESET_KNOWLEDGE.features;
      } else {
        reply = `🌸 *"In the garden of memory, every blossom has a tale."*\n\nI can share the floriography symbolism of our flowers, generate poetic reflections for your albums, or help you find the perfect ambient soundtrack. Connect your **Gemini API Key** in the header above to unlock limitless custom conversations!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Flora AI Curator"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-neutral-900/95 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[700px] text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-cinematic font-bold text-white tracking-wide">
                  Flora AI Curator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border bg-amber-500/10 border-amber-500/30 text-amber-300">
                  {apiKey ? 'Gemini 3.8 Flash' : 'Preset Muse'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Botanical symbolism, poetic captions & memory guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                apiKey
                  ? 'bg-neutral-800/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{apiKey ? 'Key Set' : 'Paste API Key'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close Bot"
              aria-label="Close Bot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* API KEY CONFIGURATION DRAWER */}
        {showKeyInput && (
          <div className="p-4 bg-neutral-950 border-b border-white/[0.08] text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Gemini API Key Configuration
              </span>
              {apiKey && (
                <button
                  onClick={handleRemoveKey}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Key</span>
                </button>
              )}
            </div>

            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Paste your personal Google Gemini API key to enable live AI responses. Keys are stored solely in your browser's private <code className="text-amber-300">localStorage</code>.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type={showKeySecret ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder={apiKey ? '••••••••••••••••••••••••••••••••' : 'AIzaSy...'}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 pr-9 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowKeySecret(!showKeySecret)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showKeySecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveKey}
                disabled={!inputKey.trim() || keyStatus === 'validating'}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {keyStatus === 'validating' ? 'Verifying...' : 'Save Key'}
              </button>
            </div>

            {keyStatus === 'invalid' && (
              <p className="text-red-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Invalid API key or network error. Please double-check the key.
              </p>
            )}
          </div>
        )}

        {/* CHAT MESSAGES VIEWPORT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex gap-3 text-xs sm:text-sm ${isBot ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-neutral-800 text-white'
                  }`}
                >
                  {isBot ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`relative group max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    isBot
                      ? 'bg-neutral-800/60 border border-white/[0.06] text-neutral-200'
                      : 'bg-amber-400 text-neutral-950 font-medium'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  {isBot && (
                    <button
                      onClick={() => copyToClipboard(m.id, m.text)}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/40 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 pl-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Flora is gathering botanical thoughts...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPT CHIPS */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-neutral-950/40 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <button
            onClick={() => sendMessage('What is the symbolism of Midnight Orchids & White Lotus?')}
            className="px-2.5 py-1 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 whitespace-nowrap cursor-pointer transition-colors"
          >
            🌸 Flower Symbolism
          </button>
          <button
            onClick={() => sendMessage('Write a poetic memory caption for velvet crimson roses')}
            className="px-2.5 py-1 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 whitespace-nowrap cursor-pointer transition-colors"
          >
            ✨ Poetic Captions
          </button>
          <button
            onClick={() => sendMessage('Which soundtrack pairs best with golden sunflowers?')}
            className="px-2.5 py-1 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 whitespace-nowrap cursor-pointer transition-colors"
          >
            🎵 Music Recommendations
          </button>
          <button
            onClick={() => sendMessage('How do I explore albums in 3D Memory Mode?')}
            className="px-2.5 py-1 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 whitespace-nowrap cursor-pointer transition-colors"
          >
            💡 Memory Guide
          </button>
        </div>

        {/* INPUT FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-3 sm:p-4 border-t border-white/[0.08] bg-neutral-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Flora about flowers, captions, moods, or memory storytelling..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center transition-transform active:scale-95 disabled:opacity-40 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
