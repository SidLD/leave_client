import axios from "axios";;
import { jsonDataHeader } from "./helper";
import { IUser, TeacherLoginType } from "@/types/userType";
import { ILeaveSetting } from "@/types/leaveType";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:TeacherLoginType) => {
    return axios.post(`${import.meta.env.VITE_API_URL}/user-login`, data)
};

export const register = (data: IUser) => {
  return  axios.post(`${import.meta.env.VITE_API_URL}/user-register`, data, jsonDataHeader())
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

export const getUsers = (data:any) => {
    return axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        params:data, ...jsonDataHeader()
    })
};

export const deleteUser = (data:any) => {
    return axios.delete(`${import.meta.env.VITE_API_URL}/users/${data}`, {
        data,
        ...jsonDataHeader()
    })
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


// Position
export const getLeaveSetting = (data:any) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/leave-settings`, {
      params:data, ...jsonDataHeader()
  })
};
export async function updateLeaveSetting(id:string,data:ILeaveSetting) {
  return await axios.put(`${import.meta.env.VITE_API_URL}/leave-setting/${id}`, data, jsonDataHeader())
}

export async function createLeaveSetting(data: any) {
  return await axios.post(`${import.meta.env.VITE_API_URL}/leave-setting`, data, jsonDataHeader())
}

export async function deleteLeaveSetting(id:string) {
  return await axios.delete(`${import.meta.env.VITE_API_URL}/leave-setting/${id}`, { ...jsonDataHeader()})
}


//User Leave
// User Leave Management
export const getUserLeaves = (data: any) => {
  return axios.get(`${import.meta.env.VITE_API_URL}/user-leaves`, {
    params: data,
    ...jsonDataHeader(),
  });
};

export const createUserLeave = (data: any) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/user-leave`, data, jsonDataHeader());
};

export const updateUserLeave = (id: string, data: any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-leave/${id}`, data, jsonDataHeader());
};

export const deleteUserLeave = (id: string) => {
  return axios.delete(`${import.meta.env.VITE_API_URL}/user-leave/${id}`, { ...jsonDataHeader() });
};

export const batchCreateUserLeave = (data: any) => {
  return axios.post(`${import.meta.env.VITE_API_URL}/user-leaves/batch-create`, data, jsonDataHeader());
};

export const batchUpdateUserLeave = (data: any) => {
  return axios.put(`${import.meta.env.VITE_API_URL}/user-leaves/batch-update`, data, jsonDataHeader());
};