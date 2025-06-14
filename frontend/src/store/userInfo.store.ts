import { create } from "zustand";

type UserInfo = {
  id: number;
  name: string;
  email: string;
  userName: string;
  phone?: string;
};

interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  clearUserInfo: () => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUserInfo: () => set({ userInfo: null }),
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));