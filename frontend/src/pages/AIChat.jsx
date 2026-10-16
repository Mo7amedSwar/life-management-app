import React, { useState, useRef, useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { Send, Trash2, Bot, User, Zap, Key } from 'lucide-react'

const SYSTEM_PROMPT = `أنت مساعد شخصي متخصص في التعلم والإنتاجية لطالب مصري يدرس بجانب الكلية.

خطته للسنتين القادمتين:
- Phase 0 (أكتوبر-نوفمبر 2026): بناء نظام الإنتاجية، LinkedIn، Python أساسيات
- Phase 1 (ديسمبر 2026 - فبراير 2027): Linux + Python احترافي + Git
- Phase 2 (مارس-يونيو 2027): Cloud (AWS) + Docker + Kubernetes → Job-Ready
- Phase 3 (يوليو-أكتوبر 2027): AI/ML + LLMs + MLOps
- Phase 4 (نوفمبر 2027 - مارس 2028): CI/CD + Terraform + Ansible + Observability
- Phase 5 (أبريل-أكتوبر 2028): Senior AI Platform Engineer + Personal Brand

الهدف النهائي: Senior AI Platform Engineer / MLOps Engineer
يدرس: DevOps, AI/ML, MLOps, Cloud, Linux, Business, Personal Branding, ريادة أعمال

قواعد:
- رد باللغة العربية دائماً مع المصطلحات الإنجليزية للمجال
- كن محدداً وعملياً في ردودك
- شجعه دائماً وذكّره بهدفه
- اذا سأل عن تقنية معينة، اربطها بمكانها في خطته
- أعطِ نصائح قابلة للتطبيق فوراً`

const SUGGESTIONS = [
  'ما الخطوة التالية في الرود ماب؟',
  'ساعدني أفهم Docker بسرعة',
  'كيف أنظم وقتي اليوم؟',
  'ما أهم مشروع أبدأ به؟',
  'كيف أبني LinkedIn profile قوي؟',
  'نصيحة للتغلب على الكسل',
]

const AIChat = () => {
  const { geminiApiKey, chatHistory, addChatMessage, clearChatHistory } = useAppStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const { setGeminiApiKey } = useAppStore()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')

    addChatMessage({ role: 'user', content: msg, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) })
    setLoading(true)

    if (!geminiApiKey) {
      setTimeout(() => {
        addChatMessage({
          role: 'model',
          content: '⚠️ لم يتم إدخال Gemini API Key بعد. اضغط على أيقونة المفتاح في الأعلى لإضافة الـ API Key مجاناً من Google AI Studio.',
          time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        })
        setLoading(false)
      }, 500)
      return
    }

    try {
      const history = chatHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            ...history,
            { role: 'user', parts: [{ text: msg }] }
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        })
      })

      const data = await response.json()
      if (data.error) throw new Error(data.error.message)
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'عذراً، لم أفهم السؤال.'
      addChatMessage({ role: 'model', content: reply, time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) })
    } catch (err) {
      addChatMessage({
        role: 'model',
        content: `❌ خطأ في الاتصال: ${err.message}. تأكد من صحة الـ API Key.`,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      })
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">المساعد الذكي</h1>
            <p className="text-slate-400 text-xs">مدرب شخصي للرحلة التقنية بتاعتك</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowKeyInput(!showKeyInput)}
            className={`p-2 rounded-lg transition-colors ${geminiApiKey ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}
            title="إعداد API Key">
            <Key size={18} />
          </button>
          <button onClick={clearChatHistory} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="مسح المحادثة">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showKeyInput && (
        <div className="bg-slate-800 border border-amber-500/30 rounded-xl p-4 mb-4">
          <p className="text-amber-400 text-sm font-medium mb-2">🔑 Gemini API Key</p>
          <p className="text-slate-400 text-xs mb-3">احصل على API Key مجاناً من <a href="https://aistudio.google.com/apikey" target="_blank" className="text-indigo-400 underline">Google AI Studio</a></p>
          <div className="flex gap-2">
            <input value={tempKey || geminiApiKey} onChange={e => setTempKey(e.target.value)}
              placeholder="AIza..."
              type="password"
              className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-600 focus:border-indigo-500" />
            <button onClick={() => { setGeminiApiKey(tempKey); setShowKeyInput(false) }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">حفظ</button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center mb-4">
              <Zap size={36} className="text-indigo-400" />
            </div>
            <h2 className="text-white font-bold text-lg mb-2">ازيك! أنا مساعدك الشخصي 🤖</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-sm">بعرف خطتك للسنتين الجايين وهساعدك تسير عليها. اسألني أي حاجة!</p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-right bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs p-3 rounded-xl transition-all hover:border-indigo-500">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-gradient-to-br from-purple-600 to-indigo-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'}`}>
                {msg.content}
              </div>
              <span className="text-slate-600 text-xs px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex-shrink-0 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex gap-3">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="اسألني أي حاجة عن خطتك..."
          className="flex-1 bg-slate-800 border border-slate-700 focus:border-indigo-500 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-colors" />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors">
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default AIChat
