import { IFile } from "./fileType"
import { IPosition } from "./positionType"

export type TeacherLoginType = {
  username: string
  password: string
}
  

export type IRegisterUser = {
  username: string
  birthday: Date
  address: string
  email: string
  contact:string
  educational_attainment: string
  position: string
  role: 'USER'
  file?: any
}

export type IUser = {
    status: string;
    _id: string
    username: string
    code: string
    birthday: Date
    address: string
    email: string
    contact:string
    educational_attainment: string
    position: IPosition
    role: 'ADMIN'| 'USER'
    password?: string
    file?: IFile
}