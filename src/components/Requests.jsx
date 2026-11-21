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
      <div className="page-align">
        <EmptyState
          emoji="✉"
          title="No requests"
          text="New connection requests will land here."
        />
      </div>
    );
  }

  return (
    <div className="page-align">
      <section className="hover-lift flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-[#151018] to-amber-400/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">Inbox</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Requests</h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Developers who want to connect. Accept to match, or pass to skip.
          </p>
        </div>
        <p className="inline-flex rounded-full bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-200">
          {requests.length} new
        </p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requests.map((request) => {
          const person = request.fromUserId || {};
          const { firstName, lastName, age, photoUrl, gender, about, skills } = person;
          return (
            <article
              key={request._id}
              className="hover-lift flex flex-col rounded-[1.6rem] border border-white/10 bg-[#121218]/90 p-4"
            >
              <div className="flex items-center gap-3">
                <img
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  loading="lazy"
                  src={photoUrl || "/Logo.png"}
                />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold">
                    {firstName} {lastName}
                    {age ? <span className="ml-2 font-medium text-white/50">{age}</span> : null}
                  </h2>
                  {gender && <p className="text-xs capitalize text-white/50">{gender}</p>}
                </div>
              </div>
              {about && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/70">{about}</p>}
              {Array.isArray(skills) && skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="rounded-full border border-white/10 px-2.5 py-1 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="h-11 flex-1 rounded-full border border-white/15 text-sm font-semibold"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Pass
                </button>
                <button
                  type="button"
                  className="save-profile flex-1"
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
