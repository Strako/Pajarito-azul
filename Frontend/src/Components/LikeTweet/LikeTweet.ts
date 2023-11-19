import likeTweet from "../../API/LikeTweet";

export const likeTweetId = (event: any) => {
    console.log("cliked" + event.currentTarget.parentElement.parentElement.id)
    likeTweet(event.currentTarget.parentElement.parentElement.id);
    return event.currentTarget.parentElement.parentElement.id;
}

