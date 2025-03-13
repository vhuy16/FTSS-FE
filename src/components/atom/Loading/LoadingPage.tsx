import React from "react";

const LoadingPage = () => {
  // Render component
  return (
    <div className="w-full h-screen caret-transparent flex justify-center items-center">
      <div className="w-32 h-32 flex justify-center items-center relative">
        <div
          className="absolute top-0 left-0 w-5 h-5 bg-indigo-100 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[0deg]"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-4 h-4 bg-indigo-200 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[45deg]"
          style={{ animationDelay: "0.25s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-indigo-300 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[90deg]"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-2 h-2 bg-indigo-400 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[135deg]"
          style={{ animationDelay: "0.75s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-1 h-1 bg-indigo-500 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[180deg]"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-1 h-1 bg-indigo-600 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[225deg]"
          style={{ animationDelay: "1.25s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-1 h-1 bg-indigo-700 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[270deg]"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-0 left-0 w-1 h-1 bg-indigo-800 opacity-0 animate-rotate origin-[4rem_4rem] rounded-full rotate-[315deg]"
          style={{ animationDelay: "1.75s" }}
        ></div>
        <div className="text-indigo-500 text-2xl animate-pulse">Loading</div>
      </div>
    </div>
  );
};

export default LoadingPage;
