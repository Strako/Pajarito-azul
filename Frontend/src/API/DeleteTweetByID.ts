import { NewInstance } from "./BaseAPI";
const deleteTweetByIdEP= "tweets/delete-tweet/"

const deleteTweetById = async (event:any) =>{
    const tweetId =  event.currentTarget.parentElement.parentElement.id;

    const response = await NewInstance.delete(deleteTweetByIdEP + tweetId);
    console.log(response);
    return response;
}
export default deleteTweetById;