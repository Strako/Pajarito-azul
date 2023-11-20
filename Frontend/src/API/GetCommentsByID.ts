import {NewInstance} from './BaseAPI';
const getCommentsByIDEP = 'tweets/get-comments/';


const getCommentsByID = async (tweetID:string, page:number) => {
	const response = await NewInstance.get(getCommentsByIDEP+tweetID+'?page='+ page.toString() +'&per_page=10');
    console.log(response);
   
    return response;

};

export default getCommentsByID;