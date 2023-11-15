import getTweets from "../../API/GetTweets";

export interface propsI{
    [key: string]: any,   
    page: number,
    setTotalPages: React.Dispatch<React.SetStateAction<number>>,
    setTweetsArray:React.Dispatch<React.SetStateAction<any[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}


const saveTweets = ({user, page, setTotalPages, setTweetsArray, setIsLoading}:propsI) => {
    getTweets(user.user, page.toString()).then((r) => {
        setTotalPages(r.data.totalPages);
        const tweetIds = Object.keys(r.data.tweets);
        if (page === 1) { setTweetsArray([]) };
        for (let i = tweetIds.length - 1; i >= 0; i--) {
            setTweetsArray(oldArray => [...oldArray, r.data.tweets[tweetIds[i]]]);
        }
        setTimeout(() => {
            setIsLoading(false);
        }, 0);
    }).catch((e) => {
        console.log(page);
        console.log("error " + e);
        setTimeout(() => {
            setIsLoading(false);
        }, 0);
    });
}

export default saveTweets;