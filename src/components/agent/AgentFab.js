"use client";

import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AgentFab({ onClick }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110 z-50 bg-blue-600 hover:bg-blue-700"
      size="icon"
    >
      <MessageSquareText className="h-7 w-7 text-white" />
    </Button>
  );
}
