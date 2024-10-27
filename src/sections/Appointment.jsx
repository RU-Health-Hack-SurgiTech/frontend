import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Field, Label, Select, Description } from "@headlessui/react";
import { User, CalendarDays, Info, Heart, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [patients, setPatients] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedSurgery, setSelectedSurgery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/patients")
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:3000/surgeries")
      .then((res) => setSurgeries(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddAppointment = useCallback(() => {
    axios
      .post("http://localhost:3000/surgeons/addAppointment", {
        patientID: selectedPatient,
        surgeryCode: selectedSurgery,
        surgeryBefore: selectedDate,
      })
      .then((res) => {
        setSelectedPatient("");
        setSelectedSurgery("");
        setSelectedDate(new Date());
        navigate("/dashboard");
      })
      .catch((err) => console.error(err));
  }, [selectedPatient, selectedSurgery, selectedDate, navigate]);

  const selectedPatientData = patients.find((p) => p._id === selectedPatient);
  const selectedSurgeryData = surgeries.find((s) => s.code === selectedSurgery);

  return (
    <div className="w-screen flex p-8 gap-6 bg-gray-100 min-h-[90vh]">
      {/* Booking Tool Column */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg max-w-sm w-1/3">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          <CalendarDays className="inline-block mr-2 text-red-600" />
          Book Appointment
        </h2>

        <Field className="w-full mb-4">
          <Label className="flex items-center text-gray-700 mb-1">
            <User className="mr-2 text-red-600" />
            Select Patient
          </Label>
          <Description className="text-sm text-gray-500 mb-2">
            Choose a patient for the surgery
          </Description>
          <Select
            name="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          >
            <option value="" disabled>
              Select a patient
            </option>
            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field className="w-full mb-4">
          <Label className="flex items-center text-gray-700 mb-1">
            <Info className="mr-2 text-red-600" />
            Select Surgery
          </Label>
          <Description className="text-sm text-gray-500 mb-2">
            Choose the surgery procedure
          </Description>
          <Select
            name="surgery"
            value={selectedSurgery}
            onChange={(e) => setSelectedSurgery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
          >
            <option value="" disabled>
              Select a surgery
            </option>
            {surgeries.map((surgery) => (
              <option key={surgery._id} value={surgery.code}>
                {surgery.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field className="w-full mb-6">
          <Label className="text-gray-700 mb-1">Select Date</Label>
          <Description className="text-sm text-gray-500 mb-2">
            Choose the appointment date
          </Description>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            className="rounded-md border border-gray-300 p-4 shadow-sm"
          />
        </Field>

        <button
          onClick={handleAddAppointment}
          disabled={!selectedPatient || !selectedSurgery}
          className="w-full px-4 py-2 text-white bg-red-700 rounded-md hover:bg-red-900 focus:outline-none disabled:opacity-50"
        >
          Book Appointment
        </button>
      </div>

      {/* Patient Details Column */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-lg w-1/3">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          <User className="inline-block mr-2 text-blue-600" />
          Patient Details
        </h3>
        {selectedPatientData ? (
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">Name:</span>
              <p className="text-gray-600">{selectedPatientData.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Age:</span>
              <p className="text-gray-600">{selectedPatientData.age}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Gender:</span>
              <p className="text-gray-600">{selectedPatientData.gender}</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Medical History:</span>
              <ul className="list-disc list-inside text-gray-600">
                {selectedPatientData.medicalHistory.map((history, idx) => (
                  <li key={idx}>{history}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a patient to view details.</p>
        )}
      </div>

      {/* Surgery Details Column */}
      <div className="flex-1 p-6 bg-white shadow-lg rounded-lg w-1/3">
        <h3 className="text-xl font-semibold text-gray-800 border-b pb-3 mb-4">
          <Activity className="inline-block mr-2 text-green-600" />
          Surgery Details
        </h3>
        {selectedSurgeryData ? (
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-between">
              <span className="font-medium">Procedure:</span>
              <p className="text-gray-600">{selectedSurgeryData.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Code:</span>
              <p className="text-gray-600">{selectedSurgeryData.code}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Duration:</span>
              <p className="text-gray-600">{selectedSurgeryData.expectedDuration} minutes</p>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Instruments Needed:</span>
              <ul className="list-disc list-inside text-gray-600">
                {selectedSurgeryData.instruments.map((instrument, idx) => (
                  <li key={idx}>
                    {instrument._id.name} (Qty: {instrument.qty})
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Supplies Needed:</span>
              <ul className="list-disc list-inside text-gray-600">
                {selectedSurgeryData.supplies.map((supply, idx) => (
                  <li key={idx}>
                    {supply._id.name} (Qty: {supply.qty})
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <span className="font-medium">Robot Requirements:</span>
              <ul className="list-disc list-inside text-gray-600">
                {selectedSurgeryData.robots.map((robot, idx) => (
                  <li key={idx}>
                    {robot._id.name} (Qty: {robot.qty})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a surgery to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Appointment;
