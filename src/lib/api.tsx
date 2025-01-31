import axios from "axios";;
import {  formDataHeader, jsonDataHeader } from "./helper";
import { IRegisterUser, TeacherLoginType } from "@/types/userType";
import { IPosition } from "@/types/positionType";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:TeacherLoginType) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/users/login`, data)
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const register = (data: IRegisterUser) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/users/register`, data, formDataHeader())
      .then((res:any) => {
        resolve(res.data);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
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
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/users`, {
            params:data, ...jsonDataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const deleteUser = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_API_URL}/users/${data}`, {
            data,
            ...jsonDataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
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
export async function getPositions() {
  return await axios.get(`${import.meta.env.VITE_API_URL}/positions`, {
      ...jsonDataHeader()
  }).then(({data}:any ) => {
    if(data.positions.length > 0){
      return data.positions
    }
    return []
  })
  .catch((err) => {
    throw Error(err)
  })
}

export async function updatePosition(data: IPosition) {
  return await axios.put(`${import.meta.env.VITE_API_URL}/positions/${data._id}`, data, jsonDataHeader())
}

export async function createPosition(data: IPosition) {
  return await axios.post(`${import.meta.env.VITE_API_URL}/positions`, data, jsonDataHeader())
}

export async function deletePosition(id:string) {
  return await axios.delete(`${import.meta.env.VITE_API_URL}/positions/${id}`, { ...jsonDataHeader()})
}

