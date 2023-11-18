import { NewInstance } from "./BaseAPI";
const getUserByIDEP = "users/search-user/?page=&per_page=10"

const searchUsers = async (user: string, page: number) => {

    
    const response = await NewInstance.get(getUserByIDEP.slice(0, 18) + user + getUserByIDEP.slice(18, 24) + page + getUserByIDEP.slice(24));
    console.log(response);
    return response;
}
export default searchUsers;