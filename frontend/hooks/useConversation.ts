"use client";
import { create } from 'zustand';
import { Claim } from '@/lib/types';

interface ConversationState {
  messages: Claim[];
  addMessage: (msg: Claim) => void;
  prependMessages: (msgs: Claim[]) => void;
  setMessages: (msgs: Claim[]) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  prependMessages: (msgs) => set((s) => ({ messages: [...msgs, ...s.messages] })),
  setMessages: (msgs) => set({ messages: msgs })
}));


