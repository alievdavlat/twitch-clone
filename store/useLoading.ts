import { create } from 'zustand'

interface useLoadingState {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useLoading = create<useLoadingState>((set) => ({
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}))


