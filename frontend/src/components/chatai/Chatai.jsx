// Import necessary React hooks and components
import React, { useEffect, useRef, useState, useCallback } from 'react';

// Define the base URL for API requests, using environment variable or default to localhost
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Function to retrieve stored token from local storage
function getStoredToken() {
  return localStorage.getItem('token');
}

// Function to generate a local storage key based on the token
const LOCAL_KEY = (token) => `chats_single_${token || 'anon'}_default_main`;

// Function to render text with bold formatting using <strong> tags
function renderInlineBold(text) {
  const nodes = [];
  const re = /\*\*\*(.+?)\*\*\*/g; // Regular expression to match ***text***
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`t-${key++}`}>
          {text.slice(lastIndex, match.index)}
        </span>
      );
    }
    nodes.push(
      <strong key={`b-${key++}`}>
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }
  return nodes.length ? nodes : [text];
}

// Function to render message content, handling code blocks and bold text
function renderMessageContent(content) {
  const parts = content.split(/```/g); // Split content on triple backticks for code blocks
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      // Render code block
      return (
        <pre key={`code-${idx}`} className="rounded p-3 mt-2 mb-2 overflow-auto bg-gray-900 text-sm text-slate-100 font-mono">
          <code>{part}</code>
        </pre>
      );
    }

    // Render normal text with bold formatting
    const inline = renderInlineBold(part);
    return (
      <span key={`txt-${idx}`} className="whitespace-pre-wrap">
        {inline}
      </span>
    );
  });
}

// Main component for single chat application
export default function ChatAppSingle() {
  const token = getStoredToken(); // Retrieve token from local storage
  const [messages, setMessages] = useState([]); // State to store chat messages
  const [composerText, setComposerText] = useState(''); // State for text input in composer
  const [sending, setSending] = useState(false); // State to track if a message is being sent
  const [loading, setLoading] = useState(false); // State to track loading status
  const bottomRef = useRef(null); // Ref to track the bottom of the message list
  const abortRef = useRef(null); // Ref to handle aborting fetch requests

  // Ref to track the currently playing audio URL for cleanup
  const audioUrlRef = useRef(null);

  // Flag to determine if bot replies should auto-play audio
  const autoPlayBotAudio = false;

  // Function to fetch messages from the server or local storage
  const fetchMessages = useCallback(async () => {
    if (!token) {
      try {
        const raw = localStorage.getItem(LOCAL_KEY(token));
        if (raw) setMessages(JSON.parse(raw));
      } catch (e) {
        setMessages([]);
      }
      return;
    }

    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
    }
    const ac = new AbortController();
    abortRef.current = ac;
    setLoading(true);

    try {
      const qs = new URLSearchParams({ topic: 'default', threadId: 'main' });
      const res = await fetch(`${BASE}/api/chats?${qs.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        signal: ac.signal,
      });

      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      try {
        localStorage.setItem(LOCAL_KEY(token), JSON.stringify(Array.isArray(data) ? data : []));
      } catch (e) {}
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.warn('fetchMessages failed, using cache', err);
      try {
        const raw = localStorage.getItem(LOCAL_KEY(token));
        if (raw) setMessages(JSON.parse(raw));
        else setMessages([]);
      } catch (e) {
        setMessages([]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [token]);

  // Effect to fetch messages when the component mounts or token changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Effect to scroll to the bottom of the message list when messages change
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to send text to the /api/speak endpoint and play audio
  async function speakText(text) {
    if (!text) return;
    try {
      const res = await fetch(`${BASE}/api/speak`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.text().catch(() => '');
        console.error('TTS failed', res.status, err);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Cleanup previously created object URL
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch (e) {}
        audioUrlRef.current = null;
      }

      audioUrlRef.current = url;
      const audio = new Audio(url);
      audio.play().catch((err) => {
        // Autoplay may be blocked; log and ignore
        console.warn('Audio play blocked', err);
      });
      // Revoke URL when audio ends to avoid memory leak
      audio.onended = () => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
        if (audioUrlRef.current === url) audioUrlRef.current = null;
      };
    } catch (err) {
      console.error('speakText error', err);
    }
  }

  // Function to handle sending a message
  async function handleSend() {
    const text = composerText.trim();
    if (!text) return;
    setSending(true);
    setComposerText('');

    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      _temp: true,
    };

    setMessages((prev) => {
      const next = [...prev, tempMsg];
      try {
        localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      const res = await fetch(`${BASE}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
          'X-USER-ID': token || undefined,
        },
        body: JSON.stringify({ topic: 'default', threadId: 'main', content: text }),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessages((prev) => {
          const filtered = prev.filter((m) => m._id !== tempId);
          const sys = {
            _id: `sys_${Date.now()}`,
            sender: 'bot',
            content: body?.message || `Send failed (${res.status}).`,
            timestamp: new Date().toISOString(),
            _system: true,
          };
          const next = filtered.concat(sys);
          try {
            localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
          } catch (e) {}
          return next;
        });
        setSending(false);
        return;
      }

      const userMessage =
        body?.userMessage ??
        { _id: `s-${Date.now()}`, sender: 'user', content: text, timestamp: new Date().toISOString() };
      const botMessage =
        body?.botMessage ??
        { _id: `b-${Date.now()}`, sender: 'bot', content: body?.text ?? '', timestamp: new Date().toISOString() };

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m._id !== tempId);
        const next = withoutTemp.concat(userMessage, botMessage);
        try {
          localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Auto-play bot audio if flag is set and content exists
      if (autoPlayBotAudio && botMessage && botMessage.content) {
        speakText(botMessage.content);
      }
    } catch (err) {
      console.error('Send failed', err);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m._id !== tempId);
        const sys = {
          _id: `sys_${Date.now()}`,
          sender: 'bot',
          content: 'Send failed (network).',
          timestamp: new Date().toISOString(),
          _system: true,
        };
        const next = filtered.concat(sys);
        try {
          localStorage.setItem(LOCAL_KEY(token), JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    } finally {
      setSending(false);
    }
  }

  // Function to handle keydown events in the composer, sending message on Ctrl+Enter
  function onComposerKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!sending && composerText.trim()) handleSend();
    }
  }

  // Render message indicating no token found if token is absent
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-lg text-center">
          <h3 className="text-lg font-semibold mb-2">No token found</h3>
          <p className="text-sm text-gray-600">