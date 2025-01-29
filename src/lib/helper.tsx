import { useStore } from "@/store/app.store"

export const dataHeader = () => {
    const {getToken} = useStore()
    return { headers: { "x-access-token": getToken(), "Content-Type": "multipart/form-data" } }
}
export const fetchProvincs = async (code:string) => {
    try {
        const data = await fetch(`https://psgc.gitlab.io/api/provinces/${code}`)
            .then((result) => result.json())
        return (
            {label: data.name, code:data.code}
        ) 
    } catch (error) {
        console.log(error)
    }
}

export const fetchCity = async (code:string) => {
    try {
        const data = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${code}`)
            .then((result) => result.json())
        return (
            {label: data.name, code:data.code}
        ) 
    } catch (error) {
        console.log(error)
    }
}
