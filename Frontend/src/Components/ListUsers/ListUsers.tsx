import { Empty } from "antd";
interface propsI {
  keyToUpdate: string;
  usersArray: {}[];
  navigate: any;
}

interface objectI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const listUsers = ({ usersArray, navigate }: propsI) => {
  if (usersArray) {
    const users = usersArray.map((user: objectI) => (
      <>
        <div key={user.userId} id={user.userId} className="user_container">
          <img
            className="user_image"
            src={user.userImage}
            onClick={() => navigate("/user/" + user.user)}
          ></img>
          <div className="user" onClick={() => navigate("/user/" + user.user)}>
            {user.user}{" "}
          </div>
          <div className="name">{user.name}</div>
          <div className="user_followers">{user.followers} Followers</div>
          <div className="follow_user"></div>
        </div>
      </>
    ));
    return users;
  } else {
    return (
      <>
        <div className="user_container">
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            description={
              <span style={{ color: "white" }}>Theres no users found :c </span>
            }
          />
        </div>
      </>
    );
  }
};

export default listUsers;
