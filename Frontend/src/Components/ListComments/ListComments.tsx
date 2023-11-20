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

const listComments = ({ keyToUpdate, tweetsArray, setEditTweetID, user, navigate,setTweetsArray, setListTweetsKey }: propsI) => {
        let comments = commentsArray.map((comment: objectI) => (
            <>
                <div key={comment.commentID} id={comment.commentID} className="tweet" >
                    <img className='tweet_img' src={user.userImage} onClick={() => navigate('/user/'+user.user)}></img>
                    <div className="tweet_author" onClick={() => navigate('/user/'+user.user)}> {user.user}</div>
                    <div className="tweet_content">
                        <article >{comment.description} </article>                        
                    </div>
                    <div className="delete_icon" onClick={(e) => {
                            deleteTweetById({e, tweetsArray, setTweetsArray});
                           // window.location.reload();

                        }}><DeleteOutlined /></div>
                </div>
            </>
        )
        )
        return comments;
    }

export default listComments;