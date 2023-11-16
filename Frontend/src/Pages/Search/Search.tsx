import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import getUserData from '../../API/GetUserData';
import getTweetByID from '../../API/GetTweetByID';
import editTweet from '../../API/EditTweet';
import saveTweets from '../../Components/SaveTweets/SaveTweets';
import getTweets from '../../API/GetTweets';
import './Search.css'

interface objectI {
    [key: string]: any
}

const Search = () => {

    //useState Hooks   
    const [user, setUser] = useState<objectI>({});
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasmore, setHasMore] = useState<boolean>(true);

    //constants
    const navigate = useNavigate();
    const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

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



    //Loader
    if (isLoading) {
        return <div className="spin_loader"><Spin indicator={antIcon} /></div>;
    }

    //Main JSX
    return (
        <>
            <SidebarTemplate handleRefresh={handleRefresh}>
                <div className='main'>
                    <div className='profile-container'>

                    </div>

                    <div className='tweets_container'>

                    </div>
                </div >
                <Waypoint
                    onEnter={infiniteScroll} // Call your function when entering the waypoint (user reaches the bottom)
                    bottomOffset={"-150px"}   // Adjust the offset if needed
                />
            </SidebarTemplate>
        </>
    );
}

export default Search;