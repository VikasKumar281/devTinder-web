import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [person, setPerson] = useState(null);
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
    fetchChatMessages();
    loadPerson();
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

  return (
    <div className="mx-auto flex h-[calc(100vh-8.5rem)] w-full max-w-2xl flex-col px-4 py-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-base-200 shadow-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <img
            src={person?.photoUrl || "/Logo.png"}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <h1 className="font-semibold leading-tight">{title}</h1>
            <p className="text-xs opacity-50">Messages stay in this chat</p>
          </div>
        </div>

        <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <p className="m-auto text-sm opacity-50">Say hi to start the chat.</p>
          )}
          {messages.map((msg, index) => {
            const mine = msg.senderId
              ? String(msg.senderId) === String(userId)
              : user.firstName === msg.firstName;
            return (
              <div key={index} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                <div className={"max-w-[75%] " + (mine ? "items-end" : "items-start")}>
                  {!mine && (
                    <p className="mb-1 px-1 text-xs opacity-50">
                      {msg.firstName} {msg.lastName}
                    </p>
                  )}
                  <p
                    className={
                      "rounded-2xl px-3 py-2 text-sm " +
                      (mine
                        ? "rounded-br-md bg-primary text-primary-content"
                        : "rounded-bl-md bg-base-300")
                    }
                  >
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 border-t border-white/10 p-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Write a message"
            className="input input-bordered h-11 flex-1 rounded-full"
          />
          <button
            onClick={sendMessage}
            className="btn btn-primary h-11 rounded-full px-5 transition hover:brightness-110"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
