import {NewInstance} from './BaseAPI';
const getTweetsEP= 'tweets/get-tweets-of/'


const getTweets = async (user:string, page:string) => {
   
	const response = await NewInstance.get(getTweetsEP+user+'?page='+page+'&per_page=10');
    console.log(response);
    return response;
};

export default getTweets;