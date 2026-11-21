import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import PageLoader, { withMinDelay } from "./PageLoader";
import EmptyState from "./EmptyState";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      await withMinDelay(async () => {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(addConnections(res?.data?.data));
      });
    } catch (err) {
      console.error(err);
      dispatch(addConnections([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading || !connections) {
    return <PageLoader label="Loading connections" variant="list" />;
  }

  if (connections.length === 0) {
    return (
      <EmptyState
        emoji="◎"
        title="No connections yet"
        text="When someone accepts your request, they show up here."
      />
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] opacity-50">Matches</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Connections</h1>
        </div>
        <span className="shrink-0 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
          {connections.length}
        </span>
      </div>

      <div className="flex max-w-md flex-col gap-3">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, photoUrl, gender, about, skills } = connection;
          return (
            <article
              key={_id}
              className="hover-lift rounded-3xl border border-white/10 bg-base-200/80 p-4 shadow-lg backdrop-blur"
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
              <Link to={"/chat/" + _id} className="mt-4 block">
                <button className="btn btn-primary btn-sm w-full rounded-full transition hover:brightness-110">
                  Chat
                </button>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
