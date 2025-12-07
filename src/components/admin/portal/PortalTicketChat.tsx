"use client";

/**
 * 💬 Portal Ticket Chat
 * Ticket-Chat-Komponente mit Nachrichten und Admin-Antwort
 * 
 * @phase 1.7
 * @author Agent-B (AI Center)
 */

import { useEffect, useState, useRef } from "react";

interface Message {
  id: number;
  ticket_id: number;
  sender_type: "customer" | "admin" | "system";
  sender_id: number | null;
  sender_name: string | null;
  content: string;
  attachments: string | null;
  created_at: string;
}

interface PortalTicketChatProps {
  ticketId: number;
  ticketStatus: string;
  onStatusChange?: (newStatus: string) => void;
}

export function PortalTicketChat({ ticketId, ticketStatus, onStatusChange }: PortalTicketChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/admin/portal-tickets/${ticketId}/messages`);
      if (!response.ok) throw new Error("Fehler beim Laden der Nachrichten");
      const data = await response.json();
      setMessages(data.data?.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/admin/portal-tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error("Fehler beim Senden");

      const data = await response.json();
      setMessages([...messages, data.data.message]);
      setNewMessage("");
      
      // Update ticket status if needed
      if (data.data.ticketStatusUpdated && onStatusChange) {
        onStatusChange(data.data.newStatus);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Senden");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: string) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getSenderConfig = (senderType: string) => {
    switch (senderType) {
      case "admin":
        return {
          bgClass: "bg-blue-500/10 border-blue-500/30",
          textClass: "text-blue-400",
          align: "justify-end",
          label: "Admin",
        };
      case "system":
        return {
          bgClass: "bg-gray-500/10 border-gray-500/30",
          textClass: "text-gray-400",
          align: "justify-center",
          label: "System",
        };
      default:
        return {
          bgClass: "bg-[#1a1d24] border-[#272a33]",
          textClass: "text-[#8a8a8a]",
          align: "justify-start",
          label: "Kunde",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-[#111217] border border-[#272a33] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 text-red-400">
        ⚠️ {error}
        <button onClick={fetchMessages} className="ml-4 underline">Erneut versuchen</button>
      </div>
    );
  }

  const isClosed = ticketStatus === "closed" || ticketStatus === "resolved";

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-[#272a33] bg-[#111217] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#272a33] bg-[#1a1d24]">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-[#8a8a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium text-[#f4f4f4]">Ticket-Verlauf</span>
          <span className="text-sm text-[#6b6b6b]">({messages.length} Nachrichten)</span>
        </div>
        <button
          onClick={fetchMessages}
          className="p-2 rounded-lg hover:bg-[#272a33] transition-colors text-[#8a8a8a] hover:text-[#f4f4f4]"
          title="Aktualisieren"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#6b6b6b]">
            Noch keine Nachrichten
          </div>
        ) : (
          messages.map((message) => {
            const config = getSenderConfig(message.sender_type);
            
            if (message.sender_type === "system") {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="px-4 py-2 rounded-full bg-[#1a1d24] border border-[#272a33] text-sm text-[#6b6b6b]">
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className={`flex ${config.align}`}>
                <div className={`max-w-[70%] rounded-xl border p-4 ${config.bgClass}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-medium ${config.textClass}`}>
                      {message.sender_name || config.label}
                    </span>
                    <span className="text-xs text-[#6b6b6b]">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-[#f4f4f4] whitespace-pre-wrap">{message.content}</p>
                  {message.attachments && (
                    <div className="mt-2 pt-2 border-t border-[#272a33]">
                      <span className="text-xs text-[#6b6b6b]">📎 Anhang vorhanden</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#272a33] p-4 bg-[#1a1d24]">
        {isClosed ? (
          <div className="text-center text-[#6b6b6b] py-2">
            Dieses Ticket ist {ticketStatus === "resolved" ? "gelöst" : "geschlossen"}. 
            Keine weiteren Nachrichten möglich.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Antwort schreiben..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-[#111217] border border-[#272a33] text-[#f4f4f4] placeholder-[#6b6b6b] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleSendMessage(e);
                  }
                }}
              />
              <span className="absolute bottom-2 right-3 text-xs text-[#6b6b6b]">
                Ctrl+Enter zum Senden
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Senden...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Senden
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PortalTicketChat;







