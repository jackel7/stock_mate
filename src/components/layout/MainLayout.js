"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AgentFab } from "../agent/AgentFab";
import { AgentModal } from "../agent/AgentModal";
import { cn } from "@/lib/utils";

export function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile toggle
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  const [agentOpen, setAgentOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onCloseMobile={() => setSidebarOpen(false)} 
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
        isCollapsed ? "md:pl-20" : "md:pl-64"
      )}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             {children}
          </div>
        </main>
      </div>

      <div className="absolute"> 
        {/* Render FAB and Modal outside the main flow but inside layout */}
        {!agentOpen && <AgentFab onClick={() => setAgentOpen(true)} />}
        <AgentModal isOpen={agentOpen} onClose={() => setAgentOpen(false)} />
      </div>
    </div>
  );
}
