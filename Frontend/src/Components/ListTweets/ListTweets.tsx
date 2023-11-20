import { likeTweetId } from '../../Components/LikeTweet/LikeTweet';
import { HeartOutlined, CommentOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import deleteTweetById from '../../API/DeleteTweetByID';
import { getTweetId } from '../../Components/GetTweetID/GetTweetId';


interface propsI {
    keyToUpdate: string,
    tweetsArray: any,
    setEditTweetID?: React.Dispatch<React.SetStateAction<string>>,
    user: objectI,
    navigate: any,
    setTweetsArray:  React.Dispatch<React.SetStateAction<any[]>>,
    setListTweetsKey: React.Dispatch<React.SetStateAction<string>>

}

interface objectI {
    [key: string]: any
}

const listTweets = ({ keyToUpdate, tweetsArray, setEditTweetID, user, navigate,setTweetsArray, setListTweetsKey }: propsI) => {
    //    const navigate = useNavigate();


    //tweet example
    //1 Lorem ipsum dolor sit amet, consectetur adipiscing elit.  | https://img.icons8.com/fluency/240w/user-male-circle--v1.png
    if (setEditTweetID != undefined) {
        let tweets = tweetsArray.map((tweet: objectI) => (
            <>
                    <div key={tweet.tweetID} id={tweet.tweetID} className="tweet" >
                    <img className='tweet_img' src={user.userImage} onClick={() => navigate('/user/'+user.user)}></img>
                    <div className="tweet_author" onClick={() => navigate('/user/'+user.user)}> {user.user}</div>
                    <div className="tweet_content">
                        <article >{tweet.description} </article>
                        <div className="like_icon" onClick={(e) => {
                           likeTweetId({e, tweetsArray, setTweetsArray});

                        }}><HeartOutlined />  </div>
                        <div className="likes_number" >{tweet.likes}</div>
                        <div className="comment_icon" onClick={(event) => {
                            navigate("/single-tweet/" + getTweetId(event));
                            console.log(getTweetId(event))
                        }}><CommentOutlined /> </div>
                        <div className="comments_number">{tweet.comments}</div>
                        <div className="delete_icon" onClick={(e) => {
                            deleteTweetById({e, tweetsArray, setTweetsArray});
                           // window.location.reload();

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
    }else{
        const tweets = tweetsArray.map((tweet: objectI) => (
            <>
                <div key={tweet.tweetID} id={tweet.tweetID} className="tweet" >
                    <img className='tweet_img' src={user.userImage} onClick={() => navigate('/user/'+user.user)}></img>
                    <div className="tweet_author" onClick={() => navigate('/user/'+user.user)}> {user.user}</div>
                    <div className="tweet_content">
                        <article >{tweet.description} </article>
                        <div className="like_icon" onClick={(e) =>{
                            likeTweetId({e, tweetsArray, setTweetsArray})}
                            }><HeartOutlined />  </div>
                        <div className="likes_number" >{tweet.likes}</div>
                        <div className="comment_icon" onClick={(event) => {
                    navigate("/single-tweet/" + getTweetId(event));
                    console.log(getTweetId(event))
                }}><CommentOutlined /> </div>
                        <div className="comments_number">{tweet.comments}</div>
                    </div>
                </div>
            </>
        )
        )
        return tweets;
    }
}

export default listTweets;