import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

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
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="mx-auto my-16 max-w-md px-4 text-center">
        <h1 className="text-3xl font-semibold">No requests</h1>
        <p className="mt-2 text-sm opacity-70">New connection requests will land here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 w-full max-w-3xl px-4">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-50">Inbox</p>
          <h1 className="text-3xl font-semibold">Requests</h1>
        </div>
        <span className="rounded-full bg-primary/15 px-3 py-1 text-sm text-primary">{requests.length} new</span>
      </div>
      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          const { firstName, lastName, age, photoUrl, gender, about } = request.fromUserId;
          return (
            <article key={request._id} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-base-200 p-4 shadow-lg sm:flex-row sm:items-center">
              <img
                alt=""
                className="h-20 w-20 rounded-2xl object-cover"
                loading="lazy"
                src={photoUrl || "/Logo.png"}
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">{firstName + " " + lastName}</h2>
                {age && gender && <p className="text-sm capitalize opacity-60">{age + " · " + gender}</p>}
                <p className="mt-1 line-clamp-2 text-sm opacity-80">{about}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm rounded-full" onClick={() => reviewRequest("rejected", request._id)}>
                  Pass
                </button>
                <button className="btn btn-primary btn-sm rounded-full px-5" onClick={() => reviewRequest("accepted", request._id)}>
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
