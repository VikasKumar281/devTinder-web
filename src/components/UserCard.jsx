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
    <div className="card w-full max-w-sm overflow-hidden bg-base-200 shadow-xl">
      <figure className="h-80 w-full overflow-hidden bg-base-300">
        <img
          className="h-full w-full object-cover"
          src={photoUrl || "/Logo.png"}
          alt={`${firstName || "User"} photo`}
        />
      </figure>
      <div className="card-body gap-2">
        <h2 className="card-title">{`${firstName || ""} ${lastName || ""}`}</h2>
        {age && gender && <p className="text-sm opacity-70">{`${age} · ${gender}`}</p>}
        <p className="text-sm">{about}</p>
        {Array.isArray(skills) && skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

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