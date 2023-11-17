import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { Modal, Input } from 'antd';
import getUserData from '../../API/GetUserData';
import getTweetByID from '../../API/GetTweetByID';
import editTweet from '../../API/EditTweet';
import saveTweets from '../../Components/SaveTweets/SaveTweets';
import listTweets from '../../Components/ListTweets/ListTweets';
import getTweets from '../../API/GetTweets';
import './Profile.css'
import loaderPlaceholder from '../../Components/LoaderPlaceholder/Loader';

interface objectI {
    [key: string]: any
}

const Profile = () => {

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
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [editTweetID, setEditTweetID] = useState<string>("");
    const [contentEditTweet, setContentEditTweet] = useState("");
    const [listTweetsKey, setListTweetsKey] = useState<string>('initialKey');

    //constants
    const navigate = useNavigate();

    //functions
    const showModal = () => {
        if (editTweetID != "") {
            getTweetByID(editTweetID).then((r) => {
                setTimeout(() => {
                    setContentEditTweet(r.data.description)
                    console.log(r.data.description)
                }, 0);
                setOpen(true);
            })
        }
    };

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

    const handleEditTweet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContentEditTweet(e.target.value);
    }

    //Handlers modal
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            editTweet(contentEditTweet, editTweetID).then(() => {
                setOpen(false);
                setConfirmLoading(false);
                window.location.reload();
            })
        }, 500);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    //useEffect Hooks
    useEffect(() => {
        if (!userLoaded) {
            getUserData().then((r) => {
                setUser(r.data);
                setUserLoaded(true);
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [])

    useEffect(() => {
        if (userLoaded && hasmore) {
            saveTweets({ user, page, setTotalPages, setTweetsArray, setIsLoading, hasmore });
        }
        console.log({"tweets ":tweetsArray});

    }, [page, user]);

    useEffect(() => {
        showModal();
    }, [editTweetID]);

    //Loader
    if (isLoading) {
        return loaderPlaceholder();
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
                        {listTweets({ keyToUpdate: listTweetsKey, tweetsArray, setEditTweetID, user, navigate, setTweetsArray })}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={"-150px"}   // Adjust the offset if needed
                />
            </SidebarTemplate>

            <Modal
                title="Edit Tweet"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <Input placeholder="Write Tweet" onChange={handleEditTweet} value={contentEditTweet} />
            </Modal>
        </>
    );
}

export default Profile;