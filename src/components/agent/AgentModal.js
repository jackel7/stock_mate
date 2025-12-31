"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export function AgentModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am your Inventory AI Agent. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: "user", content: inputValue }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL?.trim();

    try {
      if (webhookUrl) {
          const response = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ message: inputValue, history: newMessages })
          });

          if (!response.ok) {
              if (response.status === 404) {
                 throw new Error("404 Not Found. Your URL might be missing the '/webhook/...' path.");
              }
              const text = await response.text();
              throw new Error(`Server returned ${response.status}: ${text.slice(0, 100)}`);
          }

          let data;
          try {
             data = await response.json();
          } catch (jsonError) {
             const text = await response.text();
             console.error("Received non-JSON response:", text);
             throw new Error("Received HTML/Text instead of JSON. Check your Webhook URL.");
          }

          // Support multiple n8n return formats
          const reply = data.output || data.text || data.message || (typeof data === 'string' ? data : "Received response.");
          
          setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } else {
          // Mock response if no URL provided
          setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I am an interface for the external agent. Please configure NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local to connect me to n8n." }
            ]);
          }, 1000);
      }
    } catch (error) {
        console.error("Agent Error:", error);
        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Connection Error: ${error.message}` }
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-center pointer-events-none p-4 sm:p-0">
       {/* Overlay only blocks clicks on itself, but we want to allow clicking outside if modal is not full screen? 
           Actually, usually modals are blocking. But this is an "embedded agent modal". 
           Let's make it a popup in the corner or a centered modal. 
           User said "embedded agent modal". I'll make it a corner popup or centered. 
           Let's go with Bottom Right or Centered. Centered is standard for 'modal'. */}
       
      <div 
        className="pointer-events-auto relative flex w-full max-w-md flex-col overflow-hidden rounded-lg border bg-white shadow-2xl sm:m-4 max-h-[600px] h-[500px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-blue-600 p-4 text-white">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex w-full items-start space-x-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Bot className="h-5 w-5" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-800 shadow-sm"
                )}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                   <User className="h-5 w-5" />
                 </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about inventory, trends..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
