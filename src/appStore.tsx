import create from "zustand";
let appStore = (set: (arg0: (state: any) => { dopen: any; }) => any) => ({
    dopen: false,
    updateOpen: (dopen: boolean) => set((state: boolean) => ({ dopen: dopen })),
});

export const useAppStore = create(appStore);
