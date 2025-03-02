import { z } from "zod";

export type IUser = {
  _id?: string,
  firstName: string,
  lastName: string,
  office: string,
  middleName?: string,
  employeeId:string,
  role: 'USER' |  'ADMIN',
  gender: 'MALE' | 'FEMALE',
  password: string,
  firstDayOfService: Date,
  position: string,
  salary: number,
  status: 'APPROVED'| 'REJECTED' | 'PENDING'
  officeDepartment: string;
  user: IUser;
  dateOfFiling: string;
}

export const userSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  office: z.string().min(1, "Office is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  role: z.enum(["USER", "ADMIN"]),
  gender: z.enum(["MALE", "FEMALE"]),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  firstDayOfService: z.date(),
  position: z.string().min(1, "Position is required"),
  salary: z.number().min(0, "Salary must be a positive number"),
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  officeDepartment: z.string().min(1, "Office department is required"),
  dateOfFiling: z.string().min(1, "Date of filing is required"),
});


export type TeacherLoginType = {
  username: string
  password: string
}
  