import { NewInstance } from "./BaseAPI";
const getUserByIDEP= "users/search-user/?page=1&per_page=10"

const searchUser = async (user:string) =>{


    const response = await NewInstance.get(getUserByIDEP.slice(0, 18) + user + getUserByIDEP.slice(18));
    console.log(response);
    return response;
}
export default searchUser;