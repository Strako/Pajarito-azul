import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import saveTweets from '../../Components/SaveTweets/SaveTweets';
import listTweets from '../../Components/ListTweets/ListTweets';
import getTweets from '../../API/GetTweets';
import searchUser from '../../API/SearchUser';
import getUserData from '../../API/GetUserData';

import '../Profile/Profile.css'

interface objectI {
    [key: string]: any
}

const SingleUser = () => {

    //useState Hooks   
    const [user, setUser] = useState<objectI>({});
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const [tweetsArray, setTweetsArray] = useState<any[]>([]);
    const [hasmore, setHasMore] = useState<boolean>(true);
    const [likesNumber, setLikesNumber] = useState<number>(0);
    const [commentsNumber, setCommentNumber] = useState<number>(0);
    const [listTweetsKey, setListTweetsKey] = useState<string>('initialKey');

    //constants
    const navigate = useNavigate();
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
    const { username } = useParams();


    //functions

    const infiniteScroll = () => {
        //add if page < total else setHasMore(false), 
        //send total pages in json (count results in get tweets of a user, divide it by 10 and round up)
        if (page < totalPages) {
            setTimeout(() => {
                setPage(page + 1);
            }, 100);

        } else {
            setHasMore(false)
        }
    };

    //Handlers
    //Handler refresh on crate - edit tweet
    const handleRefresh = () => {
        setTimeout(() => {
            //    window.location.reload();
            getTweets(user.user, "1").then((r) => {
                const tweetIds = Object.keys(r.data.tweets);
                let auxiliarArray = tweetsArray;
                auxiliarArray.unshift(r.data.tweets[tweetIds[tweetIds.length - 1]]);
                console.log(auxiliarArray.toString)
                setTweetsArray(auxiliarArray);
                setListTweetsKey((prevKey) => prevKey === 'initialKey' ? 'refreshKey' : 'initialKey');
            });

        }, 500);
    }

    //useEffect Hooks
    useEffect(() => {
            getUserData().then((r) => {
                if (r.data.user != username && username) {
                    searchUser(username).then((r) => {
                        setUser(r.data.users[0]);
                        setUserLoaded(true);
                    }).catch((e) => {
                        console.log(e);
                    });

                } else {
                    navigate("/profile");
                }
            })
        
    }, [])

    useEffect(() => {
        if (userLoaded && hasmore) {
            saveTweets({ user, page, setTotalPages, setTweetsArray, setIsLoading, hasmore });
        }
    }, [page, user]);


    //Loader
    if (isLoading) {
        return <div className="spin_loader"><Spin indicator={antIcon} /></div>;
    }

    //Main JSX
    return (
        <>
            <SidebarTemplate handleRefresh={handleRefresh}>
                <div className='main'>
                    <div className='profile-container'>
                        <img className='profile_img' src={user.userImage}></img>
                        <div className='profile_user'> {user.user}</div>
                        <div className='profile_name'>{user.name}</div>
                        <div className='profile_description'>{user.description}</div>
                    </div>
                    <div className='tweets_container'>
                        {listTweets({ keyToUpdate: listTweetsKey, tweetsArray, user, navigate })}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={"-150px"}   // Adjust the offset if needed
                />
            </SidebarTemplate>
        </>
    );
}

export default SingleUser;