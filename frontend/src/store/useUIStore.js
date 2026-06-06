import { create } from 'zustand';

const useUIStore = create((set) => ({
  isMobileMenuOpen: false,
  isDemoModalOpen: false,
  isLoading: false,

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openDemoModal: () => set({ isDemoModalOpen: true }),
  closeDemoModal: () => set({ isDemoModalOpen: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useUIStore;
