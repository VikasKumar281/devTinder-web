import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  
  const userId = useSelector((store) => store.user?._id);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) getFeed();
  }, [userId]);

  if (!feed) return;

  if (feed.length <= 0) {
    return (
      <div className="mx-auto my-16 max-w-md px-4 text-center">
        <h1 className="text-2xl font-semibold">You are all caught up</h1>
        <p className="mt-2 text-sm opacity-70">No new developers in your feed right now.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full justify-center px-4 py-8">
      <UserCard key={feed[0]._id} user={feed[0]} showActions={true} />
    </div>
  );
};

export default Feed;