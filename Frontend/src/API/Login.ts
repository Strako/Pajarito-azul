import {NewInstance} from './BaseAPI';
const loginEP= 'users/sign-in';


const signIn = async (user:string, password:string) => {
   
    const data = {
        user: user,
        password: password
    };

	const response = await NewInstance.post(loginEP, data);
    console.log(response);
    return response;
};

export default signIn;