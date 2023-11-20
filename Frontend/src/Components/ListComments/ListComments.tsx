import { DeleteOutlined } from '@ant-design/icons';
import deleteCommentByID from '../../API/DeleteCommentByID';
import getUserByID from '../../API/GetUserByID';


interface propsI {
    commentsArray: {}[];
    setCommentsArray?: React.Dispatch<React.SetStateAction<{}[]>>;
    navigate: any;
    mapComments: Map<any, any>;

}

interface objectI {
    [key: string]: any
}

const listComments = ({ commentsArray, setCommentsArray, navigate, mapComments }: propsI) => {
    if(mapComments != undefined){

        let comments = commentsArray.map((comment: objectI) => {
            console.log("entradas:", mapComments.size);
            const userEntry = mapComments.get(comment.userID) || { user: "", image: "" };

            return (
                <>
                    <div key={comment.commentID} id={comment.commentID} className="single_tweet_comment">
                        <img className='single_tweet_comment_img' src={userEntry.image} onClick={() => navigate('/user/' + userEntry.user)}></img>
                        <div className="single_tweet_comment_author" onClick={() => navigate('/user/' + userEntry.user)}> {userEntry.user}</div>
                        <div className="single_tweet_comment_content">
                            <article >{comment.comment} </article>
                        </div>
                        <div className="delete_icon" onClick={(e) => {
                            if (setCommentsArray) {
                                deleteCommentByID({ e, commentsArray, setCommentsArray });
                            }
                            // window.location.reload();
                        }}><DeleteOutlined /></div>
                    </div>
                </>
            );

        });

        return comments;
    }
}

export default listComments;