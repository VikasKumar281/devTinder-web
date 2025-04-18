import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true }) => {
  // console.log(user);
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      <figure className="w-full h-70 overflow-hidden">
        <img className="w-full h-full object-cover" src={photoUrl} alt="User Photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
        {age && gender && <p>{`${age}, ${gender}`}</p>}
        <p>{about}</p>
        <p>{skills}</p>

        {showActions && (
          <div className="card-actions justify-center my-4">
            <button className="btn btn-primary" onClick={() => handleSendRequest("ignored", _id)}>
              Ignore
            </button>
            <button className="btn btn-secondary" onClick={() => handleSendRequest("interested", _id)}>
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;