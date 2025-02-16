import { ILeaveSetting } from '@/types/leaveType';
import { StateCreator } from 'zustand';

export interface LeaveSlice {
  leaves: ILeaveSetting[];
  setLeaves: (leaves: ILeaveSetting[]) => void;
  getLeaves: () => ILeaveSetting[];
  selectedLeave:ILeaveSetting | null;
  setSelectedLeave: (leave: ILeaveSetting|null) => void;
  getSelectedLeave: () => ILeaveSetting | null;
}

export const createLeaveSlice: StateCreator<LeaveSlice> = (set, get) => ({
  leaves: [],
  getLeaves: () => {
    return get().leaves;
  },
  setLeaves: (newLeaves: ILeaveSetting[]) => {
    set({ leaves: newLeaves });
  },
  selectedLeave:null,
  setSelectedLeave: (leave: ILeaveSetting | null) => {
    set({selectedLeave: leave})
  },
  getSelectedLeave: () => {
    return get().selectedLeave;
  }
});
