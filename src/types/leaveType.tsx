import { IUser } from "./userType"

export type IUserLeave = {
    user: IUser,
    used: Number,
    carryOver: Number,
    leave: ILeaveSetting
  }
  
  export type ILeaveSetting = {
    _id: string,
    name: string,
    defaultCredit: Number,
    carryOver: Boolean,
    gender: string,
    accrual: 'YEARLY' | 'MONTHLY' | 'QUATERLY' | 'WEEKLY'
  }
  
  export type ILeaveRecord = {
    _id: string,
    userLeave: IUserLeave,
    dateStart: Date,
    dateEnd: Date,
    credit: Number
    leave: ILeaveSetting  // Dont Update this
  }