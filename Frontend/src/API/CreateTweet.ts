import { NewInstance } from "./BaseAPI";
const createTweetEP = 'tweets/create';

const createTweet = async (tweetContent:string) =>{
    const data = {
        tweetDesc: tweetContent,
        tweetImage: "https://img.icons8.com/fluency/240w/user-male-circle--v1.png"
    };

    const response = await NewInstance.post(createTweetEP, data);
    console.log(response);
    return response;
};

export default createTweet;