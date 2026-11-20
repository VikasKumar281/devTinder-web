import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="mx-auto my-16 max-w-md px-4 text-center">
        <h1 className="text-3xl font-semibold">No connections yet</h1>
        <p className="mt-2 text-sm opacity-70">When someone accepts your request, they show up here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-50">Matches</p>
          <h1 className="text-2xl font-semibold sm:text-3xl">Connections</h1>
        </div>
        <span className="rounded-full bg-base-200 px-3 py-1 text-sm">{connections.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, photoUrl, gender, about } = connection;
          return (
            <article
              key={_id}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-base-200 shadow-lg"
            >
              <div className="flex items-center gap-3 p-3 sm:block sm:p-0">
                <img
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-52 sm:w-full sm:rounded-none"
                  loading="lazy"
                  src={photoUrl || "/Logo.png"}
                />
                <div className="min-w-0 sm:p-4">
                  <h2 className="truncate text-base font-semibold sm:text-lg">
                    {firstName + " " + lastName}
                  </h2>
                  {age && gender && (
                    <p className="text-sm capitalize opacity-60">{age + " · " + gender}</p>
                  )}
                  <p className="mt-1 line-clamp-2 text-sm opacity-80">{about}</p>
                </div>
              </div>
              <div className="mt-auto px-3 pb-3 sm:px-4 sm:pb-4">
                <Link to={"/chat/" + _id} className="block">
                  <button className="btn btn-primary btn-sm w-full rounded-full">Chat</button>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
