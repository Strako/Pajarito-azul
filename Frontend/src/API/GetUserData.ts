import {NewInstance} from './BaseAPI';
const getUserDataEP= 'users/get-data-user'


const getUserData = async () => {
   
	const response = await NewInstance.get(getUserDataEP);
    console.log(response);
    return response;
};

export default getUserData;