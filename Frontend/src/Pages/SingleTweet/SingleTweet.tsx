import './SingleTweet.css'
import { useState, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { likeTweetId } from '../../Components/LikeTweet/LikeTweet';
import { LoadingOutlined, HeartOutlined, CommentOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Spin, Modal, Input } from 'antd';
import getTweetByID from '../../API/GetTweetByID';
import getUserByID from '../../API/GetUserByID';
import { useParams } from 'react-router-dom';





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
    const [tweetAuthor, setTweetAuthor] = useState<string>("");


    //constants
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;
    const { tweetid } = useParams();




    //functions
    const showModal = () => {
        setTimeout(() => {
            setComment("")
        }, 0);
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

    const handleEditComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    }

    //handlers modal
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            //  commentTweet(commentContent, tweetID);
            setOpen(false);
            setConfirmLoading(false);
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
        if(tweetid){
        setTweetID(tweetid);
        }
    }, [])

    useEffect(() =>{
        if(tweetID){
        saveTweet();
        setTweetLoaded(false);
        }
    },[tweetID]);

    useEffect(() => {
        if (tweetLoaded && hasmore) {
            //getComments
        }
    }, [tweetLoaded]);

    useEffect(() => {
        if (tweetLoaded) {
            getUserByID(tweetContent.userID).then((r) => {
                setTweetAuthor(r.data.user);
            });
        }
    }, [tweetLoaded]);

    //Loader
    if (isLoading) {
        return <div className="spin_loader"><Spin indicator={antIcon} /></div>;
    }

    const listTweet = () => {
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png            <>
        const tweet = <> <div key={tweetContent.tweetID} id={tweetContent.tweetID} className="tweet">
            <img className='tweet_img' src={tweetContent.tweetImage}></img>
            <div className="tweet_author"> {tweetAuthor}</div>
            <div className="tweet_content">
                <article >{tweetContent.description} </article>
                <div className="like_icon" onClick={likeTweetId}><HeartOutlined />  </div>
                <div className="likes_number" >{likesNumber}</div>
                <div className="comment_icon" onClick={showModal}><CommentOutlined /> </div>
                <div className="comments_number">{commentsNumber}</div>
            </div>
        </div>
        </>;
        return tweet;
    };

    return (
        <>
            <SidebarTemplate handleRefresh={handleRefresh}>
                <div className='main'>
                    <div className='tweets_container'>
                        {listTweet()}
                    </div>
                    <div className="comments_container">

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
                <Input placeholder="Write commnet" onChange={handleEditComment} value={comment} />
            </Modal>

        </>
    );
}

export default SingleTweet;