import {NewInstance} from './BaseAPI';
const commentByIDEP= 'users/add-comment-to';


const commentByID = async (tweetId:string, comment:string) => {
   
    const data = {
        tweetId: tweetId,
        comment: comment
    };

	const response = await NewInstance.post(commentByIDEP, data);
    console.log(response);
    return response;
};

export default commentByID;