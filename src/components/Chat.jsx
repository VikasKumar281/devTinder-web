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
    fetchChatMessages();
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

  return (
    <div className="mx-auto my-6 flex h-[72vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-200 shadow-sm">
      <h1 className="border-b border-base-300 px-5 py-4 text-lg font-semibold">Chat</h1>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-5">
        {messages.map((msg, index) => {
          const mine = user.firstName === msg.firstName;
          return (
            <div key={index} className={"chat " + (mine ? "chat-end" : "chat-start")}>
              <div className="chat-header opacity-70">
                {`${msg.firstName || ""} ${msg.lastName || ""}`}
              </div>
              <div className={"chat-bubble " + (mine ? "chat-bubble-primary" : "")}>{msg.text}</div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-base-300 p-4">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Write a message"
          className="input input-bordered flex-1"
        />
        <button onClick={sendMessage} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
