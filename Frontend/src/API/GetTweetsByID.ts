import {NewInstance} from './BaseAPI';
const getTweetsByIDEP= 'tweets/get-tweet/'


const getTweetsByID = async (id:string) => {
   
	const response = await NewInstance.get(getTweetsByIDEP+id);
    console.log(response);
    return response;
};

export default getTweetsByID;