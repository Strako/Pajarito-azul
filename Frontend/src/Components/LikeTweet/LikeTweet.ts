import likeTweet from "../../API/LikeTweet";

interface propsI {
  tweetsArray: any;
  setTweetsArray: React.Dispatch<React.SetStateAction<any[]>>;
  e: any;
}

interface objectI {
  [key: string]: any;
}

export const likeTweetId = ({ e, setTweetsArray }: propsI) => {
  const eventID = e.currentTarget.parentElement.parentElement.id;
  likeTweet(eventID).then((r) => {
    setTweetsArray((prevTweetsArray) => {
      return prevTweetsArray.map((tweet: objectI) => {
        if (tweet.tweetID.toString() === eventID) {
          return {
            ...tweet,
            likes: r.data.liked ? tweet.likes - 1 : tweet.likes + 1,
          };
        }
        return tweet;
      });
    });
  });

  return eventID;
};
