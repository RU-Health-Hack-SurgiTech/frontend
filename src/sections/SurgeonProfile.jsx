import React from "react";
import {
  Scissors,
  Stethoscope,
  ClipboardList,
  Calendar,
  Syringe,
} from "lucide-react"; // Icons

const SurgeonProfile = ({ surgeonData }) => {
  const { name, specialty, username, procedures, appointments } = surgeonData;

  return (
    <div className="w-screen mx-auto p-8 bg-gray-100 flex gap-4">
      <div className="flex flex-col gap-4">
        {/* Profile Info Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-700">{name}</h2>
          <div className="mt-4 flex items-center space-x-4">
            <Stethoscope className="text-red-500 w-6 h-6" />
            <div>
              <p className="text-gray-500">{specialty}</p>
              <p className="text-sm text-gray-400">@{username}</p>
            </div>
          </div>
        </div>
        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
          <h2 className="text-2xl font-bold text-gray-700">
            Upcoming Appointments
          </h2>
          <div className="mt-4 overflow-y-auto h-[50vh]">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center space-x-4"
              >
                <Calendar className="text-blue-500 w-5 h-5" />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {appointment.surgeryCode}
                  </h3>
                  <p className="text-gray-500">
                    Patient: {appointment.patientID.name}
                  </p>
                  <p className="text-gray-500">
                    Scheduled Before:{" "}
                    {new Date(appointment.surgeryBefore).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Procedures Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold text-gray-700">Procedures</h2>
        <div className="mt-4 grid grid-cols-3 gap-4 overflow-y-auto h-[70vh]">
          {procedures.map((procedure, index) => (
            <div
              key={procedure._id}
              className="bg-gray-50 p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-3">
                <ClipboardList className="text-green-500 w-5 h-5" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {procedure.name} ({procedure.code})
                </h3>
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-gray-600">Preferences:</h4>

                {/* Instruments */}
                <div>
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <Scissors className="text-blue-400 w-5 h-5" /> Instruments
                  </p>
                  <ul className="ml-6 list-disc text-gray-600">
                    {procedure.preferences.instruments.map((instrument) => (
                      <li key={instrument._id._id}>
                        {instrument._id.name} (Qty: {instrument.qty})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Robots */}
                <div>
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <Stethoscope className="text-purple-400 w-5 h-5" /> Robots
                  </p>
                  <ul className="ml-6 list-disc text-gray-600">
                    {procedure.preferences.robots.map((robot) => (
                      <li key={robot._id}>
                        {robot._id.name} (Qty: {robot.qty})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supplies */}
                <div>
                  <p className="font-semibold text-gray-700 flex items-center gap-2">
                    <Syringe className="text-orange-400 w-5 h-5" /> Supplies
                  </p>
                  <ul className="ml-6 list-disc text-gray-600">
                    {procedure.preferences.supplies.map((supply) => (
                      <li key={supply._id._id}>
                        {supply._id.name} (Qty: {supply.qty})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurgeonProfile;
