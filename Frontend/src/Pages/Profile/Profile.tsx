import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { Modal, Input, Typography } from 'antd';
import getUserData from '../../API/GetUserData';
import getTweetByID from '../../API/GetTweetByID';
import editTweet from '../../API/EditTweet';
import saveTweets from '../../Components/SaveTweets/SaveTweets';
import listTweets from '../../Components/ListTweets/ListTweets';
import getTweets from '../../API/GetTweets';
import loaderPlaceholder from '../../Components/LoaderPlaceholder/Loader';
import './Profile.css'
import inputWithSize from '../../Components/TextArea/TextArea';
import { rowsLength } from '../../Constants/Constants';
import editUserProfile from '../../API/UpdateUserProfile';
import { inputOneLine } from '../../Components/InputOneLine/InputOneLine';




interface objectI {
    [key: string]: any
}

const Profile = () => {

    //useState Hooks   
    const [user, setUser] = useState<objectI>({});
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userLoaded, setUserLoaded] = useState<boolean>(false)
    const [tweetsArray, setTweetsArray] = useState<any[]>([]);
    const [hasmore, setHasMore] = useState<boolean>(true);
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmLoadingProfile, setConfirmLoadingProfile] = useState(false);
    const [editTweetID, setEditTweetID] = useState<string>("");
    const [contentEditTweet, setContentEditTweet] = useState("");
    const [listTweetsKey, setListTweetsKey] = useState<string>('initialKey');
    const [editProfile, setEditProfile] = useState<boolean>(false);
    const [profleUser, setProfileUser] = useState<string>("");
    const [profileName, setProfileName] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");
    const [profileDescription, setProfileDescription] = useState<string>("");

    //constants
    const navigate = useNavigate();
    const { TextArea } = Input;


    //functions
    const showEditTweetModal = () => {
        if (editTweetID != "") {
            getTweetByID(editTweetID).then((r) => {
                setTimeout(() => {
                    setContentEditTweet(r.data.description);
                    console.log(r.data.description);
                    console.log({ "content": contentEditTweet });
                }, 0);
                setOpen(true);
            })
        }
    };

    const showEditProfileModal = () => {
        if (editProfile != false) {
            setOpenProfile(true);


        }
    };

    const infiniteScroll = () => {
        //add if page < total else setHasMore(false), 
        //send total pages in json (count results in get tweets of a user, divide it by 10 and round up)
        if (page < totalPages) {
            setTimeout(() => {
                setPage(page + 1);
            }, 100);

        } else {
            setHasMore(false)
        }
    };

    //Handlers
    //Handler refresh on crate - edit tweet

    const handleEditTweet: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setContentEditTweet(e.target.value);
        console.log(e.target.value);
    }

    const handleProfileUser: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProfileUser(e.target.value);
    }
    const handleProfileName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProfileName(e.target.value);
    }
    const handleProfileImage: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProfileImage(e.target.value);
    }
    const handleProfileDescription: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setProfileDescription(e.target.value);
    }

    const handleRefresh = () => {
        setTimeout(() => {
            //    window.location.reload();
            getTweets(user.user, "1").then((r) => {
                const tweetIds = Object.keys(r.data.tweets);
                let auxiliarArray = tweetsArray;
                auxiliarArray.unshift(r.data.tweets[tweetIds[tweetIds.length - 1]]);
                setTweetsArray(auxiliarArray);
                console.log(tweetsArray);
                setListTweetsKey((prevKey) => prevKey === 'initialKey' ? 'refreshKey' : 'initialKey');
            });

        }, 500);
    }

    //Handlers edit tweet modal
    const handleEditTweetOK = () => {
        if (contentEditTweet !== "") {
            setConfirmLoading(true);
            setTimeout(() => {
                editTweet(contentEditTweet, editTweetID).then(() => {
                    const updatedTweets = tweetsArray.map((tweet) => {
                        if (tweet.tweetID === +editTweetID) {
                            return { ...tweet, description: contentEditTweet };
                        } else {
                            return tweet;
                        }
                    });
                    setTweetsArray(updatedTweets);
                    setListTweetsKey((prevKey) => prevKey === 'initialKey' ? 'refreshKey' : 'initialKey');
                    setEditTweetID('');
                    setOpen(false);
                    setConfirmLoading(false);
                })
            }, 500);
        }
    };

    const handleEditTweetCancel = () => {
        console.log('Clicked cancel button xxx');
        setEditTweetID('');
        console.log(editTweetID)
        setOpen(false);
    };

    //Handlers edit profile modal
    const handleEditProfileOK = () => {
        setConfirmLoadingProfile(true);
        setIsLoading(true);
        setTimeout(() => {
            editUserProfile(profleUser, profileName, profileImage, profileDescription).then(() => {
                profleUser !== "" ?
                    setUser({ userid: user.userid, user: profleUser, name: profileName, userImage: profileImage, description: profileDescription })
                    :
                    setUser({ userid: user.userid, user: user.user, name: profileName, userImage: profileImage, description: profileDescription })


                setOpenProfile(false);
                setIsLoading(false);
                setConfirmLoadingProfile(false);
                setEditProfile(false);

            })
            setOpenProfile(false);
            setConfirmLoadingProfile(false);

        }, 500);
    };

    const handleEditProfileCancel = () => {
        console.log('Clicked cancel button');
        setEditProfile(false);
        setOpenProfile(false);
    };

    //useEffect Hooks
    useEffect(() => {
        if (!userLoaded) {
            getUserData().then((r) => {
                setUser(r.data);
                setUserLoaded(true);
                setProfileName(r.data.name);
                setProfileImage(r.data.userImage);
                setProfileDescription(r.data.description);
            }).catch((e) => {
                console.log(e);
            });
        }
    }, [])

    useEffect(() => {
        if (userLoaded && hasmore) {
            saveTweets({ user, page, setTotalPages, setTweetsArray, setIsLoading, hasmore });
        }
        console.log({ "tweets ": tweetsArray });
    }, [page, user]);

    useEffect(() => {
        showEditTweetModal();
    }, [editTweetID]);

    useEffect(() => {
        if (editProfile === true) {
            console.log(true);
            showEditProfileModal();
        }
    }, [editProfile])

    //Loader
    if (isLoading) {
        return loaderPlaceholder();
    }

    //Main JSX
    return (
        <>
            <SidebarTemplate handleRefresh={handleRefresh}>
                <div className='main'>
                    <div className='profile-container'>
                        <img className='profile_img' src={user.userImage}></img>
                        <div className='profile_button' onClick={() => setEditProfile(true)}>Edit profile</div>
                        <div className='profile_user'> {user.user}</div>
                        <div className='profile_name'>{user.name}</div>
                        <div className='profile_description'>{user.description}</div>
                        <span className='profile_following'> {user.following} </span>
                        <span className='profile_following_text'>Following</span>
                        <span className='profile_followers'> {user.followers}  </span>
                        <span className='profile_followers_text'>Followers</span>
                    </div>
                    <div className='tweets_container'>
                        {listTweets({ keyToUpdate: listTweetsKey, tweetsArray, setEditTweetID, user, navigate, setTweetsArray, setListTweetsKey })}
                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={"-150px"}   // Adjust the offset if needed
                />
            </SidebarTemplate>
            <Modal
                title="Edit Tweet"
                open={open}
                onOk={handleEditTweetOK}
                confirmLoading={confirmLoading}
                onCancel={handleEditTweetCancel}>
                {inputWithSize(handleEditTweet, rowsLength, contentEditTweet)}
            </Modal>


            <Modal
                title="Edit profile"
                open={openProfile}
                onOk={handleEditProfileOK}
                confirmLoading={confirmLoadingProfile}
                onCancel={handleEditProfileCancel}
            >
                <Typography.Title level={5} style={{ fontSize: "16px" }}>Username</Typography.Title>
                {inputOneLine("20px", 15, handleProfileUser, profleUser)}
                <Typography.Title level={5} style={{ fontSize: "16px" }}>Name</Typography.Title>
                {inputOneLine("20px", 45, handleProfileName, profileName)}
                <Typography.Title level={5} style={{ fontSize: "16px" }}>Image link </Typography.Title>
                {inputOneLine("20px", 100, handleProfileImage, profileImage)}
                <Typography.Title level={5} style={{ fontSize: "16px" }}>Description</Typography.Title>
                {inputOneLine("20px", 200, handleProfileDescription, profileDescription)}
            </Modal>

        </>
    );
}

export default Profile;