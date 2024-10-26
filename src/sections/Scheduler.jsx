import React from "react";

const Scheduler = () => {
  return (
    <div className="flex w-screen h-[90vh]">
      <div className="flex flex-col w-1/5 p-4 bg-gray-100 gap-4">
        <div className="bg-white shadow-md p-4 rounded-md">Surgery 1</div>
        <div className="bg-white shadow-md p-4 rounded-md">Surgery 2</div>
        <div className="bg-white shadow-md p-4 rounded-md">Surgery 3</div>
      </div>
      <div className="flex-grow p-4 h-full shadow-md rounded-md bg-gray-50">
        <div className="text-center p-4 text-lg font-semibold">Schedule</div>
      </div>
    </div>
  );
};

export default Scheduler;
