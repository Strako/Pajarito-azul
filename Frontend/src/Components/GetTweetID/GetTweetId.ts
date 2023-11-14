export const getTweetId = (event: any) => {
    console.log("cliked" + event.currentTarget.parentElement.parentElement.id)
    return event.currentTarget.parentElement.parentElement.id;
}

