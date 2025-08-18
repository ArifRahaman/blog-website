const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const bodyParser = require('body-parser');
const {ChatMessage}=require("./models/ChatMessage");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/auth");
const commentRoutes = require("./routes/commentRoutes");
const usersRoutes = require("./routes/users");
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTY0ZDY3NDcwNTE5NTVlYzhjMzg3YSIsImlhdCI6MTc1NDY4MDk2NiwiZXhwIjoxNzU1Mjg1NzY2fQ.pOM7qsd0E1hty5sB2qVwu8ekm6amkyHtewt2IDRn2-o
const app = express();
// app.use(express.json());
const {authMiddleware}=require("./middleware/auth");
app.use(cors());
// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/uploads', require('./routes/uploadRoutes'));


// Routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", usersRoutes);



const {
  GEMINI_KEY, // Still here, but not used for chat anymore
  DEEPGRAM_KEY,
  DID_API_KEY,
  MONGO_URI,
  GROQ_KEY // Make sure this is correctly loaded from your .env
} = process.env;
console.log({ GEMINI_KEY, DEEPGRAM_KEY, DID_API_KEY, MONGO_URI, GROQ_KEY });
const PORT = 5000;

// app.get('/api/chats', authMiddleware, async (req, res) => {
//   try {
//     // req.user is populated by the authMiddleware
//     res.json(req.user.chats);
//   } catch (err) {
//     console.error('Get chats error', err);
//     res.status(500).json({ error: 'Failed to retrieve chats' });
//   }
// });
app.get('/api/chats', authMiddleware, async (req, res) => {
  console.log('[GET /api/chats] hit; user=', req.user && req.user._id?.toString());
  try {
    const msgs = await ChatMessage.find({ userId: req.user._id }).sort('timestamp').lean();
    console.log('[GET /api/chats] returning', msgs.length, 'messages');
    return res.json(msgs || []);
  } catch (err) {
    console.error('GET /api/chats error', err);
    return res.status(500).json({ error: 'Failed to fetch chats' });
  }
});


// GET messages for a specific user (admin or debug)
// NOTE: add permission checks as needed. Here we allow only owner or isAdmin flag.
app.get('/api/chats/:userId', authMiddleware, async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    // simple permission check: owner or admin
    if (req.user._id.toString() !== requestedUserId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const msgs = await ChatMessage.find({ userId: requestedUserId }).sort('timestamp').lean();
    return res.json(msgs || []);
  } catch (err) {
    console.error('GET /api/chats/:userId error', err);
    return res.status(500).json({ error: 'Failed to fetch chats' });
  }
});


app.post('/api/chats', authMiddleware, async (req, res) => {
  const { content, sessionId } = req.body;
  if (!content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    // Save user's message
    const userDoc = await ChatMessage.create({
      userId: req.user._id,
      sessionId: sessionId || undefined,
      sender: 'user',
      content: content.trim()
    });

    // Call Groq for bot reply
    let botText = "Sorry, I'm having trouble answering right now.";
    try {
      const payload = {
        messages: [
          { role: 'system', content: "You are a helpful assistant." },
          { role: 'user', content: content.trim() }
        ],
        model: 'llama3-8b-8192', // adjust to your model string if needed
        temperature: 0.7,
        max_tokens: 650,
        top_p: 1,
        stream: false
      };

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_KEY}`
        },
        body: JSON.stringify(payload),
        // optionally set a timeout via AbortController if you expect long waits
      });

      if (groqRes.ok) {
        const json = await groqRes.json().catch(() => ({}));
        const text = json.choices?.[0]?.message?.content || json.text || null;
        if (text) botText = text;
        else console.warn('Groq returned unexpected shape:', json);
      } else {
        const errTxt = await groqRes.text().catch(() => '[no body]');
        console.error('Groq non-ok:', groqRes.status, errTxt);
      }
    } catch (gErr) {
      console.error('Error calling Groq API:', gErr);
    }

    // Save bot message
    const botDoc = await ChatMessage.create({
      userId: req.user._id,
      sessionId: sessionId || undefined,
      sender: 'bot',
      content: botText
    });

    // Return both messages so frontend can update in-place
    return res.status(201).json({
      userMessage: userDoc,
      botMessage: botDoc
    });
  } catch (err) {
    console.error('POST /api/chats error', err);
    return res.status(500).json({ error: 'Failed to save message' });
  }
});

// // -------------------- Groq proxy --------------------
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
app.get('/chats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const topicDisplay = req.query.topic || 'General';
    const subjectKey = subjectKeyFromDisplay(topicDisplay);
    const threadId = req.query.threadId || null;
    const limit = Math.min(Number(req.query.limit || 200), 1000);
    const page = Math.max(Number(req.query.page || 1), 1);

    const filter = { userId, subjectKey };
    if (threadId) filter.threadId = threadId;

    const docs = await ChatMessage.find(filter)
      .sort({ timestamp: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(docs);
  } catch (err) {
    console.error('GET /api/chats error', err);
    res.status(500).json({ error: 'failed' });
  }
});

// POST /api/chats  { topic: "Operating Systems", threadId?, content }
app.post('/chats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const topicDisplay = req.body.topic || 'General';
    const subjectKey = subjectKeyFromDisplay(topicDisplay);
    const threadId = req.body.threadId || String(Date.now()); // start a new thread by default
    const userContent = req.body.content;

    // create user message
    const userMsg = await ChatMessage.create({
      userId,
      sender: 'user',
      content: userContent,
      topic: topicDisplay,
      subjectKey,
      threadId,
      meta: {}
    });

    // Now call your /api/groq logic (classifier + model) to produce bot response...
    // Example: const botText = await generateReply(subjectKey, userContent);
    // For brevity, assume generateReply() returns an object { text, classifier }
    const { text: botText, classifier, model, systemPrompt } = await generateReply(subjectKey, userContent);

    // save bot message
    const botMsg = await ChatMessage.create({
      userId,
      sender: 'bot',
      content: botText,
      topic: topicDisplay,
      subjectKey,
      threadId,
      meta: {
        classifier,
        model,
        systemPrompt
      }
    });

    // return both messages so client can append canonical ones
    res.json({ userMessage: userMsg, botMessage: botMsg });
  } catch (err) {
    console.error('POST /api/chats error', err);
    res.status(500).json({ error: 'failed' });
  }
});

// SUBJECT_MAP (use your version; I kept it as you provided)
const SUBJECT_MAP = {
  operating_systems: {
    display: 'Operating Systems',
    system: 'If the questions is asked not related to operating systems, you kindly say sorry I cannot answer that. are a skilled operating systems tutor. Explain clearly and step-by-step. Show intermediate steps and reasoning explicitly when solving problems.',
    model: 'llama3-70b-8192',
    temperature: 0.0,
    max_tokens: 1200
  },
  coding: {
    display: 'Coding',
    system: 'If the questions is asked not related to coding, you kindly say sorry I cannot answer that. You are a programming mentor. Provide concise, correct code examples and short explanations. Prefer reproducible code blocks.',
    model: 'llama3-70b-8192',
    temperature: 0.1,
    max_tokens: 1200
  },
  computer_networks: {
    display: 'Computer Networks',
    system: 'If the questions is asked not related to computer networks, you kindly say sorry I cannot answer that. You are a computer networks expert. Provide clear explanations and examples related to networking concepts.',
    model: 'llama3-70b-8192',
    temperature: 0.0,
    max_tokens: 1200
  },
  databases: {
    display: 'Databases',
    system: 'If the questions is asked not related to databases, you kindly say sorry I cannot answer that. You are a databases expert. Provide clear explanations and examples related to database concepts.',
    model: 'llama3-70b-8192',
    temperature: 0.0,
    max_tokens: 1200
  },
  default: {
    display: 'General',
    system: 'You are a helpful assistant.',
    model: 'llama3-8b-8192',
    temperature: 0.7,
    max_tokens: 650
  }
};

function normalizeSubject(raw) {
  if (!raw) return 'default';
  return String(raw).toLowerCase().trim().replace(/\s+/g, '_');
}

function chooseSubjectCfg(subject) {
  const key = normalizeSubject(subject);
  return SUBJECT_MAP[key] || SUBJECT_MAP.default;
}

// ---- Classifier (model-based) ----
// Asks the model to return ONLY a JSON object like:
// {"on_topic": true, "confidence": 0.91, "reason": "kernel is OS concept"}
// temperature = 0 for deterministic behavior.

const CLASSIFIER_MODEL = 'llama3-8b-8192'; // small/fast classifier model; change if needed
const CLASSIFIER_MAX_TOKENS = 120;
const MIN_CONFIDENCE = 0.45; // tune this: raise to be stricter, lower to be more permissive

async function groqApiCall(payload) {
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify(payload)
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* non-json responses are handled by caller */ }
  return { ok: res.ok, status: res.status, text, json };
}

function extractJsonString(s) {
  // pull first {...} substring to handle stray text around JSON
  const m = s && s.match(/\{[\s\S]*\}$/) || s && s.match(/\{[\s\S]*?\}/);
  return m ? m[0] : null;
}

async function classifyOnTopic(subject, message) {
  const topicName = chooseSubjectCfg(subject).display || normalizeSubject(subject);
  const system = `You are a strict topic classifier. Given a topic name and a user's message, decide if the message is ON-TOPIC for that topic. Reply ONLY with a JSON object and no extra text. Example:
{"on_topic": true, "confidence": 0.92, "reason": "short reason"}.
Confidence should be a number between 0 and 1. Keep reason concise.`;

  const user = `Topic: ${topicName}\nMessage: ${message}\nReturn ONLY the JSON object.`;

  const payload = {
    model: CLASSIFIER_MODEL,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.0,
    max_tokens: CLASSIFIER_MAX_TOKENS,
    top_p: 1,
    stream: false
  };

  try {
    const { ok, text } = await groqApiCall(payload);
    if (!ok) throw new Error(`Classifier call failed (status ${text?.slice?.(0,120)})`);

    // extract JSON block and parse
    const jsonText = extractJsonString(text);
    if (!jsonText) throw new Error('Classifier returned non-JSON output');

    const parsed = JSON.parse(jsonText);
    const on_topic = !!parsed.on_topic;
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0;
    const reason = parsed.reason || '';

    return { on_topic, confidence, reason, raw: parsed };
  } catch (err) {
    // classifier failed: log and return null to allow fallback behavior upstream
    console.error('Topic classifier failed:', err);
    return null;
  }
}

// ---- Main handler ----
const MAX_PROMPT_LENGTH = 30_000;
const MAX_MAX_TOKENS = 4_000;

app.post('/api/groq', async (req, res) => {
  try {
    if (!GROQ_KEY) return res.status(500).json({ error: 'Server not configured (missing GROQ_KEY)' });

    const { subject = 'default', prompt, stream = false, temperature: overrideTemp, max_tokens: overrideMaxTokens } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    const trimmed = prompt.trim();
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      return res.status(400).json({ error: `Prompt too long (max ${MAX_PROMPT_LENGTH} chars)` });
    }

    const cfg = chooseSubjectCfg(subject);

    // run model-based classifier
    const classification = await classifyOnTopic(subject, trimmed);

    if (classification === null) {
      // classifier failed - fallback policy: ACCEPT (so users don't get blocked).
      // If you prefer fail-closed (reject), return a 500 or topic_mismatch here.
      console.warn('Classifier error — falling back to accept (consider changing fallback behavior).');
    } else {
      // we have a classification result — enforce it
      if (!classification.on_topic || (classification.confidence < MIN_CONFIDENCE)) {
        return res.status(400).json({
          error: 'topic_mismatch',
          message: `Sorry — I can only assist you with ${cfg.display}. Please switch topic or rephrase your question.`,
          reason: classification.reason || 'classified off-topic',
          confidence: classification.confidence
        });
      }
    }

    const temperature = (typeof overrideTemp === 'number' ? overrideTemp : cfg.temperature);
    const max_tokens = Math.min(typeof overrideMaxTokens === 'number' ? overrideMaxTokens : cfg.max_tokens, MAX_MAX_TOKENS);

    const payload = {
      model: cfg.model,
      messages: [
        { role: 'system', content: cfg.system },
        { role: 'user', content: trimmed }
      ],
      temperature,
      max_tokens,
      top_p: 1,
      stream: !!stream
    };

    const groqRes = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!groqRes.ok) {
      let bodyText;
      try { bodyText = await groqRes.text(); } catch (e) { bodyText = '<could not read body>'; }
      console.error('Groq API error', groqRes.status, bodyText);
      return res.status(502).json({ error: 'Groq API error', status: groqRes.status, detail: bodyText });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');

      const reader = groqRes.body.getReader();
      const encoder = new TextEncoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(encoder.decode(value));
      }
      return res.end();
    } else {
      const groqJson = await groqRes.json();
      const text = groqJson.choices?.[0]?.message?.content ?? null;
      const usage = groqJson.usage ?? null;
      if (!text) {
        console.warn('Groq returned no content', JSON.stringify(groqJson).slice(0, 200));
        return res.status(502).json({ error: 'Groq returned no content', raw: groqJson });
      }

      return res.json({
        text,
        model: cfg.model,
        usage
      });
    }
  } catch (err) {
    console.error('Groq proxy exception', err);
    return res.status(500).json({ error: 'Groq proxy failed' });
  }
});
// app.post('/api/groq', async (req, res) => {
//   const { prompt } = req.body;
//   if (!prompt) return res.status(400).json({ error: 'Prompt required' });

//   try {
//     const payload = {
//       messages: [
//         { role: 'system', content: "You are a helpful assistant." },
//         { role: 'user', content: prompt }
//       ],
//       model: 'llama3-8b-8192',
//       temperature: 0.7,
//       max_tokens: 650,
//       top_p: 1,
//       stream: false
//     };

//     const groqFetchRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${GROQ_KEY}`
//       },
//       body: JSON.stringify(payload)
//     });

//     if (!groqFetchRes.ok) {
//       const txt = await groqFetchRes.text();
//       console.error('Groq API error', groqFetchRes.status, txt);
//       return res.status(500).json({ error: 'Groq API error' });
//     }

//     const groqJson = await groqFetchRes.json();
//     const text = groqJson.choices?.[0]?.message?.content || null;
//     if (!text) {
//       console.warn('Groq returned no text', groqJson);
//       return res.status(500).json({ error: 'Groq returned no content' });
//     }
//     res.json({ text });
//   } catch (err) {
//     console.error('Groq proxy exception', err);
//     res.status(500).json({ error: 'Groq proxy failed' });
//   }
// });

// --- Deepgram TTS ---
// Deepgram TTS endpoint (fixed)
app.post('/api/speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const dgRes = await fetch(
      'https://api.deepgram.com/v1/speak?model=aura-asteria-en',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${process.env.DEEPGRAM_KEY}`,
        },
        body: JSON.stringify({ text }),
      }
    );

    if (!dgRes.ok) {
      // read text (JSON or plain) and log it
      const errText = await dgRes.text().catch(() => '<no-body>');
      console.error('Deepgram Error (status=%d): %s', dgRes.status, errText);

      // Forward the error details to client (useful while debugging)
      return res.status(500).json({ error: 'TTS failed', detail: errText, status: dgRes.status });
    }

    // success: read arrayBuffer and stream audio bytes
    const arrayBuffer = await dgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // You can also inspect content-type returned by Deepgram
    const contentType = dgRes.headers.get('content-type') || 'audio/mpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    return res.end(buffer);
  } catch (err) {
    console.error('TTS generation failed', err);
    res.status(500).json({ error: 'TTS generation failed', detail: err.message });
  }
});


// Connect to MongoDB
mongoose.connect("mongodb+srv://arifrahaman2606:NTambC6dzWTscSn1@mernstack.emb8nvx.mongodb.net/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => console.log("Server running on port 5000"));
})


.catch((err) => {
  console.error("MongoDB connection error:", err);
});
