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

const EditProfile = ({ user, membership }) => {
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

  const plan = membership?.plan;
  const purchases = membership?.purchases || [];

  return (
    <>
      <div className="mt-5 flex w-full flex-col items-stretch gap-5 lg:flex-row">
        <div className="hover-lift min-w-0 flex-1 rounded-[1.8rem] border border-white/10 bg-[#121218]/90 p-6 shadow-2xl sm:p-7">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-300">Your profile</p>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Edit profile</h2>
              <p className="mt-1 text-sm text-white/50">Changes save to your account. First name needs at least 2 characters.</p>
            </div>

            {plan && (
              <div className="rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-200">Membership</p>
                <p className="mt-1 text-xl font-extrabold">{plan.name}</p>
                <p className="text-sm opacity-70">{plan.tagline}</p>
                <p className="mt-2 text-sm font-semibold">
                  {plan.displayPrice}/{plan.period}
                  {membership?.membershipExpiresAt
                    ? " · renews " + new Date(membership.membershipExpiresAt).toLocaleDateString()
                    : ""}
                </p>
              </div>
            )}

            <label className="field">
              <span>Email</span>
              <input type="email" value={emailId} onChange={(e) => setEmailId(e.target.value)} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field">
                <span>First name</span>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </label>
              <label className="field">
                <span>Last name</span>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </label>
              <label className="field">
                <span>Age</span>
                <input type="number" min="18" value={age} onChange={(e) => setAge(e.target.value)} />
              </label>
              <label className="field">
                <span>Gender</span>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <img
                src={photoUrl || "/Logo.png"}
                alt="Selected profile"
                className="h-20 w-20 rounded-2xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold">Profile photo</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={choosePhoto} />
                <button type="button" className="photo-pick mt-2" onClick={() => fileRef.current?.click()}>
                  Choose photo
                </button>
                <p className="mt-2 text-xs text-white/45">
                  {saving ? "Saving to your account..." : "JPG, PNG, or WEBP up to 10 MB."}
                </p>
              </div>
            </div>

            <label className="field">
              <span>About</span>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} />
            </label>

            <label className="field">
              <span>Skills</span>
              <input
                type="text"
                value={skills}
                placeholder="React, Node, MongoDB"
                onChange={(e) => setSkills(e.target.value)}
              />
              {skillList.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {skillList.map((skill) => (
                    <span key={skill} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-sm font-semibold">Password</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="field">
                  <span>Current</span>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </label>
                <label className="field">
                  <span>New</span>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
              </div>
              <button
                type="button"
                className="photo-pick mt-3"
                onClick={updatePassword}
                disabled={saving || !currentPassword || !newPassword}
              >
                Update password
              </button>
            </div>

            {error && (
              <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {typeof error === "string" ? error : "Could not save"}
              </p>
            )}
            <div className="flex justify-end">
              <button type="button" className="save-profile" onClick={saveProfile} disabled={!changed || saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full shrink-0 space-y-4 lg:w-[24rem]">
          <p className="text-sm font-medium opacity-70">Preview</p>
          <UserCard
            user={{ firstName, lastName, photoUrl, age, gender, about, skills: skillList }}
            showActions={false}
          />
          {purchases.length > 0 && (
            <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] opacity-50">Stored in database</p>
              <ul className="mt-3 space-y-2 text-sm">
                {purchases.map((item) => (
                  <li key={item._id} className="flex items-center justify-between gap-2">
                    <span className="capitalize font-semibold">{item.plan}</span>
                    <span className="text-xs opacity-55">
                      {item.status} · {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
