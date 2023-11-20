import { DeleteOutlined } from '@ant-design/icons';
import deleteCommentByID from '../../API/DeleteCommentByID';
import getUserByID from '../../API/GetUserByID';


interface propsI {
    keyToUpdate: string,
    commentsArray: {}[];
    setCommentsArray?: React.Dispatch<React.SetStateAction<{}[]>>;
    navigate: any;
    mapComments: Map<any, any>;
    currentUserID: string;

}

interface objectI {
    [key: string]: any
}

const listComments = ({ commentsArray, setCommentsArray, navigate, mapComments, currentUserID }: propsI) => {
    if (mapComments != undefined) {

        let comments = commentsArray.map((comment: objectI) => {
            console.log("entradas:", mapComments.size);
            const userEntry = mapComments.get(comment.userID) || { user: "", image: "" };
            console.log({"currentuserID": currentUserID, "comment userID": comment.userID});
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
                                deleteCommentByID({ e, commentsArray, setCommentsArray });
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

export default listComments;