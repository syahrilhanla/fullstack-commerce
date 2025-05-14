
import { create } from "zustand";

import { Category } from "@/types/Category.type";

interface CategoryState {
  categories: Category[];
  updateCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  updateCategories: (categories) => set({ categories }),
}));
