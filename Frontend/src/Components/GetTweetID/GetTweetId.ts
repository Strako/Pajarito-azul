export const getTweetId = (event: any, type?: number) => {
    var responseID = "";
    if (type === 1) {
        responseID = event.currentTarget.id;
        console.log("cliked" + event.currentTarget.id)
    } else {
        responseID = event.currentTarget.parentElement.parentElement.id;
        console.log("cliked" + event.currentTarget.parentElement.parentElement.id)
    }
    return responseID;
}

