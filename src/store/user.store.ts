
import { StateCreator } from 'zustand'

export interface UsersSlice {
  users: string[],
  setUsers: (users: string[]) => void,
  getUsers: () => string[]
  
}

export const createUsersSlice: StateCreator<UsersSlice> = (set, get) => ({
  users: [],
  
  getUsers: () => {
    return get().users;
  },
  setUsers: (user: string[]) => {
    return set({ users: user });
  },
});