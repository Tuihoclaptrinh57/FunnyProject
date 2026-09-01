'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export type ConnectionState = 'loading' | 'connected' | 'offline';
export type Comment = {
  id: string;
  author: string;
  content: string;
  quote: string;
  createdAt: string;
  resolved: boolean;
  range?: { start: number; end: number };
};

function genId() { return Math.random().toString(36).slice(2, 9); }

export function useCollab(initialTitle = 'Untitled document', initialContent = '') {
  const clientId = useMemo(() => 'client-' + genId(), []);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [connection, setConnection] = useState<ConnectionState>('loading');
  const [pending, setPending] = useState(0);
  const [comments, setComments] = useState<Comment[]>([
    { id: genId(), author: 'client-ax3', content: 'Đoạn này nên tách 2 câu.', quote: 'không xung đột', createdAt: '2m ago', resolved: false },
    { id: genId(), author: clientId, content: 'Đã sửa.', quote: 'tự đồng bộ khi có mạng', createdAt: 'now', resolved: false },
  ]);

  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const pushUndo = (prev: string) => { undoStack.current.push(prev); if (undoStack.current.length > 50) undoStack.current.shift(); redoStack.current = []; };
  const undo = () => { const prev = undoStack.current.pop(); if (prev !== undefined) { redoStack.current.push(content); setContent(prev); } };
  const redo = () => { const next = redoStack.current.pop(); if (next !== undefined) { undoStack.current.push(content); setContent(next); } };

  useEffect(() => { const t = setTimeout(() => setConnection('connected'), 900); return () => clearTimeout(t); }, []);

  const handleContentChange = (next: string) => {
    if (connection === 'offline') setPending((p) => p + 1);
    else if (pending > 0) setTimeout(() => setPending(0), 600);
    pushUndo(content);
    setContent(next);
  };

  const setOffline = () => { setConnection('offline'); setPending(1); };
  const setConnected = () => { setConnection('connected'); setPending(0); };

  const addComment = (text: string, quote: string, range?: { start: number; end: number }) => {
    if (!text.trim() || !quote.trim()) return;
    setComments((c) => [{ id: genId(), author: clientId, content: text, quote, createdAt: 'now', resolved: false, range }, ...c]);
  };
  const toggleResolve = (id: string) => setComments((c) => c.map((x) => x.id === id ? { ...x, resolved: !x.resolved } : x));
  const deleteComment = (id: string) => setComments((c) => c.filter((x) => x.id !== id));
  const [selection, setSelection] = useState<{ text: string; range: { start: number; end: number } } | null>(null);

  return { clientId, title, setTitle, content, handleContentChange, setContent, connection, pending, setOffline, setConnected, comments, addComment, toggleResolve, deleteComment, selection, setSelection, undo, redo, canUndo: undoStack.current.length > 0, canRedo: redoStack.current.length > 0 };
}
