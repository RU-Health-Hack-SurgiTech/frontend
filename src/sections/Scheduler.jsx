import React, { useEffect, useState } from "react";
import {
  Calendar as ScheduleCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { User, Stethoscope, Calendar, ClipboardList } from "lucide-react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import axios from "axios";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(ScheduleCalendar);

const Scheduler = () => {
  const [surgeryData, setSurgeryData] = useState([]);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [draggedSurgery, setDraggedSurgery] = useState(null);
  const [adjustedSchedules, setAdjustedSchedules] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  // Start dragging a surgery card
  const handleDragStart = (surgery) => {
    setDraggedSurgery(surgery);
  };

  // Drop the surgery on a calendar slot
  const handleSlotSelect = (slotInfo) => {
    if (draggedSurgery) {
      // Ensure the surgery is dropped before its 'surgeryBefore' time
      const surgeryBeforeTime = new Date(draggedSurgery.surgeryBefore);
      const currentDateTime = new Date();
      let newStartTime = slotInfo.start;
      let newEndTime = moment(newStartTime)
        .add(draggedSurgery.duration, "minutes")
        .toDate();

      // Loop until no overlapping events are found
      while (true) {
        const overlappingEvent = calendarEvents.find(
          (event) =>
            // Overlap with existing event's start or end time
            (newStartTime >= event.start && newStartTime < event.end) ||
            (newEndTime > event.start && newEndTime <= event.end) ||
            // Entire duration overlaps with any existing event
            (newStartTime < event.start && newEndTime > event.start)
        );

        // If an overlapping event is found, adjust the start and end times
        if (overlappingEvent) {
          newStartTime = moment(overlappingEvent.end).toDate();
          newEndTime = moment(newStartTime)
            .add(draggedSurgery.duration, "minutes")
            .toDate();
        } else {
          break; // No overlaps found, break the loop
        }
      }
      if (newStartTime < surgeryBeforeTime && newStartTime > currentDateTime) {
        const newEvent = {
          id: draggedSurgery._id,
          title: `${draggedSurgery.surgeryName} for ${draggedSurgery.patient}`,
          start: newStartTime,
          end: moment(newStartTime).add(draggedSurgery.duration, "minutes"),
          patient: draggedSurgery.patient,
          surgeon: draggedSurgery.surgeon,
          surgeryBefore: draggedSurgery.surgeryBefore,
          surgery: draggedSurgery.surgery,
          surgeryName: draggedSurgery.surgeryName,
          duration: draggedSurgery.duration,
        };

        setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
        setSurgeryData((prevData) =>
          prevData.filter((surgery) => surgery._id !== draggedSurgery._id)
        );
        setDraggedSurgery(null); // Clear the dragged surgery state
      } else if (newStartTime <= currentDateTime) {
        alert("Cannot schedule surgery in the past.");
      } else {
        alert("Cannot schedule surgery after the specified time.");
      }
    }
  };

  // Handle event drag-and-drop within the calendar (moving event to a new time)
  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvents = calendarEvents.map((existingEvent) =>
      existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setCalendarEvents(updatedEvents);
  };

  const handleAccept = (adjustment) => {
    setCalendarEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === adjustment._id
          ? {
              ...event,
              start: new Date(adjustment.time),
              end: moment(new Date(adjustment.time))
                .add(event.duration, "minutes")
                .toDate(),
            }
          : event
      )
    );
    setAdjustedSchedules((prev) =>
      prev.filter((item) => item._id !== adjustment._id)
    );
    setShowDialog(false);
  };

  const handleReject = (adjustment) => {
    setCalendarEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== adjustment._id)
    );
    setSurgeryData((prevData) => [
      ...prevData,
      {
        _id: adjustment._id,
        patient: adjustment.patient,
        surgeon: adjustment.surgeon,
        surgeryBefore: adjustment.surgeryBefore,
        surgery: adjustment.surgery,
        surgeryName: adjustment.surgeryName,
        duration: adjustment.duration,
      },
    ]);
    setAdjustedSchedules((prev) =>
      prev.filter((item) => item._id !== adjustment._id)
    );
    setShowDialog(false);
  };

  useEffect(() => {
    let postData = {};
    postData.schedule = calendarEvents.map((event) => {
      return {
        time: event.start,
        appointmentId: event.id,
      };
    });
    axios
      .post("http://localhost:3000/scheduler/", postData)
      .then((res) => {
        const { suggestedSchedule } = res.data;
        const adjustments = suggestedSchedule.filter((item) => item.adjusted);

        if (adjustments.length > 0) {
          setAdjustedSchedules(adjustments);
          setShowDialog(true);
        }
      })
      .catch((err) => console.warn(err));
  }, [calendarEvents]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/scheduler/appointments")
      .then((res) => {
        setSurgeryData(res.data);
      })
      .catch((err) => setSurgeryData([]));
  }, []);

  const handleCancel = (eventId) => {
    const eventToCancel = calendarEvents.find((event) => event.id === eventId);
    if (eventToCancel) {
      setCalendarEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
      setSurgeryData((prevData) => {
        const updatedData = [
          ...prevData,
          {
            _id: eventToCancel.id,
            patient: eventToCancel.patient,
            surgeon: eventToCancel.surgeon,
            surgeryBefore: eventToCancel.surgeryBefore,
            surgery: eventToCancel.surgery,
            surgeryName: eventToCancel.surgeryName,
            duration: eventToCancel.duration,
          },
        ];

        return updatedData.sort(
          (a, b) => new Date(a.surgeryBefore) - new Date(b.surgeryBefore)
        );
      });
    }
  };

  const EventComponent = ({ event }) => (
    <div className="flex justify-between items-center mx-4 contain-content">
      <span>{event.title}</span>
      <button
        onClick={() => handleCancel(event.id)}
        className="text-white hover:underline bg-red-900 px-2 py-1 text-sm"
      >
        Cancel
      </button>
    </div>
  );

  const AdjustmentDialog = ({ adjustment }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Adjustment Required</h2>
        <p>Original Time: {adjustment.originalTime}</p>
        <p>Suggested Time: {adjustment.time}</p>
        <p>Reason: {adjustment.reason.join(", ")}</p>
        <div className="flex mt-4 justify-end gap-4">
          <button
            onClick={() => handleReject(adjustment)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleAccept(adjustment)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-screen h-[90vh]">
      <div className="flex flex-col w-1/5 p-4 bg-gray-100 gap-4 overflow-y-auto">
        {surgeryData.map((surgery, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-3 rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
            draggable
            onDragStart={() => handleDragStart(surgery)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {surgery.surgery}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(surgery.surgeryBefore).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-3">
                <User className="text-blue-500" size={20} />
                <span>{surgery.patient}</span>
              </div>

              <div className="flex items-center gap-3">
                <Stethoscope className="text-green-500" size={20} />
                <span>{surgery.surgeon}</span>
              </div>

              <div className="flex items-center gap-3">
                <ClipboardList className="text-purple-500" size={20} />
                <span>{surgery.surgeryName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-grow p-4 h-full shadow-md rounded-md bg-gray-50 overflow-y-auto">
        <DnDCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          step={30} // Each slot represents 30 minutes
          timeslots={1}
          style={{ height: "100%", padding: "10px" }}
          selectable
          resizable={false}
          scrollToTime={new Date()}
          //   onSelectSlot={handleSlotSelect}
          onEventDrop={handleEventDrop}
          onDropFromOutside={handleSlotSelect}
          defaultView="day"
          views={["day", "week"]}
          components={{
            event: EventComponent,
          }}
          validRange={{
            start: new Date(),
          }}
        />
      </div>
      {showDialog &&
        adjustedSchedules.map((adjustment) => (
          <AdjustmentDialog key={adjustment._id} adjustment={adjustment} />
        ))}
    </div>
  );
};

export default Scheduler;
