import { NewInstance } from "./BaseAPI";
const deleteCommentByIDEP = "tweets/delete-tweet/"

interface propsI {
    commentsArray: {}[],
    setCommentsArray: React.Dispatch<React.SetStateAction<{}[]>>,
    e: any
}

const deleteCommentByID = async ({e, commentsArray, setCommentsArray}: propsI) => {
    const commentID = e.currentTarget.parentElement.parentElement.id;
    console.log({ "tweetsArray": commentsArray });

    const arrayAux = commentsArray.filter((comment: any) => +comment.commentID !== commentID)


    console.log({ "arrayAux": arrayAux, "set": setCommentsArray })
    setCommentsArray(arrayAux);


    const response = await NewInstance.delete(deleteCommentByIDEP + commentID);
    console.log(response);
    return response;
}
export default deleteCommentByID;