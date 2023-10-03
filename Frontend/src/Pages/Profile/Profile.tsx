import './Profile.css'
import { useState, useEffect } from 'react';
import getTweets from '../../API/GetTweets';
import getUserData from '../../API/GetUserData';

interface objectI {
    [key: string]: any
}

const Profile = () => {

    // useState Hooks   
    const [user, setUser] = useState<string>("");
    const [page, setPage] = useState<string>("1");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const [tweetsArray, setTweetsArray] = useState<any[]>([]);

    // useEffect Hooks
    useEffect(() => {
        //      setAuthToken(localStorage.getItem('auth_token'));
        getUserData().then((r) => {
            setUser(r.data.user);
            setUserLoaded(true);
            console.log(user);
        }).catch((e) => {
            console.log(e);
        });
    }, [])

    useEffect(() => {
        if (userLoaded) {
            getTweets(user, page).then((r) => {
                const tweetIds = Object.keys(r.data.tweets);
                for (let i = tweetIds.length -1; i >= 0 ; i--) {
                        setTweetsArray(oldArray => [...oldArray, r.data.tweets[tweetIds[i]]]);
                        
                        console.log(i +tweetIds[i] );
                    }
                setTimeout(() => {
                    setIsLoading(false);
                }, 100);
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [page, user])

     //Loader
    if (isLoading) {
        return <div className="App"></div>;
    }

    const listTweets = () => {
        //Delete (Replace for autoscroll)
        if(page === "1"){
          setPage("2");  
        }
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png
        const tweets = tweetsArray.map((tweet:objectI) => (
            <>
                <div key={tweet.id} className="tweet">
                    <img className='tweet_img' src={tweet.tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{tweet.description}</article>
                    </div>
                </div>
            </>
        )
        )
        return tweets;
    }

    return (
        <>
            <div className='main'>
                <div className='profile-container'>
                    <p>Profile Profile Profile Profile Profile</p>
                </div>
                <div className='tweets_container'>
                    {listTweets()}
                </div>
            </div >
        </>
    );
}

export default Profile;