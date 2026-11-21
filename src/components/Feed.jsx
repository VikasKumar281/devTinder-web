import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import PageLoader, { withMinDelay } from "./PageLoader";
import EmptyState from "./EmptyState";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.user?._id);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getFeed = async () => {
    setLoading(true);
    try {
      await withMinDelay(async () => {
        const res = await axios.get(BASE_URL + "/user/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res?.data?.data));
      });
    } catch (err) {
      console.error(err);
      dispatch(addFeed([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) getFeed();
  }, [userId]);

  useEffect(() => {
    setDetailsOpen(false);
  }, [feed?.[0]?._id]);

  if (loading || !feed) {
    return <PageLoader label="Finding developers" variant="card" />;
  }

  if (feed.length <= 0) {
    return (
      <EmptyState
        emoji="✦"
        title="You are all caught up"
        text="No new developers in your feed right now. Check back soon."
      />
    );
  }

  const person = feed[0];
  const stack = feed.slice(0, 3);

  return (
    <div className="page-align tinder-feed">
      <aside className="feed-rail">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-300">Discover</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Today’s stack</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          {feed.length} developer{feed.length === 1 ? "" : "s"} left. Swipe right to connect, left to pass.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-extrabold">{feed.length}</p>
            <p className="text-xs text-white/50">In queue</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-extrabold">{person.skills?.length || 0}</p>
            <p className="text-xs text-white/50">Skills shown</p>
          </div>
        </div>
      </aside>
      <div className="tinder-stage">
        <div className="tinder-deck">
          {stack
            .slice()
            .reverse()
            .map((card, index, list) => {
              const front = index === list.length - 1;
              return (
                <div
                  key={card._id}
                  className="tinder-layer"
                  style={{
                    transform: front
                      ? "none"
                      : `scale(${1 - (list.length - 1 - index) * 0.045}) translateY(${(list.length - 1 - index) * 14}px)`,
                    zIndex: index + 1,
                  }}
                >
                  <UserCard
                    user={card}
                    showActions={front}
                    swipeable={front}
                    stacked={!front}
                    onPhotoClick={front ? () => setDetailsOpen(true) : undefined}
                    onSent={() => setDetailsOpen(false)}
                  />
                </div>
              );
            })}
        </div>

        {detailsOpen && (
          <aside className="feed-info-card">
            <div className="relative h-[58%] shrink-0">
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
      <p className="tinder-hint">Tap the photo for profile · Swipe right to like · Swipe left to pass</p>
    </div>
  );
};

export default Feed;
