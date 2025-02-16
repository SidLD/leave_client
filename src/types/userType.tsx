import { IUserLeave } from "./leaveType"

export type IUser = {
  userLeave: IUserLeave[]
  _id?: string,
  firstName: string,
  lastName: string,
  middleName?: string,
  username:string,
  role: 'USER' |  'ADMIN',
  gender: 'MALE' | 'FEMALE',
  password?: string
  
}


export type TeacherLoginType = {
  username: string
  password: string
}
  