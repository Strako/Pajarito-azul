import { NewInstance } from "./BaseAPI";
const editTweetEP = 'tweets/update-tweet/';

const editTweet = async (tweetContent:string, id:string) =>{
    const data = {
        tweetDesc: tweetContent,
        tweetImage: "https://img.icons8.com/fluency/240w/user-male-circle--v1.png"
    };

    const response = await NewInstance.put(editTweetEP + id, data);
    console.log(response);
    return response;
};

export default editTweet;