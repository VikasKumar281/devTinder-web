import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import PageLoader, { withMinDelay } from "./PageLoader";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
          withCredentials: true,
        });
        const chatMessages = (chat?.data?.messages || []).map((msg) => {
          const { senderId, text } = msg;
          return {
            senderId: senderId?._id,
            firstName: senderId?.firstName,
            lastName: senderId?.lastName,
            text,
          };
        });
        setMessages(chatMessages);
      } catch (err) {
        console.error(err);
      }
    };
    const loadPerson = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/view/" + targetUserId, {
          withCredentials: true,
        });
        setPerson(res.data.data);
      } catch (err) {
        setPerson(null);
      }
    };
    setLoading(true);
    withMinDelay(Promise.all([fetchChatMessages(), loadPerson()])).finally(() => {
      setLoading(false);
    });
  }, [targetUserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = newMessage.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text,
    });
    setNewMessage("");
  };

  const title = person ? `${person.firstName} ${person.lastName || ""}` : "Chat";

  if (loading) return <PageLoader label="Loading chat" />;

  return (
    <div className="page-align flex h-[calc(100vh-8.5rem)] flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#121218]/90 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <img
            src={person?.photoUrl || "/Logo.png"}
            alt=""
            className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/15"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-300">Chat</p>
            <h1 className="text-lg font-extrabold leading-tight">{title}</h1>
            <p className="text-xs text-white/45">Messages stay in this chat</p>
          </div>
        </div>

        <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
          {messages.length === 0 && (
            <p className="m-auto text-sm text-white/45">Say hi to start the chat.</p>
          )}
          {messages.map((msg, index) => {
            const mine = msg.senderId
              ? String(msg.senderId) === String(userId)
              : user.firstName === msg.firstName;
            return (
              <div key={index} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                <div className="max-w-[75%]">
                  {!mine && (
                    <p className="mb-1 px-1 text-xs text-white/45">
                      {msg.firstName} {msg.lastName}
                    </p>
                  )}
                  <p
                    className={
                      "px-4 py-2.5 text-sm leading-relaxed " +
                      (mine
                        ? "rounded-2xl rounded-br-md bg-gradient-to-r from-rose-500 to-amber-400 text-white"
                        : "rounded-2xl rounded-bl-md border border-white/10 bg-white/10 text-white")
                    }
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <form
          className="flex items-center gap-2 border-t border-white/10 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write a message"
            className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm outline-none focus:border-rose-400/70 focus:shadow-[0_0_0_4px_rgba(244,63,94,0.15)]"
          />
          <button type="submit" className="save-profile h-12 px-6">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
