import React, { useState, useEffect } from "react";
import { IoChatbubbles, IoCloseOutline } from "react-icons/io5";

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

  const handleUserInput = (event) => {
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
    fetch("/predict", {
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
    fetch("/get_specialties")
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        <IoChatbubbles />
      </button>
      {isOpen && (
        <div className="bg-black-squeeze w-64 h-96 flex flex-col justify-between rounded-xl fixed bottom-5 right-5 items-end">
           {/* Top div for the logo */}
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
          <button>
            <IoCloseOutline className="text-white h-8 w-8" />
          </button>
        </div>
          <div className="p-3 overflow-y-auto max-h-80">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg m-1 ${
                  msg.type === "user"
                    ? "bg-blue-100 align-end self-end"
                    : "bg-green-100 align-start self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end w-full">
            <input
              type="text"
              placeholder="Type a message..."
              className="pl-4 pr-10 py-2 w-52 rounded-full bg-white shadow-inner"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleUserInput()}
            />
            <button
              onClick={handleUserInput}
              className="absolute ml-[-40px] bg-gradient-to-b from-blue-400 to-blue-600 text-white w-10 h-10 flex items-center justify-center border-none rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="w-4 h-4 fill-current transition-transform duration-300 ease-in-out hover:rotate-45"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
