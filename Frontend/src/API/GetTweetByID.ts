import {NewInstance} from './BaseAPI';
const getTweetByIDEP= 'tweets/get-tweet/'


const getTweetByID = async (id:string) => {
	const response = await NewInstance.get(getTweetByIDEP+id);
    console.log(response);
   
    return response;

};

export default getTweetByID;