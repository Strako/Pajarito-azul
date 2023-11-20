import { useState, useEffect } from 'react';
import { Waypoint } from 'react-waypoint';
import { useNavigate, useParams } from 'react-router-dom';
import getTweetByID from '../../API/GetTweetByID';
import getUserByID from '../../API/GetUserByID';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { Modal, Input } from 'antd';
import loaderPlaceholder from '../../Components/LoaderPlaceholder/Loader';
import { maxLength } from '../../Constants/Constants';
import commentByID from '../../API/CommentByID';
import { likeSingleTweetId } from '../../Components/LikeSingleTweet/LikeSingleTweet';
import saveComments from '../../Components/SaveComments/SaveComments';
import './SingleTweet.css'
import getCommentsByID from '../../API/GetCommentsByID';
import listComments from '../../Components/ListComments/ListComments';
import getUserData from '../../API/GetUserData';





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
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [tweetID, setTweetID] = useState<string>("");
    const [tweetContent, setTweetContent] = useState<objectI>({});
    const [comment, setComment] = useState<string>("");
    const [listCommentKey, setListCommentKey] = useState<string>('initialKey');
    const [mapComments, setMapcomments] = useState<Map<any, any>>(new Map());
    const [currentUserID, setCurrentUserID] = useState<string>("");



    //constants
    const { tweetid } = useParams();
    const navigate = useNavigate();
    const { TextArea } = Input;




    //functions
    const showModal = () => {
        setOpen(true);
    };

    const infiniteScroll = () => {
        //add if page < total else setHasMore(false), 
        //send total pages in json (count results in get tweets of a user, divide it by 10 and round up)
        if (page < totalPages) {
            console.log("infinte scroll" , true)
            setHasMore(true);
            setTimeout(() => {
                setPage(page + 1);
            }, 100);

        } else {
            console.log("infinte scroll no more pages" , true)

            setHasMore(false)
        }
    };

    const saveTweet = () => {
        getTweetByID(tweetID).then((r) => {
            setLikesNumber(r.data.likes)
            setTweetContent(r.data);
            setTimeout(() => {
                setTweetLoaded(true);

            }, 200);
        }).catch((e) => {
            console.log("error " + e);
            setHasMore(false);
        });
    }


    //Handlers

    //Handler refresh on crate - edit tweet
    const handleRefresh = () => {
        setTimeout(() => {




            getCommentsByID(tweetID, 1).then((r) => {
                const commentsIds = Object.keys(r.data.comments);
                let auxiliarArray = commentsArray;
                auxiliarArray.unshift(r.data.comments[commentsIds[0]]);
                setCommentsArray(auxiliarArray);
                console.log("Agregar mnuevo",commentsArray);
                setListCommentKey((prevKey) => prevKey === 'initialKey' ? 'refreshKey' : 'initialKey');
            });










        }, 0);
        //window.location.reload();

    }

    const handleEditComment: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setComment(e.target.value);
    }

    //handlers modal
    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            commentByID(tweetID, comment)
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
        if (tweetid) {
            setTweetID(tweetid);
            getUserData().then((r) =>{
                setCurrentUserID(r.data.userid)
            });
        }
    }, [])

    useEffect(() => {
        if (tweetID) {
            saveTweet();
        }
    }, [tweetID]);

    useEffect(() => {
        if (tweetLoaded) {
            setTimeout(() => {
                getUserByID(tweetContent.userID).then((r) => {
                    console.log({ "useeffect getusebyid": r.data.userid })
                    setUser(r.data);
                });
            }, 500);
        }
    }, [tweetLoaded]);

    useEffect(() => {
        if (hasmore) {
            //getComments
            getCommentsByID(tweetID, page).then((r) => {
                if (r.data.empty === true) {
                    setIsLoading(false);
                } else {
                    setTotalPages(r.data.totalPages);
                    const commentsIDs = Object.keys(r.data.comments);
                    setCommentNumber(commentsIDs.length)
                    for (let i = 0; i < commentsIDs.length; i++) {
                        setCommentsArray(oldArray => [...oldArray, r.data.comments[commentsIDs[i]]]);
                    }
                }
            })
        }
    }, [tweetLoaded, page]);

    useEffect(() => {
        //set comments into the hashmap
        commentsArray.map((comment: objectI) => {
            if (!mapComments.has(comment.userID)) {
                getUserByID(comment.userID).then((r) => {
                    setMapcomments(mapComments.set(comment.userID, { "user": r.data.user, "image": r.data.userImage }))
                })
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 100);

        })

    }, [commentsArray])

    //Loader
    if (isLoading && !tweetLoaded) {
        return loaderPlaceholder();
    }

    const listTweet = () => {
        //tweet example
        //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png            <>
        const tweet = <> <div key={tweetContent.tweetID} id={tweetContent.tweetID} className="single_tweet">
            <img className='single_tweet_img' src={user.userImage} loading="lazy" onClick={() => navigate('/user/' + user.user)}></img>
            <div className="single_tweet_author" onClick={() => navigate('/user/' + user.user)}> {user.user}</div>
            <div className="single_tweet_content">
                <article >{tweetContent.description} </article>
                <div className="single_like_icon" onClick={(e) => {
                    likeSingleTweetId({ e, setLikesNumber })
                }}><HeartOutlined />  </div>
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
                        {listComments({keyToUpdate: listCommentKey, commentsArray, setCommentsArray, navigate, mapComments, currentUserID })}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={"0"}   // Adjust the offset if needed
                />
            </SidebarTemplate>

            <Modal
                title="Create comment"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >

                <TextArea rows={2} placeholder={"maxLength is " + maxLength} maxLength={maxLength} onChange={handleEditComment} />
            </Modal>
        </>
    );
}

export default SingleTweet;