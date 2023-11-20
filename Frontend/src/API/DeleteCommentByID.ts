import { NewInstance } from "./BaseAPI";
const deleteCommentByIDEP = "users/delete-comment"

interface propsI {
    commentsArray: {}[],
    setCommentsArray: React.Dispatch<React.SetStateAction<{}[]>>,
    e: any
}

const deleteCommentByID = async ({ e, commentsArray, setCommentsArray }: propsI) => {
    const commentID = e.currentTarget.parentElement.id;

    const data = {
        commentId: commentID
    }

    console.log({ "tweetsArray": commentsArray });

    const arrayAux = commentsArray.filter((comment: any) => comment.commentID.toString() !== commentID)

    console.log({ "arrayAux": arrayAux, "set": setCommentsArray })
    setCommentsArray(arrayAux);

    console.log({"CommentID": commentID});
    const response = await NewInstance.post(deleteCommentByIDEP, data);
    console.log(response);
    return response;
}

export default deleteCommentByID;