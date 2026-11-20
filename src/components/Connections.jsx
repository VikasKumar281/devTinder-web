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
        <h1 className="text-2xl font-semibold">No connections yet</h1>
        <p className="mt-2 text-sm opacity-70">When someone accepts your request, they show up here.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 w-full max-w-3xl px-4">
      <h1 className="mb-6 text-3xl font-bold">Connections</h1>
      <div className="flex flex-col gap-4">
        {connections.map((connection) => {
          const { _id, firstName, lastName, age, photoUrl, gender, about } = connection;
          return (
            <div key={_id} className="flex items-center gap-4 rounded-2xl bg-base-200 p-4 shadow-sm">
              <img
                alt=""
                className="h-16 w-16 rounded-full object-cover"
                src={photoUrl || "/Logo.png"}
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">{firstName + " " + lastName}</h2>
                {age && gender && <p className="text-sm opacity-70">{age + " · " + gender}</p>}
                <p className="truncate text-sm">{about}</p>
              </div>
              <Link to={"/chat/" + _id}>
                <button className="btn btn-primary btn-sm">Chat</button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
