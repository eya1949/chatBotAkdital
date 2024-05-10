import React, { useState, useEffect } from "react";
import { IoChatbubbles, IoCloseOutline, IoSend } from "react-icons/io5";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    displayBotMessage("Ana NabadyBot, Bach ne9der n3awnek");
  }, []);

  const toggleChatBox = () => {
    setIsOpen(!isOpen);
  };

  const handleUserInput = () => {
    const msg = userMessage.trim().toLowerCase();
    displayUserMessage(msg);
    setUserMessage("");
    if (isAppointmentRelated(msg)) {
      fetchSpecialties();
    } else {
      callFlaskAPI(msg);
    }
  };

  const isAppointmentRelated = (message) => {
    const appointmentKeywords = [
      "bghyt nakhod",
      "rendez vous",
      "bghyt ndowz",
      "bghyt nqabbel tabib",
      "kanqalbek 3la rdv",
      "wach mumkin ndowz",
      "bghyt nqabbel doktor",
      "bghyt n7jz",
      "kanqalbek 3la wqt",
      "rdv",
    ];
    return appointmentKeywords.some((keyword) => message.includes(keyword));
  };

  const callFlaskAPI = (userMessage) => {
    fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        displayBotMessage(data.answer);
        if (data.tag === "specialties") {
          fetchSpecialties();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        displayBotMessage("Une erreur s'est produite, veuillez réessayer.");
      });
  };

  const displayUserMessage = (message) => {
    setMessages((prev) => [...prev, { text: message, type: "user" }]);
  };

  const displayBotMessage = (message) => {
    setMessages((prev) => [...prev, { text: message, type: "bot" }]);
  };

  const fetchSpecialties = () => {
    fetch("http://localhost:5000/get_specialties")
      .then((response) => response.json())
      .then((data) => {
        setSpecialties(data["hydra:member"]);
      })
      .catch((error) => {
        console.error("Error fetching specialties:", error);
      });
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end">
      <button
        onClick={toggleChatBox}
        className="bg-picton-blue-500 hover:bg-persian-green-600  text-white font-bold py-2 px-4 rounded-full"
      >
        <IoChatbubbles className="text-xl" />
      </button>
      {isOpen && (
        <div className="bg-black-squeeze w-80 h-96 flex flex-col justify-between rounded-xl fixed bottom-14 right-18">
          <div
            style={{
              backgroundImage:
                "linear-gradient(to right, #00AEEF, #00ABC6, #00AAB1, #00A99D)",
            }}
            className="h-12 w-full rounded-t-xl flex justify-between items-center px-2"
          >
            <button className="h-6 w-24">
              <img src="logo.png" alt="logo" />
            </button>
            <button onClick={toggleChatBox}>
              <IoCloseOutline className="text-white h-8 w-8" />
            </button>
          </div>
          {/* <div className="p-3 overflow-y-auto max-h-80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-full m-1 ${
                  msg.type === "user"
                    ? "bg-blue-100 flex flex-start"
                    : "bg-green-100 flex flex-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div> */}

<div className="p-3 overflow-y-auto max-h-80">
      {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.type === "user" ? "chat-end" : "chat-start"}`}>
          <div className="chat-image avatar">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={msg.avatar} alt="User Avatar" />
            </div>
          </div>
          <div className="chat-header">
            {msg.name}
            <time className="text-xs opacity-50">{msg.time}</time>
          </div>
          <div className="chat-bubble" style={{ backgroundColor: msg.type === "user" ? "#CBF8F5" : "#CEF0FC" }}>
            {msg.text}
          </div>
          <div className="chat-footer opacity-50">
            {msg.type === "user" ? `Seen at ${msg.time}` : "Delivered"}
          </div>
        </div>
      ))}
    </div>

          <div className="flex items-center justify-end w-full p-2 rounded-full bg-white shadow-inner">
            <input
              type="text"
              placeholder="Type a message..."
              className="pl-4 pr-10 py-2 w-full rounded-full bg-white bordee"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleUserInput()}
            />
            <button
              onClick={handleUserInput}
              className="bg-persian-green-500 hover:bg-teal-600 text-white text-xs rounded-full p-2 mr-2 flex items-center justify-center gap-1"
            >
              Send
              <IoSend className=" text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
