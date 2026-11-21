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
    <div className={"page-align tinder-feed" + (detailsOpen ? " feed-details" : "")}>
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
      </div>
      {detailsOpen && (
          <aside className="feed-info-card">
            <div className="relative h-[52%] shrink-0 overflow-hidden">
              <img
                src={person.photoUrl || "/Logo.png"}
                alt=""
                className="h-full w-full object-cover object-[center_18%]"
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
      <div className="feed-side">
      <aside className="feed-rail">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-200">Up next</p>
        <ul className="mt-4 space-y-3">
          {feed.slice(1, 4).map((next) => (
            <li key={next._id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-2">
              <img src={next.photoUrl || "/Logo.png"} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {next.firstName} {next.lastName}
                </span>
                <span className="block truncate text-xs text-white/45">
                  {(next.skills || []).slice(0, 2).join(" · ") || next.about || "Developer"}
                </span>
              </span>
            </li>
          ))}
          {feed.length < 2 && <li className="text-sm text-white/50">You’re on the last profile in this stack.</li>}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-white/55">
          A match opens chat. Requests you receive show up in the bell and on the Requests page.
        </p>
      </aside>
      <aside className="feed-rail">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-300">Discover</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Today’s stack</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          {feed.length} developer{feed.length === 1 ? "" : "s"} waiting. Like the ones you want to build with.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-2xl font-extrabold">{feed.length}</p>
            <p className="text-xs text-white/50">In queue</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-2xl font-extrabold">{person.skills?.length || 0}</p>
            <p className="text-xs text-white/50">Skills on this card</p>
          </div>
        </div>
        <div className="mt-5 space-y-2 text-sm text-white/70">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">How it works</p>
          <p>Swipe right or tap the heart to send a request.</p>
          <p>Swipe left or tap the cross to pass.</p>
          <p>Tap the photo or the i button for the full profile.</p>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default Feed;
