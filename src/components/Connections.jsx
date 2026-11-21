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
      <div className="page-align">
        <EmptyState
          emoji="◎"
          title="No connections yet"
          text="When someone accepts your request, they show up here."
        />
      </div>
    );
  }

  return (
    <div className="page-align">
      <section className="hover-lift flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-gradient-to-br from-rose-500/20 via-[#151018] to-amber-400/10 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-200">Matches</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Connections</h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            People who already said yes. Open a chat and start building together.
          </p>
        </div>
        <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
          {connections.length} match{connections.length === 1 ? "" : "es"}
        </p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, photoUrl, gender, about, skills } = connection;
          return (
            <article
              key={_id}
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
              <Link to={"/chat/" + _id} className="save-profile mt-4 w-full">
                Chat
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
