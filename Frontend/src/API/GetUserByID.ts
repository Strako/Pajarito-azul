import { NewInstance } from "./BaseAPI";
const getUserByIDEP= "users/get-data-user-byId"

const getUserByID = async (id:string) =>{
    const data = {
        userId: id
    };

    const response = await NewInstance.post(getUserByIDEP, data);
    console.log(response);
    return response;
}
export default getUserByID;