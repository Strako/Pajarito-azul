import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Waypoint } from 'react-waypoint';
import SidebarTemplate from '../../Templates/SidebarTemplate';
import Input from '../../Components/Inputs/Input';
import loaderPlaceholder from '../../Components/LoaderPlaceholder/Loader';
import searchUser from '../../API/SearchUser';
import listUsers from '../../Components/ListUsers/ListUsers';
import './Search.css'
import { Empty } from 'antd';

interface objectI {
    [key: string]: any
}

const Search = () => {

    //useState Hooks   
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasmore, setHasMore] = useState<boolean>(true);
    const [searchValue, setSerchValue] = useState<string>("");
    const [usersArray, setUsersArray] = useState<{}[]>([{}]);
    const [listUsersKey, setListUsersKey] = useState<string>('initialKey');


    //Constants
    const navigate = useNavigate();
    const forbiddenKeys = [
        'Backspace',
        'Shift',
        'Control',
        'Alt',
        'CapsLock',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
      ];

    //Handlers
    const handlerSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSerchValue(e.target.value);
    }

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

    useEffect(() =>{
        if (searchValue != "") {
            setIsLoading(false);
            setTimeout(() => {
                searchUser(searchValue).then((r) => {
                    setUsersArray(r.data.users);
                    setIsLoading(false);
                    setListUsersKey((prevKey) => prevKey === 'initialKey' ? 'refreshKey' : 'initialKey');
                });
            }, 500);
        }
    }, [searchValue])

    //Loader
    if (isLoading) {
        return loaderPlaceholder();
    }

    //Main JSX
    return (
        <>
            <SidebarTemplate>
                <div className='main'>
                    <div className='searchbar-container'>
                        <Input
                            type={"text"}
                            placeholder={"Search user"}
                            value={searchValue}
                            onChange={handlerSearch}
                        />
                    </div>
                    <div className="results_container">
                        {searchValue === "" ? (
                            <div className="user_container">
                                <Empty   image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" description={<span style={{ color: 'white' }}>Search for a user ! </span>} />
                            </div>
                        ) :
                            listUsers({ keyToUpdate: listUsersKey, usersArray, navigate })

                        }
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