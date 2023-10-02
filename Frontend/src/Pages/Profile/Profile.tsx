import './Profile.css'
import { useState, useEffect } from 'react';
import getTweets from '../../API/GetTweets';
import getUserData from '../../API/GetUserData';
import { setAuthToken } from '../../API/BaseAPI';

interface objectI {
    [key: string]: any
}

const Profile = () => {

    // useState Hooks   
    const [response, setResponse] = useState<objectI>({});
    const [user, setUser] = useState("");
    const [page, setPage] = useState("1");
    const [isLoading, setIsLoading] = useState(true);
    const [userLoaded, setUserLoaded] = useState(false)

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
                setResponse(r.data.tweets);
                setTimeout(() => {
                    setIsLoading(false);
                }, 0);
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [page, user])

    console.log({ isLoading });

    if (isLoading) {
        return <div className="App"></div>;
    }


    const listTweets = () => {
        const tweets = (
            <>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>
                <div className="tweet">
                    <img className='tweet_img' src={response[9].tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article>{response[9].description}</article>
                    </div>
                </div>


            </>
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