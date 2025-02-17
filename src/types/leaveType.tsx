import { IUser } from "./userType"

export type IUserLeave = {
    _id: string,
    user: IUser,
    used: number,
    carryOver: number,
    credit:number,
    leave: ILeaveSetting
  }
  
  export type ILeaveSetting = {
    _id?: string,
    name: string,
    defaultCredit: number,
    carryOver: boolean,
    gender: 'MALE' | 'FEMALE' | 'ALL',
    accrual: 'YEARLY' | 'MONTHLY' | 'QUARTERLY' | 'WEEKLY'
  }
  
  export type ILeaveRecord = {
    _id: string,
    userLeave: IUserLeave,
    dateStart: Date,
    dateEnd: Date,
    credit: number
    leave: ILeaveSetting  // Dont Update this
  }


