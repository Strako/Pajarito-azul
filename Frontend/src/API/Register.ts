import {NewInstance} from './BaseAPI';
const registerEP = 'users/sign-up';


const signUp = async (name:string, user:string, password:string) => {
   
    const data = {
        name: name,
        user: user,
        password: password
    };

	const response = await NewInstance.post(registerEP, data);
    console.log(response);
    return response;
};

export default signUp;