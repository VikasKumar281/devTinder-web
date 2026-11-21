import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import PageLoader, { withMinDelay } from "./PageLoader";
import EmptyState from "./EmptyState";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      await withMinDelay(async () => {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        dispatch(addRequests(res?.data?.data));
      });
    } catch (err) {
      console.error(err);
      dispatch(addRequests([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading || !requests) {
    return <PageLoader label="Loading requests" variant="list" />;
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        emoji="✉"
        title="No requests"
        text="New connection requests will land here."
      />
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] opacity-50">Inbox</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Requests</h1>
        </div>
        <span className="shrink-0 rounded-full bg-rose-500/15 px-3 py-1 text-sm font-medium text-rose-300">
          {requests.length} new
        </span>
      </div>

      <div className="flex max-w-md flex-col gap-3">
        {requests.map((request) => {
          const person = request.fromUserId || {};
          const { firstName, lastName, age, photoUrl, gender, about, skills } = person;
          return (
            <article
              key={request._id}
              className="rounded-3xl border border-white/10 bg-base-200/80 p-4 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <img
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  loading="lazy"
                  src={photoUrl || "/Logo.png"}
                />
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">
                    {firstName} {lastName}
                    {age ? <span className="ml-2 font-normal opacity-60">{age}</span> : null}
                  </h2>
                  {gender && <p className="text-xs capitalize opacity-60">{gender}</p>}
                  <p className="mt-1 line-clamp-2 text-sm opacity-80">{about}</p>
                </div>
              </div>
              {Array.isArray(skills) && skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 px-2 py-1 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  className="btn btn-sm flex-1 rounded-full border-white/10 bg-base-300 transition hover:border-white/30 hover:bg-white/10"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Pass
                </button>
                <button
                  className="btn btn-sm flex-1 rounded-full border-none bg-rose-500 text-white transition hover:bg-rose-400 hover:shadow-lg hover:shadow-rose-500/30"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
