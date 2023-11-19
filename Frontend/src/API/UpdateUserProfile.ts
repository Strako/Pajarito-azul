import { NewInstance } from "./BaseAPI";
const editUserProfileEP = '/users/update-user';

const editUserProfile = async (user:string, name:string, image:string, description:string) =>{
    const data = {
        user: user,
        name: name,
        userImage:image,
        description: description

    };

    const response = await NewInstance.post(editUserProfileEP, data);
    console.log(response);
    return response;
};

export default editUserProfile;