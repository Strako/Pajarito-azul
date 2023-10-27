import './Profile.css'
import { useState, useEffect } from 'react';
import getTweets from '../../API/GetTweets';
import getUserData from '../../API/GetUserData';
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { printDebugg } from '../../Components/LikeTweet/LikeTweet';
import { LoadingOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { Spin } from 'antd';


interface objectI {
    [key: string]: any
}

const Profile = () => {

    //useState Hooks   
    const [user, setUser] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const [tweetsArray, setTweetsArray] = useState<any[]>([]);
    const [hasmore, setHasMore] = useState<boolean>(true);
    const [likesNumber, setLikesNumber] = useState<number>(0)
    const [commentsNumber, setCommentNumber] = useState<number>(0)

    //constants
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;


    //functions
    const infiniteScroll = () => {
        //add if page < total else setHasMore(false), 
        //send total pages in json (count results in get tweets of a user, divide it by 10 and round up)
        if (page < totalPages) {
            setPage(page + 1);

        } else {
            setHasMore(false)
        }
    };

    //  const printDebugg = (event: any) => {
    //     console.log("cliked" + event.currentTarget.parentElement.parentElement.id)
    // }

    //useEffect Hooks
    useEffect(() => {
        getUserData().then((r) => {
            setUser(r.data.user);
            setUserLoaded(true);
            console.log(user);
        }).catch((e) => {
            console.log(e);
        });
    }, [])

    useEffect(() => {
        if (userLoaded && hasmore) {
            getTweets(user, page.toString()).then((r) => {
                setTotalPages(r.data.totalPages);
                const tweetIds = Object.keys(r.data.tweets);
                for (let i = tweetIds.length - 1; i >= 0; i--) {
                    setTweetsArray(oldArray => [...oldArray, r.data.tweets[tweetIds[i]]]);
                }
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }).catch((e) => {
                console.log(page);
                console.log("error " + e);
                setHasMore(false);
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            });
        }
    }, [page, user])

    //Loader
    if (isLoading) {
        return <div className="spin_loader"><Spin indicator={antIcon} /></div>;
    }

    const listTweets = () => {
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png
        const tweets = tweetsArray.map((tweet: objectI) => (
            <>
                <div key={tweet.tweetID} id={tweet.tweetID} className="tweet">
                    <img className='tweet_img' src={tweet.tweetImage}></img>
                    <div className="tweet_author"> Tweet Author example</div>
                    <div className="tweet_content">
                        <article >{tweet.description} </article>
                        <div className="like_icon" onClick={printDebugg}><HeartOutlined />  </div>
                        <div className="likes_number" >{likesNumber}</div>
                        <div className="comment_icon"><CommentOutlined /> </div>
                        <div className="comments_number">{commentsNumber}</div>
                    </div>
                </div>
            </>
        )
        )
        return tweets;
    }

    return (
        <>
            <SidebarTemplate>
                <div className='main'>
                    <div className='profile-container'>
                        <p>Profile Profile Profile Profile Profile</p>
                    </div>
                    <div className='tweets_container'>
                        {listTweets()}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset="0px"   // Adjust the offset if needed
                />
            </SidebarTemplate>
        </>
    );
}

export default Profile;