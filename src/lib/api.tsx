import { AppType } from '../../../teacher_portal_server/src/index'
import { hc } from 'hono/client'

import { TeacherLoginType } from "@/types/userType";
import { RegisterUserType } from "./interface";

console.log(import.meta.env.VITE_API_URL);

// Create Hono client
const client = hc<AppType>('http://localhost:8787/')

// Login function
export const login = (data: TeacherLoginType) => {
  return client.login.$post({ json: data });
};

// Register function
export const register = (data: RegisterUserType) => {
  return client.register.$post({ json: data });
};

// Update user function
export const updateUser = (data: any) => {
  return client.user.status.$put({ json: data });
};

// Get users function
export const getUsers = () => {
  return client.users.$get();
};

// Delete user function
export const deleteUser = (data: any) => {
  return client.user.$delete({ json: data });
};
