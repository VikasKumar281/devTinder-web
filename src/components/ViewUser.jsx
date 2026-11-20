import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const ViewUser = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      setError("");
      setSent("");
      setProfile(null);
      try {
        const res = await axios.get(BASE_URL + "/user/view/" + userId, {
          withCredentials: true,
        });
        setProfile(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not open this profile");
      }
    };
    loadUser();
  }, [userId]);

  if (error) {
    return <p className="p-10 text-center text-error">{error}</p>;
  }

  if (!profile) {
    return <p className="p-10 text-center text-sm opacity-60">Loading profile...</p>;
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-8">
      <UserCard
        user={profile}
        showActions
        onSent={(status) =>
          setSent(status === "interested" ? "Request sent" : "Passed")
        }
      />
      {sent && <p className="mt-4 text-sm text-success">{sent}</p>}
    </div>
  );
};

export default ViewUser;
