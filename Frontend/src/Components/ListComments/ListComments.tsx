import { DeleteOutlined } from '@ant-design/icons';
import deleteCommentByID from '../../API/DeleteCommentByID';



interface propsI {
    commentsArray: {}[];
    setCommentsArray?: React.Dispatch<React.SetStateAction<{}[]>>;
    navigate: any;
    mapComments: Map<any, any>;
    currentUserID: string;
    setCommentNumber: React.Dispatch<React.SetStateAction<number>>;

}

interface objectI {
    [key: string]: any
}

const ListComments = ({commentsArray, setCommentsArray, navigate, mapComments, currentUserID, setCommentNumber}: propsI) => {    
    if (mapComments != undefined) {

        let comments = commentsArray.map((comment: objectI) => {
            console.log("entradas:", mapComments);
            const userEntry = mapComments.get(comment.userID) || { user: "", image: "" };
            console.log({"userEntry": userEntry,"currentuserID": currentUserID, "comment userID": comment.userID});
            return (
                <>
                    <div key={comment.commentID} id={comment.commentID} className="single_tweet_comment">
                        <img className='single_tweet_comment_img' src={userEntry.image} loading="lazy" onClick={() => navigate('/user/' + userEntry.user)}></img>
                        <div className="single_tweet_comment_author" onClick={() => navigate('/user/' + userEntry.user)}> {userEntry.user}</div>
                        <div className="single_tweet_comment_content">
                            <article >{comment.comment} </article>
                        </div>
                        <div className="single_tweet_comment_delete_icon" onClick={(e) => {
                            if (setCommentsArray) {
                                deleteCommentByID({ e, commentsArray, setCommentsArray, setCommentNumber });
                            }
                            // window.location.reload();
                        }}>
                            {
                                currentUserID === comment.userID? <DeleteOutlined /> : <></>
  
                            }
                        </div>
                    </div>
                </>
            );

        });

        return comments;
    }
}

export default ListComments;