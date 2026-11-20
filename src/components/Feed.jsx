import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  
  const userId = useSelector((store) => store.user?._id);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) getFeed();
  }, [userId]);

  if (!feed) return;

  if (feed.length <= 0) {
    return (
      <div className="mx-auto my-16 max-w-md px-4 text-center">
        <h1 className="text-2xl font-semibold">You are all caught up</h1>
        <p className="mt-2 text-sm opacity-70">No new developers in your feed right now.</p>
      </div>
    );
  }

  const person = feed[0];

  return (
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-[1cm] px-4 py-8 lg:flex-row lg:items-stretch">
      <UserCard
        key={person._id}
        user={person}
        showActions={true}
        onPhotoClick={() => setDetailsOpen(true)}
        onSent={() => setDetailsOpen(false)}
      />
      {detailsOpen && (
        <aside className="flex h-[36rem] w-full max-w-[22rem] flex-col overflow-hidden rounded-[2rem] bg-base-200 shadow-2xl ring-1 ring-white/10">
          <div className="relative h-3/5 shrink-0">
            <img
              src={person.photoUrl || "/Logo.png"}
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <button
              type="button"
              className="btn btn-sm absolute right-3 top-3 rounded-full border-none bg-black/60 text-white"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              {person.firstName} {person.lastName}
              {person.age ? <span className="ml-2 font-light opacity-70">{person.age}</span> : null}
            </h2>
            {person.gender && <p className="mt-1 text-sm capitalize opacity-60">{person.gender}</p>}
            <p className="mt-3 text-sm leading-relaxed opacity-85">{person.about}</p>
            {Array.isArray(person.skills) && person.skills.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] opacity-50">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {person.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-base-300 px-3 py-1 text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
};

export default Feed;