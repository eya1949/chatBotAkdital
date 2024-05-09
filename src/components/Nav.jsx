import React from "react";
import { IoCloseOutline } from "react-icons/io5";

export default function Nav() {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right, #00AEEF, #00ABC6, #00AAB1, #00A99D)",
      }}
      className="h-12 w-full  rounded-t-xl flex justify-between items-center px-4"
    >
      <div className="h-8 w-24 justify-between items-center space-between">
          <img src="logo.png" alt="logo" />
          <IoCloseOutline className='text-white' />
        </div>
    </div>
  );
}
