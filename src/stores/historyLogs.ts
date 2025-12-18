import { create } from "zustand";

type LogEntry = {
  id: string
  timestamp: string
  message: string
  type: "info" | "success" | "error" | "warning"
}

interface LogStore {
  logs: LogEntry[]
  addLog: (message: string, type?: LogEntry["type"]) => void
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (message, type = "info") =>
    set((state) => {
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      };
      return { logs: [...state.logs, newLog].slice(0, 50) };
    }),
}))
