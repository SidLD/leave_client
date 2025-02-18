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
    accrual: "YEARLY" |  "MONTHLY" | "WEEKLY"| "QUARTERLY"
  }
  
  export type ILeaveRecord = {
    _id: string,
    userLeave: IUserLeave,
    dateStart: Date,
    dateEnd: Date,
    credit: number,
    isProcess: boolean,
    leaveType: 'WHOLE_DAY' | 'HALF_DAY_MORNING' | 'HALF_DAY_AFTERNOON',
    leave: ILeaveSetting 
}


