import { NextResponse, type NextRequest } from 'next/server';

interface TutorRequestBody {
  message?: string;
  lang?: 'fr' | 'ar';
  context?: {
    level?: string;
    subject?: string;
    chapter?: string;
  };
  history?: Array<{ role: 'user' | 'assistant'; text: string }>;
}

/**
 * Route API sécurisée POST /api/tutor — Agent Prof IA ExamQuiz (Google Gemini)
 * La clé `GEMINI_API_KEY` reste strictement côté serveur (jamais exposée au client).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TutorRequestBody;
    const message = String(body.message || '').trim().slice(0, 800);
    const lang = body.lang === 'ar' ? 'ar' : 'fr';
    const ctx = body.context || {};

    if (!message) {
      return NextResponse.json(
        { error: lang === 'ar' ? 'الرسالة فارغة.' : 'Le message est vide.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback propre et pédagogique si la clé GEMINI_API_KEY n'est pas encore configurée
    if (!apiKey || apiKey.includes('votre-cle')) {
      const setupReply =
        lang === 'ar'
          ? `أهلاً بك! أنا **الأستاذ الذكي (Prof IA)** الخاص بـ ExamQuiz.ma.\n\nلتفعيل الإجابات الذكية المباشرة في **${ctx.subject || 'المادة'} (${ctx.chapter || 'الدرس'})**، يجب إضافة مفتاح Google Gemini المجاني (\`GEMINI_API_KEY\`) في إعدادات Vercel أو \`.env.local\` (مجاناً من aistudio.google.com).`
          : `Bonjour ! Je suis le **Prof IA ExamQuiz**.\n\nPour activer mes réponses intelligentes en direct sur **${ctx.subject || 'ce cours'} (${ctx.chapter || 'chapitre'})**, il suffit d’ajouter votre clé gratuite Google Gemini (\`GEMINI_API_KEY\`) dans \`.env.local\` et dans Vercel → Environment Variables (gratuite sur aistudio.google.com).`;

      return NextResponse.json({ reply: setupReply, configured: false });
    }

    const systemInstruction = `Tu es "Prof IA ExamQuiz", un professeur marocain bienveillant, clair et rigoureux qui aide les élèves à préparer les examens officiels au Maroc (2ème Bac National, 1ère Bac Régional, 3ème Année Collège, 6ème Primaire).

Contexte actuel de l'élève :
- Niveau : ${ctx.level || 'Maroc'}
- Matière : ${ctx.subject || 'Général'}
- Chapitre : ${ctx.chapter || 'Révision'}

Règles strictes :
1. Réponds dans la MÊME langue que la question de l'élève (Français, Arabe standard, ou Darija marocaine claire si l'élève écrit en Darija). Si la langue est ambiguë, utilise : ${lang === 'ar' ? 'Arabe clair' : 'Français clair'}.
2. Sois concis, structuré en étapes numérotées, et pédagogiquement encourageant.
3. Mets en avant les formules clés et les pièges classiques des examens nationaux/régionaux marocains.
4. Refuse poliment toute demande hors-scolaire (jeux vidéo, politique, etc.) et recentre sur la révision.`;

    const recentHistory = (body.history || []).slice(-6).map((item) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.text.slice(0, 600) }],
    }));

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [...recentHistory, { role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 650,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[Prof IA Gemini Error]', geminiRes.status, errText);
      return NextResponse.json(
        {
          error:
            lang === 'ar'
              ? 'تعذر الاتصال بالأستاذ الذكي مؤقتاً. حاول بعد قليل.'
              : 'Le Prof IA est momentanément indisponible. Réessayez dans un instant.',
        },
        { status: 502 }
      );
    }

    const data = (await geminiRes.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      (lang === 'ar'
        ? 'لم أتمكن من توليد إجابة. أعد صياغة سؤالك من فضلك.'
        : 'Je n’ai pas pu formuler de réponse. Reformule ta question.');

    return NextResponse.json({ reply, configured: true });
  } catch (err) {
    console.error('[Prof IA Exception]', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur Prof IA.' },
      { status: 500 }
    );
  }
}
