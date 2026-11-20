import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true, onSent, onPhotoClick }) => {
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
      if (onSent) onSent(status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="relative h-[36rem] w-full max-w-[22rem] shrink-0 overflow-hidden rounded-[2rem] bg-neutral-900 shadow-2xl ring-1 ring-white/10"
      onClick={onPhotoClick}
    >
      <img
        className={"absolute inset-0 h-full w-full object-cover object-top " + (onPhotoClick ? "cursor-pointer" : "")}
        loading="lazy"
        src={photoUrl || "/Logo.png"}
        alt={`${firstName || "User"} photo`}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-6 pt-28 text-white">
        <h2 className="text-3xl font-bold tracking-tight">
          {firstName || ""}
          {age ? <span className="ml-2 font-light">{age}</span> : null}
        </h2>
        {gender && <p className="mt-1 text-sm capitalize text-white/70">{gender}</p>}
        {about && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/90">{about}</p>}
        {Array.isArray(skills) && skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill) => (
              <span key={skill} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
                {skill}
              </span>
            ))}
          </div>
        )}
        {showActions && (
          <div className="mt-5 flex items-center justify-center gap-6">
            <button
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-slate-700 shadow-lg"
              onClick={(event) => {
                event.stopPropagation();
                handleSendRequest("ignored", _id);
              }}
              aria-label="Pass"
            >
              ✕
            </button>
            <button
              className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-3xl text-white shadow-lg shadow-rose-500/40"
              onClick={(event) => {
                event.stopPropagation();
                handleSendRequest("interested", _id);
              }}
              aria-label="Like"
            >
              ♥
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;