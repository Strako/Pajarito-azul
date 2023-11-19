import {NewInstance} from './BaseAPI';
const likeTweetEP = '/users/like-tweet';


const likeTweet = async (tweetId:string) => {
   
    const data = {
        tweetId: tweetId
    };

	const response = await NewInstance.post(likeTweetEP, data);
    console.log(response);
    return response;
};

export default likeTweet;