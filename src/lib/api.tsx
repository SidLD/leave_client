import axios from "axios";;
import { jsonDataHeader } from "./helper";
import { IUser, TeacherLoginType } from "@/types/userType";
import { UserRegisterFormData } from "@/pages/user/register";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:TeacherLoginType) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user-login`, data)
};

export const register = (data: IUser) => {
  return  axios.post(`${import.meta.env.VITE_API_URL}/user-register`, data, jsonDataHeader())
};

export const registerUser = (data: UserRegisterFormData) => {
  return  axios.post(`${import.meta.env.VITE_API_URL}/register`, data, jsonDataHeader())
};

export const updateUser = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/user/status`, data, jsonDataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const updateUserStatus = (data:any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/users/status`,  data, jsonDataHeader())
};

export const deleteUsers = (data:any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/users`,  data, jsonDataHeader())
};

export const getUsers = (data:any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        params:data, ...jsonDataHeader()
    })
};

export const deleteUser = (data:any) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/users/`, {
        data,
        ...jsonDataHeader()
    })
};

export const getUserSetting = (id:string) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/user-setting/${id}`, { ...jsonDataHeader()})
};

export const updateUserSetting = (data:any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-setting`,  data, jsonDataHeader())
};

export const updateUserPassword = (data:any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-password`, data, jsonDataHeader())
};


export const updateNotification = (id:string, data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/notifications/${id}`, data, jsonDataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};


export const getAllLeaveRecords = (data: any) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/user-leaves`, { params: data, ...jsonDataHeader()});
};

export const updateLeaveStatus = (id: string, data: any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-leave/${id}/status/`, data, jsonDataHeader());
};


export const getUserLeave = (id: string) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/user-leave/${id}`, { ...jsonDataHeader()});
};

// Fetch Leave Records
export const getLeaveRecords = (data: any) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/user-leaves`, { params: data, ...jsonDataHeader() });
};

// Create a Leave Record
export const createLeaveRecord = (data: any) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/user-leave`, data, jsonDataHeader());
};

// Update a Leave Record
export const updateLeaveRecord = (leaveId: string, data: any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-leave/${leaveId}`, data, jsonDataHeader());
};

// Delete a Leave Record
export const deleteLeaveRecord = (leaveId:string) => {
  return axios.delete(`${import.meta.env.VITE_API_URL}/user-leave/${leaveId}`, { ...jsonDataHeader() });
};
