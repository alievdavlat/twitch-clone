import { create } from 'zustand'

export enum ChatVariant { 
  CHAT = 'CHAT', 
  COMMUNITY = 'COMMUNITY'

}

interface chatState {
  collapsed: boolean
  variant:ChatVariant
  onExpand: () => void
  onCollapse: () => void
  onChangeVariant: (variant:ChatVariant) => void
}

export const useChatSidebar = create<chatState>((set) => ({
  collapsed: false,
  onExpand: () => set({ collapsed: false }),
  onCollapse: () => set({ collapsed: true }),
  variant:ChatVariant.CHAT,
  onChangeVariant: (variant) => set({ variant }),
}))


