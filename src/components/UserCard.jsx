import axios from "axios";
import { useRef, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({
  user,
  showActions = true,
  onSent,
  onPhotoClick,
  swipeable = false,
  stacked = false,
}) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();
  const cardRef = useRef(null);
  const drag = useRef({ active: false, x: 0, y: 0, startX: 0, startY: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSendRequest = async (status) => {
    if (!_id || busy) return;
    setBusy(true);
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(_id));
      if (onSent) onSent(status);
    } catch (err) {
      console.error(err);
      setBusy(false);
      setLeaving("");
      setOffset({ x: 0, y: 0 });
    }
  };

  const fly = (dir) => {
    if (!showActions || busy) return;
    setLeaving(dir);
    setOffset({ x: dir === "right" ? 520 : -520, y: 30 });
    setTimeout(() => handleSendRequest(dir === "right" ? "interested" : "ignored"), 220);
  };

  const onPointerDown = (event) => {
    if (!swipeable || !showActions || busy) return;
    drag.current = { active: true, x: 0, y: 0, startX: event.clientX, startY: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current.active) return;
    const x = event.clientX - drag.current.startX;
    const y = event.clientY - drag.current.startY;
    drag.current.x = x;
    drag.current.y = y;
    setOffset({ x, y });
  };

  const onPointerUp = () => {
    if (!drag.current.active) {
      if (!swipeable && onPhotoClick) onPhotoClick();
      return;
    }
    drag.current.active = false;
    const moved = Math.abs(drag.current.x) + Math.abs(drag.current.y);
    if (drag.current.x > 110) fly("right");
    else if (drag.current.x < -110) fly("left");
    else {
      setOffset({ x: 0, y: 0 });
      if (moved < 10 && onPhotoClick) onPhotoClick();
    }
  };

  const rotate = offset.x / 18;
  const likeOpacity = Math.min(1, Math.max(0, offset.x / 120));
  const nopeOpacity = Math.min(1, Math.max(0, -offset.x / 120));

  return (
    <article
      ref={cardRef}
      className={"tinder-card " + (stacked ? "tinder-card-stack" : "") + (leaving ? " tinder-card-gone" : "")}
      style={
        swipeable
          ? {
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotate}deg)`,
              transition: drag.current.active ? "none" : "transform 0.28s ease",
              cursor: onPhotoClick ? "pointer" : "grab",
            }
          : { cursor: onPhotoClick ? "pointer" : "default" }
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={() => {
        if (!swipeable && onPhotoClick) onPhotoClick();
      }}
    >
      <img
        className="tinder-photo"
        loading="lazy"
        src={photoUrl || "/Logo.png"}
        alt={`${firstName || "User"} photo`}
        draggable={false}
      />
      <div className="tinder-fade" />

      <div className="tinder-stamp tinder-like" style={{ opacity: likeOpacity }}>
        LIKE
      </div>
      <div className="tinder-stamp tinder-nope" style={{ opacity: nopeOpacity }}>
        NOPE
      </div>

      <div className="tinder-meta">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[1.85rem] font-extrabold leading-tight tracking-tight">
              {firstName || ""}
              {lastName ? <span className="ml-1 font-semibold">{lastName}</span> : null}
              {age ? <span className="ml-2 font-light opacity-90">{age}</span> : null}
            </h2>
            {gender && <p className="mt-0.5 text-sm capitalize text-white/70">{gender}</p>}
          </div>
          {onPhotoClick && (
            <button
              type="button"
              className="tinder-info"
              aria-label="Profile info"
              onClick={(event) => {
                event.stopPropagation();
                onPhotoClick();
              }}
              onPointerDown={(event) => event.stopPropagation()}
            >
              i
            </button>
          )}
        </div>
        {about && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/90">{about}</p>}
        {Array.isArray(skills) && skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill) => (
              <span key={skill} className="rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="tinder-actions" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" className="tinder-btn tinder-btn-nope" onClick={() => fly("left")} aria-label="Pass">
            ✕
          </button>
          <button type="button" className="tinder-btn tinder-btn-like" onClick={() => fly("right")} aria-label="Like">
            ♥
          </button>
        </div>
      )}
    </article>
  );
};

export default UserCard;
