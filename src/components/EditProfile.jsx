import { useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const toSkillList = (value) =>
  String(value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || ""
  );
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();
  const skillList = toSkillList(skills);

  const saveProfile = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age: age === "" ? undefined : Number(age),
          gender: gender || undefined,
          about,
          skills: skillList,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err.response?.data || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto my-8 flex w-full max-w-6xl flex-col items-start justify-center gap-8 px-4 lg:flex-row">
        <div className="card w-full max-w-xl bg-base-200 shadow-xl">
          <div className="card-body gap-4">
            <div>
              <h2 className="card-title text-2xl">Edit profile</h2>
              <p className="mt-1 text-sm opacity-70">
                This is how you appear on the feed. First name needs at least 4 characters.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <span className="label-text mb-1">First name</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Age</span>
                <input
                  type="number"
                  min="18"
                  value={age}
                  className="input input-bordered w-full"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Gender</span>
                <select
                  value={gender}
                  className="select select-bordered w-full"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1">Photo URL</span>
              <input
                type="url"
                value={photoUrl}
                className="input input-bordered w-full"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">About</span>
              <textarea
                value={about}
                className="textarea textarea-bordered min-h-28 w-full"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Skills</span>
              <input
                type="text"
                value={skills}
                placeholder="React, Node, MongoDB"
                className="input input-bordered w-full"
                onChange={(e) => setSkills(e.target.value)}
              />
              <span className="mt-1 text-xs opacity-60">Separate skills with commas.</span>
              {skillList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span key={skill} className="badge badge-primary badge-outline">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <p className="text-sm text-error">{error}</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <p className="mb-3 text-sm font-medium opacity-70">Preview</p>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about, skills: skillList }}
            showActions={false}
          />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
