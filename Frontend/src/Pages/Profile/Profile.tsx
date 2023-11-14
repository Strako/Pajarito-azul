import './Profile.css'
import { useState, useEffect } from 'react';
import getTweets from '../../API/GetTweets';
import getUserData from '../../API/GetUserData';
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { likeTweetId } from '../../Components/LikeTweet/LikeTweet';
import { LoadingOutlined, HeartOutlined, CommentOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Spin, Modal, Input } from 'antd';
import deleteTweetById from '../../API/DeleteTweetByID';
import editTweet from '../../API/EditTweet';
import { getTweetId } from '../../Components/GetTweetID/GetTweetId';
import getTweetByID from '../../API/GetTweetByID';
import { useNavigate, useNavigation } from "react-router-dom";



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
    const [offset, setOffset] = useState<string>("0");
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [editTweetID, setEditTweetID] = useState("");
    const [contentEditTweet, setContentEditTweet] = useState("");

    //constants
    const navigate = useNavigate();
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

    //functions
    const showModal = () => {
        getTweetByID(editTweetID).then((r) => {
            setTimeout(() => {
                setContentEditTweet(r.data.description)
                console.log(r.data.description)
            }, 0);
            setOpen(true);
        })
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

    const saveTweets = () => {
        getTweets(user.user, page.toString()).then((r) => {
            setTotalPages(r.data.totalPages);
            const tweetIds = Object.keys(r.data.tweets);
            if (page === 1) { setTweetsArray([]) };
            for (let i = tweetIds.length - 1; i >= 0; i--) {
                setTweetsArray(oldArray => [...oldArray, r.data.tweets[tweetIds[i]]]);
            }
            setTimeout(() => {
                setIsLoading(false);
                setOffset("-10px")
            }, 0);
        }).catch((e) => {
            console.log(page);
            console.log("error " + e);
            setHasMore(false);
            setTimeout(() => {
                setIsLoading(false);
            }, 0);
        });
    }

    //Handlers

    //Handler refresh on crate - edit tweet
    const handleRefresh = () => {
        // setPage(1);
        setTimeout(() => {
            window.location.reload();
            //     setTweetsArray([]);
            //     saveTweets();
            //     console.log(page);
        }, 0);
    }

    const handleEditTweet = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContentEditTweet(e.target.value);
    }

    //handlers modal
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            editTweet(contentEditTweet, editTweetID);
            handleRefresh();
            setOpen(false);
            setConfirmLoading(false);
        }, 100);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };


    //useEffect Hooks
    useEffect(() => {
        getUserData().then((r) => {
            setUser(r.data);
            setUserLoaded(true);
            console.log(user.user);
        }).catch((e) => {
            console.log(e);
        });
    }, [])

    useEffect(() => {
        if (userLoaded && hasmore) {
            saveTweets();
        }
    }, [page, user]);

    useEffect(() => {
        showModal();
    }, [editTweetID]);


    //Loader
    if (isLoading) {
        return <div className="spin_loader"><Spin indicator={antIcon} /></div>;
    }

    const listTweets = () => {
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png
        const tweets = tweetsArray.map((tweet: objectI) => (
            <>
                <div key={tweet.tweetID} id={tweet.tweetID} className="tweet" >
                    <img className='tweet_img' src={tweet.tweetImage}></img>
                    <div className="tweet_author"> {user.user}</div>
                    <div className="tweet_content">
                        <article >{tweet.description} </article>
                        <div className="like_icon" onClick={likeTweetId}><HeartOutlined />  </div>
                        <div className="likes_number" >{likesNumber}</div>
                        <div className="comment_icon" onClick={(event) => {
                    navigate("/single-tweet/" + getTweetId(event));
                    console.log(getTweetId(event))
                }}><CommentOutlined /> </div>
                        <div className="comments_number">{commentsNumber}</div>
                        <div className="delete_icon" onClick={(e) => {
                            deleteTweetById(e);
                            window.location.reload();

                        }}><DeleteOutlined /></div>
                        <div className="edit_icon"
                            onClick={(event) => {
                                setEditTweetID(getTweetId(event));
                            }}>
                            <EditOutlined /></div>
                    </div>
                </div>
            </>
        )
        )
        return tweets;
    }

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
                        {listTweets()}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={offset}   // Adjust the offset if needed
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