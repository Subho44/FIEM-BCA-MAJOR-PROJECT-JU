import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import ChatBox from "../components/ChatBox";
import { Link } from "react-router-dom";

const Chatpage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [messages, setMessages] = useState([]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Please login first
          </h2>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const adminUser = {
    _id: "admin123",
    name: "Admin",
  };

  const studentUser = {
    _id: "student123",
    name: "Student",
  };

  const receiverId =
    currentUser.role === "admin" ? studentUser._id : adminUser._id;

  const receiverName =
    currentUser.role === "admin" ? studentUser.name : adminUser.name;

  const getMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5500/api/messages/${currentUser._id}/${receiverId}`
      );

      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.emit("join", currentUser._id);
    getMessages();

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <ChatBox
          socket={socket}
          currentUser={currentUser}
          receiverId={receiverId}
          receiverName={receiverName}
          oldMessages={messages}
        />
      </div>
    </div>
  );
};

export default Chatpage;