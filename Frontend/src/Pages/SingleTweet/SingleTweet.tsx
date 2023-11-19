import { useState, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import { useNavigate, useParams } from 'react-router-dom';
import getTweetByID from '../../API/GetTweetByID';
import getUserByID from '../../API/GetUserByID';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { likeTweetId } from '../../Components/LikeTweet/LikeTweet';
import { HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { Modal, Input } from 'antd';
import loaderPlaceholder from '../../Components/LoaderPlaceholder/Loader';
import { maxLength } from '../../Constants/Constants';
import './SingleTweet.css'
import commentByID from '../../API/CommentByID';





interface objectI {
    [key: string]: any
}

const SingleTweet = () => {

    //useState Hooks   
    const [user, setUser] = useState<objectI>({});
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tweetLoaded, setTweetLoaded] = useState<boolean>(false)
    const [commentsArray, setCommentsArray] = useState<any[]>([]);
    const [hasmore, setHasMore] = useState<boolean>(true);
    const [likesNumber, setLikesNumber] = useState<number>(0);
    const [commentsNumber, setCommentNumber] = useState<number>(0);
    const [offset, setOffset] = useState<string>("0");
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [tweetID, setTweetID] = useState<string>("");
    const [tweetContent, setTweetContent] = useState<objectI>({});
    const [comment, setComment] = useState<string>("");


    //constants
    const { tweetid } = useParams();
    const navigate = useNavigate();
    const { TextArea } = Input;



    //functions
    const showModal = () => {
        setComment("")
        setOpen(true);
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

    const saveTweet = () => {
        getTweetByID(tweetID).then((r) => {
            setTweetContent(r.data);
            setTimeout(() => {
                setTweetLoaded(true);
                setIsLoading(false);
                setOffset("-10px")
            }, 0);
        }).catch((e) => {
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
        setTimeout(() => {
            window.location.reload();
        }, 0);
    }

    const handleEditComment: React.ChangeEventHandler<HTMLTextAreaElement>  = (e) => {
        setComment(e.target.value);
    }

    //handlers modal
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            commentByID(tweetID, comment)
            setOpen(false);
            setConfirmLoading(false);
            setComment("");
            handleRefresh();
        }, 100);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };


    //useEffect Hooks
    useEffect(() => {
        console.log(tweetid);
        if (tweetid) {
            setTweetID(tweetid);
        }
    }, [])

    useEffect(() => {
        if (tweetID) {
            saveTweet();
            setTweetLoaded(false);
        }
    }, [tweetID]);

    useEffect(() => {
        if (tweetLoaded && hasmore) {
            //getComments
        }
    }, [tweetLoaded]);

    useEffect(() => {
        if (tweetLoaded) {
            getUserByID(tweetContent.userID).then((r) => {
                setUser(r.data);
            });
        }
    }, [tweetLoaded]);

    //Loader
    if (isLoading) {
        return loaderPlaceholder();
    }

    const listTweet = () => {
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png            <>
        const tweet = <> <div key={tweetContent.tweetID} id={tweetContent.tweetID} className="single_tweet">
            <img className='single_tweet_img' src={user.userImage} onClick={() => navigate('/user/' + user.user)}></img>
            <div className="single_tweet_author" onClick={() => navigate('/user/' + user.user)}> {user.user}</div>
            <div className="single_tweet_content">
                <article >{tweetContent.description} </article>
                <div className="single_like_icon" onClick={likeTweetId}><HeartOutlined />  </div>
                <div className="single_likes_number" >{likesNumber}</div>
                <div className="single_comment_icon" onClick={showModal}><CommentOutlined /> </div>
                <div className="single_comments_number">{commentsNumber}</div>
            </div>
        </div>
        </>;
        return tweet;
    };

    return (
        <>
            <SidebarTemplate>
                <div className='main'>
                    <div className='single_tweets_container'>
                        {listTweet()}
                    </div>
                    <div className="single_comments_container">

                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={offset}   // Adjust the offset if needed
                />
            </SidebarTemplate>

            <Modal
                title="Create comment"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >

                <TextArea rows={2} placeholder={"maxLength is " + maxLength } maxLength={maxLength} onChange={handleEditComment}/>
            </Modal>



            export default App;


        </>
    );
}

export default SingleTweet;