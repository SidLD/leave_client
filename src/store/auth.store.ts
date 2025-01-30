
import { IUser } from '@/types/userType';
import { StateCreator } from 'zustand'

export interface UserSlice {
  user: IUser | null,
  setUser: (user: IUser) => void,
  getUser: () => IUser | null,

  token: string | null,
  setToken: (str: string) => void,
  getToken: () => string | null,
  getRole:  () => string | null,
  decode:   (str: string) => string | null,
  getUserInfo: () => any | null,
  getExpiration: () => number,
  clear: () => void;
  
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => ({
  user: null,
  socket: null,
  
  getUser: () => {
    return get().user;
  },
  setUser: (user: IUser) => {
    return set({ user: user });
  },

  token: null,
  setToken: (str: string) => {
    localStorage.setItem('token', `Bearer ${str}`)
  },
  getToken: () => {
    return localStorage.getItem('token')
  },
  
  getLocalToken: () => {
    return localStorage.getItem('token');
  },
  getRole: () => {
    const token = get().getToken();
    if(!token) {
      return null;
    }
    const decodedData = get().decode(token) as any
    if(decodedData) {
      return decodedData.role;
    }
    return null
 },

  decode: (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  },

  getUserInfo: () => {
    const token = get().getToken();
    if (token) {
      const decodedData = get().decode(token); 
      return decodedData;
    }
    return null;
  },

  getExpiration: () => {
    const token = get().getToken();
    if (token) {
      const decodedData = get().decode(token) as any
      return decodedData.exp;
    }
    return 0;
  },

  clear: () => {
    localStorage.clear()
    window.location.reload();
  }
});