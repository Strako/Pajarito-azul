import followByID from "../../API/FollowByID";

const followUser = (userid: string, setFollow: React.Dispatch<React.SetStateAction<string>>, setFollowersNumber: React.Dispatch<React.SetStateAction<number>>) => {
    followByID(userid).then((r) => {
        if (r.data.following === true) {
            setFollow("Unfollow");

            setFollowersNumber(prevFollowers => {return prevFollowers + 1});

        } else {
            setFollow("Follow");
            setFollowersNumber(prevFollowers => {return prevFollowers - 1});

        }
    })

}

export default followUser;