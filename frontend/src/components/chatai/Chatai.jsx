import React, { useEffect, useRef, useState, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const DEFAULT_TOPIC = 'default';
const DEFAULT_THREAD_ID = 'main';
const CONTENT_TYPE_JSON = 'application/json';
const AUDIO_PLAY_ERROR = 'Audio play blocked';
const SEND_FAILED_NETWORK = 'Send failed (network).';
const SEND_FAILED_STATUS = 'Send failed';

function getStoredToken() {
  return localStorage.getItem('token');
}

const getLocalStorageKey = (token) => `chats_single_${token || 'anon'}_default_main`;

function renderInlineBold(text) {
  const nodes = [];
  const boldRegex = /\*\*\*(.+?)\*\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<span key={`t-${key++}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    nodes.push(<strong key={`b-${key++}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes.length ? nodes : [text];
}

function renderMessageContent(content) {
  const parts = content.split(/```/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return (
        <pre key={`code-${idx}`} className="rounded p-3 mt-2 mb-2 overflow-auto bg-gray-900 text-sm text-slate-100 font-mono">
          <code>{part}</code>
        </pre>
      );
    }
    const inline = renderInlineBold(part);
    return (
      <span key={`txt-${idx}`} className="whitespace-pre-wrap">
        {inline}
      </span>
    );
  });
}

export default function ChatAppSingle() {
  const token = getStoredToken();
  const [messages, setMessages] = useState([]);
  const [composerText, setComposerText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const abortRef = useRef(null);
  const audioUrlRef = useRef(null);
  const autoPlayBotAudio = false;

  const fetchMessages = useCallback(async () => {
    if (!token) {
      loadMessagesFromLocalStorage();
      return;
    }

    abortPreviousFetch();
    const abortController = new AbortController();
    abortRef.current = abortController;
    setLoading(true);

    try {
      const response = await fetchMessagesFromServer(abortController);
      const data = await response.json();
      updateMessages(data);
      saveMessagesToLocalStorage(data);
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function speakText(text) {
    if (!text) return;

    try {
      const response = await fetch(`${BASE_URL}/api/speak`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        logTTSError(response);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      playAudio(url);
    } catch (err) {
      console.error('speakText error', err);
    }
  }

  async function handleSend() {
    const text = composerText.trim();
    if (!text) return;

    setSending(true);
    setComposerText('');
    const tempId = `temp_${Date.now()}`;
    const tempMsg = createTempMessage(tempId, text);

    updateMessagesWithTemp(tempMsg);

    try {
      const response = await sendMessageToServer(text);
      const body = await response.json().catch(() => ({}));

      if (!response.ok) {
        handleSendError(tempId, body, response.status);
        return;
      }

      const userMessage = createUserMessage(body, text);
      const botMessage = createBotMessage(body);

      updateMessagesWithResponse(tempId, userMessage, botMessage);
      autoPlayBotAudioIfEnabled(botMessage);
    } catch (err) {
      handleSendNetworkError(tempId);
    } finally {
      setSending(false);
    }
  }

  function onComposerKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!sending && composerText.trim()) handleSend();
    }
  }

  if (!token) {
    return renderNoTokenMessage();
  }

  function loadMessagesFromLocalStorage() {
    try {
      const raw = localStorage.getItem(getLocalStorageKey(token));
      if (raw) setMessages(JSON.parse(raw));
    } catch (e) {
      setMessages([]);
    }
  }

  function abortPreviousFetch() {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch (e) {}
    }
  }

  async function fetchMessagesFromServer(abortController) {
    const queryString = new URLSearchParams({ topic: DEFAULT_TOPIC, threadId: DEFAULT_THREAD_ID });
    return await fetch(`${BASE_URL}/api/chats?${queryString.toString()}`, {
      headers: getRequestHeaders(),
      signal: abortController.signal,
    });
  }

  function getRequestHeaders() {
    return {
      'Content-Type': CONTENT_TYPE_JSON,
      Authorization: token ? `Bearer ${token}` : undefined,
      'X-USER-ID': token || undefined,
    };
  }

  function updateMessages(data) {
    setMessages(Array.isArray(data) ? data : []);
  }

  function saveMessagesToLocalStorage(data) {
    try {
      localStorage.setItem(getLocalStorageKey(token), JSON.stringify(Array.isArray(data) ? data : []));
    } catch (e) {}
  }

  function handleFetchError(err) {
    if (err.name === 'AbortError') return;
    console.warn('fetchMessages failed, using cache', err);
    loadMessagesFromLocalStorage();
  }

  function scrollToBottom() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  function logTTSError(response) {
    const errorText = response.text().catch(() => '');
    console.error('TTS failed', response.status, errorText);
  }

  function playAudio(url) {
    cleanupPreviousAudioUrl();
    audioUrlRef.current = url;
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.warn(AUDIO_PLAY_ERROR, err);
    });
    audio.onended = () => {
      cleanupAudioUrl(url);
    };
  }

  function cleanupPreviousAudioUrl() {
    if (audioUrlRef.current) {
      try {
        URL.revokeObjectURL(audioUrlRef.current);
      } catch (e) {}
      audioUrlRef.current = null;
    }
  }

  function cleanupAudioUrl(url) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {}
    if (audioUrlRef.current === url) audioUrlRef.current = null;
  }

  function createTempMessage(tempId, text) {
    return {
      _id: tempId,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      _temp: true,
    };
  }

  function updateMessagesWithTemp(tempMsg) {
    setMessages((prev) => {
      const next = [...prev, tempMsg];
      try {
        localStorage.setItem(getLocalStorageKey(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }

  async function sendMessageToServer(text) {
    return await fetch(`${BASE_URL}/api/chats`, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({ topic: DEFAULT_TOPIC, threadId: DEFAULT_THREAD_ID, content: text }),
    });
  }

  function handleSendError(tempId, body, status) {
    setMessages((prev) => {
      const filtered = prev.filter((m) => m._id !== tempId);
      const sysMessage = createSystemMessage(body, status);
      const next = filtered.concat(sysMessage);
      try {
        localStorage.setItem(getLocalStorageKey(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setSending(false);
  }

  function createSystemMessage(body, status) {
    return {
      _id: `sys_${Date.now()}`,
      sender: 'bot',
      content: body?.message || `${SEND_FAILED_STATUS} (${status}).`,
      timestamp: new Date().toISOString(),
      _system: true,
    };
  }

  function createUserMessage(body, text) {
    return (
      body?.userMessage ?? {
        _id: `s-${Date.now()}`,
        sender: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }
    );
  }

  function createBotMessage(body) {
    return (
      body?.botMessage ?? {
        _id: `b-${Date.now()}`,
        sender: 'bot',
        content: body?.text ?? '',
        timestamp: new Date().toISOString(),
      }
    );
  }

  function updateMessagesWithResponse(tempId, userMessage, botMessage) {
    setMessages((prev) => {
      const withoutTemp = prev.filter((m) => m._id !== tempId);
      const next = withoutTemp.concat(userMessage, botMessage);
      try {
        localStorage.setItem(getLocalStorageKey(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }

  function autoPlayBotAudioIfEnabled(botMessage) {
    if (autoPlayBotAudio && botMessage && botMessage.content) {
      speakText(botMessage.content);
    }
  }

  function handleSendNetworkError(tempId) {
    console.error(SEND_FAILED_NETWORK);
    setMessages((prev) => {
      const filtered = prev.filter((m) => m._id !== tempId);
      const sysMessage = createNetworkErrorMessage();
      const next = filtered.concat(sysMessage);
      try {
        localStorage.setItem(getLocalStorageKey(token), JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }

  function createNetworkErrorMessage() {
    return {
      _id: `sys_${Date.now()}`,
      sender: 'bot',
      content: SEND_FAILED_NETWORK,
      timestamp: new Date().toISOString(),
      _system: true,
    };
  }

  function renderNoTokenMessage() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded shadow max-w-lg text-center">
          <h3 className="text-lg font-semibold mb-2">No token found</h3>
          <p className="text-sm text-gray-600"></p>
        </div>
      </div>
    );
  }
}