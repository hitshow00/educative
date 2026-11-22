'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { todayIso } from '@/lib/progress';

const DAILY_LIMIT = 10;
const QUOTA_KEY = 'examquiz_tutor_quota_v1';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface AiTutorWidgetProps {
  level?: string;
  subject?: string;
  chapter?: string;
}

function readQuota(): { date: string; count: number } {
  const today = todayIso();
  if (typeof window === 'undefined') return { date: today, count: 0 };
  try {
    const raw = window.localStorage.getItem(QUOTA_KEY);
    if (!raw) return { date: today, count: 0 };
    const parsed = JSON.parse(raw) as { date: string; count: number };
    if (parsed.date !== today) return { date: today, count: 0 };
    return parsed;
  } catch {
    return { date: today, count: 0 };
  }
}

export function AiTutorWidget({ level, subject, chapter }: AiTutorWidgetProps) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedToday, setUsedToday] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUsedToday(readQuota().count);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const remaining = Math.max(0, DAILY_LIMIT - usedToday);

  const quickPrompts =
    lang === 'ar'
      ? [
          'اشرح لي هذا الدرس بطريقة بسيطة جداً',
          'أعطني مثالاً تطبيقياً محلولاً',
          'ما هي أهم الفخاخ في الامتحان؟',
        ]
      : [
          'Explique-moi ce chapitre simplement',
          'Donne-moi un exemple résolu',
          'Quels sont les pièges à l’examen ?',
        ];

  async function sendMessage(textToSend: string) {
    const clean = textToSend.trim();
    if (!clean || loading) return;

    if (remaining <= 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text:
            lang === 'ar'
              ? 'وصلت للحد اليومي (10 أسئلة مجانية). عد غداً للمتابعة!'
              : 'Tu as atteint tes 10 questions gratuites du jour. Reviens demain !',
        },
      ]);
      return;
    }

    const nextHistory: ChatMessage[] = [...messages, { role: 'user', text: clean }];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: clean,
          lang,
          context: { level, subject, chapter },
          history: messages.slice(-6),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string; configured?: boolean };

      if (data.reply) {
        setMessages([...nextHistory, { role: 'assistant', text: data.reply }]);
        if (data.configured !== false) {
          const nextCount = usedToday + 1;
          setUsedToday(nextCount);
          window.localStorage.setItem(
            QUOTA_KEY,
            JSON.stringify({ date: todayIso(), count: nextCount })
          );
        }
      } else {
        setMessages([
          ...nextHistory,
          { role: 'assistant', text: data.error || 'Erreur de connexion.' },
        ]);
      }
    } catch {
      setMessages([
        ...nextHistory,
        {
          role: 'assistant',
          text:
            lang === 'ar'
              ? 'خطأ في الاتصال بالشبكة. حاول مجدداً.'
              : 'Erreur réseau. Vérifie ta connexion et réessaie.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bouton flottant discret */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 end-5 z-40 inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-indigo-600 text-white shadow-lg shadow-slate-900/20 px-4 py-3 text-xs sm:text-sm font-bold transition-all"
        >
          <Bot className="w-4 h-4 text-amber-300" />
          <span>{lang === 'ar' ? 'اسأل الأستاذ الذكي' : 'Demander au Prof IA'}</span>
        </button>
      )}

      {/* Fenêtre de chat Prof IA */}
      {open && (
        <div className="fixed bottom-4 end-4 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
          {/* En-tête */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                  {lang === 'ar' ? 'الأستاذ الذكي (Prof IA)' : 'Prof IA ExamQuiz'}
                </p>
                <p className="text-[10px] text-slate-300 truncate">
                  {chapter || subject || (lang === 'ar' ? 'مساعد المراجعة بالفرنسية والعربية والدارجة' : 'FR • العربية • Darija')} •{' '}
                  {remaining}/{DAILY_LIMIT}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Zone de messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 min-h-[240px]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-xs text-slate-700 leading-relaxed">
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {lang === 'ar'
                        ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
                        : 'Salut ! Pose-moi ta question en Français, Arabe ou Darija.'}
                    </span>
                  </p>
                  <p>
                    {lang === 'ar'
                      ? 'يمكنك سؤالي عن أي قاعدة، تمرين أو فخ في الامتحان وسأشرحه لك خطوة بخطوة.'
                      : 'Je connais ton chapitre actuel et je peux t’expliquer étape par étape sans stress.'}
                  </p>
                </div>

                {/* 3 Boutons rapides 1-clic */}
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      className="text-start rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 px-3 py-2 text-xs font-semibold transition-colors"
                    >
                      ✨ {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm whitespace-pre-line leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>{lang === 'ar' ? 'الأستاذ يكتب الشرح...' : 'Le Prof IA rédige...'}</span>
              </div>
            )}
          </div>

          {/* Barre de saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'ar' ? 'اكتب سؤالك هنا (عربية، دارجة، فرنسية)...' : 'Ta question (FR, Arabe, Darija)...'
              }
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
