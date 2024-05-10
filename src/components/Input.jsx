import React, { useState } from "react";

const Input = () => {
  return (
    <>
      <div className="chat chat-start">
        <div className="w-10 rounded-full"></div>

        <div className="chat-bubble"></div>
      </div>
      <div className="chat chat-end">
        <div className="w-10 rounded-full"></div>

        <div className="chat-bubble"></div>
      </div>
    </>
  );
};

export default Input;
