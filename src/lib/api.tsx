import axios from "axios";;
import { dataHeader } from "./helper";
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
      .post(`${import.meta.env.VITE_API_URL}/users/register`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const updateUser = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/user/status`, data, dataHeader())
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
            params:data, ...dataHeader()
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
        .delete(`${import.meta.env.VITE_API_URL}/user`, {
            data,
            ...dataHeader()
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
      .put(`${import.meta.env.VITE_API_URL}/notifications/${id}`, data, dataHeader())
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
      ...dataHeader()
  })
}

export async function updatePosition(data: IPosition) {
  return await axios.put(`${import.meta.env.VITE_API_URL}/positions`, {
      data, ...dataHeader()
  })
}

export async function createPosition(data: IPosition) {
  return await axios.put(`${import.meta.env.VITE_API_URL}/positions`, {
      data, ...dataHeader()
  })
}

