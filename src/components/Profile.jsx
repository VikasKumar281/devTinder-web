import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import PageLoader, { withMinDelay } from "./PageLoader";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    withMinDelay(Promise.resolve()).then(() => {
      if (live) setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  if (loading || !user) return <PageLoader label="Loading profile" />;

  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
