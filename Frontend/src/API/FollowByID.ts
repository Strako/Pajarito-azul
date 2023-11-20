import { NewInstance } from "./BaseAPI";
const followByIDEP = 'users/follow-user';

const followByID = async (userid:string) =>{
    console.log(userid);
    const data = {
        userToFollow: parseInt(userid)
    };

    const response = await NewInstance.post(followByIDEP, data);
    console.log(response);
    return response;
};

export default followByID;