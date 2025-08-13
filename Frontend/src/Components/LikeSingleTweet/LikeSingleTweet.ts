import likeTweet from "../../API/LikeTweet";

interface propsI {
  setLikesNumber: React.Dispatch<React.SetStateAction<number>>;
  e: any;
}

export const likeSingleTweetId = ({ e, setLikesNumber }: propsI) => {
  const eventID = e.currentTarget.parentElement.parentElement.id;
  likeTweet(eventID).then((r) => {
    if (!r.data.liked) {
      setLikesNumber((prevLikes) => {
        return prevLikes + 1;
      });
    } else {
      setLikesNumber((prevLikes) => {
        return prevLikes - 1;
      });
    }
  });

  setLikesNumber((prevLikes) => {
    return prevLikes;
  });

  return eventID;
};
