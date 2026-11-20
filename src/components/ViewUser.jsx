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
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setError("");
      setSent("");
      setDetailsOpen(false);
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
    <div className="mx-auto flex w-full flex-col items-center justify-center gap-[1cm] px-4 py-8 lg:flex-row lg:items-stretch">
      <UserCard
        user={profile}
        showActions
        onPhotoClick={() => setDetailsOpen(true)}
        onSent={(status) => {
          setDetailsOpen(false);
          setSent(status === "interested" ? "Request sent" : "Passed");
        }}
      />
      {detailsOpen && (
        <aside className="flex h-[36rem] w-full max-w-[22rem] flex-col overflow-hidden rounded-[2rem] bg-base-200 shadow-2xl ring-1 ring-white/10">
          <div className="relative h-3/5 shrink-0">
            <img
              src={profile.photoUrl || "/Logo.png"}
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
              {profile.firstName} {profile.lastName}
              {profile.age ? <span className="ml-2 font-light opacity-70">{profile.age}</span> : null}
            </h2>
            {profile.gender && <p className="mt-1 text-sm capitalize opacity-60">{profile.gender}</p>}
            <p className="mt-3 text-sm leading-relaxed opacity-85">{profile.about}</p>
            {Array.isArray(profile.skills) && profile.skills.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] uppercase tracking-[0.16em] opacity-50">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
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
      {sent && <p className="text-sm text-success lg:self-end">{sent}</p>}
    </div>
  );
};

export default ViewUser;
