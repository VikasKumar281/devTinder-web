import { useRef, useState } from "react";
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
  const [emailId, setEmailId] = useState(user.emailId || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || ""
  );
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const saved = useRef({
    firstName: user.firstName || "",
    emailId: user.emailId || "",
    lastName: user.lastName || "",
    photoUrl: user.photoUrl || "",
    age: user.age ? String(user.age) : "",
    gender: user.gender || "",
    about: user.about || "",
    skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
  });
  const skillList = toSkillList(skills);
  const changed =
    firstName !== saved.current.firstName ||
    emailId !== saved.current.emailId ||
    lastName !== saved.current.lastName ||
    photoUrl !== saved.current.photoUrl ||
    String(age) !== saved.current.age ||
    gender !== saved.current.gender ||
    about !== saved.current.about ||
    skills !== saved.current.skills;

  const choosePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("Photo must be 10 MB or smaller");
      return;
    }
    const allowed = /\.(jpe?g|png|webp)$/i.test(file.name);
    if (file.type && !file.type.startsWith("image/") && !allowed) {
      setError("Choose a JPG, PNG, or WEBP image");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Could not read that image. Try another file.");
    reader.onload = () => {
      const nextPhoto = reader.result;
      if (typeof nextPhoto !== "string") {
        setError("Could not read that image. Try another file.");
        return;
      }
      setPhotoUrl(nextPhoto);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setError("");
    if (firstName.trim().length < 2) {
      setError("First name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailId,
        age: age === "" ? undefined : Number(age),
        gender: gender || undefined,
        about,
        skills: skillList,
      };
      if (photoUrl) payload.photoUrl = photoUrl;
      const res = await axios.post(
        BASE_URL + "/profile/edit",
        payload,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      saved.current = {
        firstName,
        lastName,
        emailId,
        photoUrl,
        age: age === "" ? "" : String(age),
        gender,
        about,
        skills,
      };
      setToast("Profile saved");
      setTimeout(() => setToast(""), 2800);
    } catch (err) {
      setError(err.response?.data || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    setError("");
    setSaving(true);
    try {
      await axios.post(
        BASE_URL + "/profile/password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setCurrentPassword("");
      setNewPassword("");
      setToast("Password updated");
      setTimeout(() => setToast(""), 2800);
    } catch (err) {
      setError(err.response?.data || "Could not update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto my-8 flex w-full max-w-6xl flex-col items-start justify-center gap-8 px-4 lg:flex-row">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-base-200 p-6 shadow-xl">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-wide opacity-50">Your profile</p>
              <h2 className="text-2xl font-semibold">Edit profile</h2>
              <p className="mt-1 text-sm opacity-60">First name needs at least 2 characters.</p>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1">Email</span>
              <input
                type="email"
                value={emailId}
                className="input input-bordered w-full rounded-full"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            {user?.isPremium && user?.membershipType && user.membershipType !== "free" && (
              <p className="rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold capitalize text-amber-200">
                {user.membershipType} membership
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control w-full">
                <span className="label-text mb-1">First name</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full rounded-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full rounded-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Age</span>
                <input
                  type="number"
                  min="18"
                  value={age}
                  className="input input-bordered w-full rounded-full"
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Gender</span>
                <select
                  value={gender}
                  className="select select-bordered w-full rounded-full"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={photoUrl || "/Logo.png"}
                alt="Selected profile"
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <p className="mb-2 text-sm">Profile photo</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="block w-full max-w-xs cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-content hover:file:opacity-90"
                  onChange={choosePhoto}
                />
                <p className="mt-2 text-xs opacity-60">
                  {saving
                    ? "Saving photo in the database..."
                    : "JPG, PNG, or WEBP up to 10 MB. Press Save profile to store it."}
                </p>
                {error && <p className="mt-2 max-w-xs text-sm text-error">{error}</p>}
              </div>
            </div>

            <label className="form-control w-full">
              <span className="label-text mb-1">About</span>
              <textarea
                value={about}
                className="textarea textarea-bordered min-h-28 w-full rounded-3xl"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Skills</span>
              <input
                type="text"
                value={skills}
                placeholder="React, Node, MongoDB"
                className="input input-bordered w-full rounded-full"
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

            <div className="rounded-2xl border border-white/10 p-4">
              <p className="mb-3 text-sm font-medium">Password</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="password"
                  value={currentPassword}
                  placeholder="Current password"
                  className="input input-bordered w-full rounded-full"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  value={newPassword}
                  placeholder="New password"
                  className="input input-bordered w-full rounded-full"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <p className="mt-2 text-xs opacity-60">
                8+ characters with uppercase, lowercase, a number, and a symbol.
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm mt-3 rounded-full"
                onClick={updatePassword}
                disabled={saving || !currentPassword || !newPassword}
              >
                Update password
              </button>
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
            <div className="flex justify-end">
              <button
                className={
                  changed
                    ? "btn btn-primary rounded-full px-6"
                    : "btn rounded-full border-base-300 bg-base-300 px-6 text-base-content/70"
                }
                onClick={saveProfile}
                disabled={!changed || saving}
              >
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

      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className="flex items-center gap-3 rounded-full border border-emerald-400/30 bg-base-200 px-5 py-3 text-sm shadow-2xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-sm text-white">
              ✓
            </span>
            <span className="font-medium">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
