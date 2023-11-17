import { NewInstance } from "./BaseAPI";
const deleteTweetByIdEP = "tweets/delete-tweet/"

interface propsI {
    tweetsArray: any,
    setTweetsArray: React.Dispatch<React.SetStateAction<any[]>>,
    e: any
}

const deleteTweetById = async ({e, tweetsArray, setTweetsArray}: propsI) => {
    const tweetId = e.currentTarget.parentElement.parentElement.id;
    console.log({ "tweetsArray": tweetsArray });

    const arrayAux = tweetsArray.filter((tweet: any) => tweet.tweetID !== +tweetId)


    console.log({ "arrayAux": arrayAux, "set": setTweetsArray })
    setTweetsArray(arrayAux);


    const response = await NewInstance.delete(deleteTweetByIdEP + tweetId);
    console.log(response);
    return response;
}
export default deleteTweetById;