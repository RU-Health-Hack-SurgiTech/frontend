import React, { useState } from "react";
import {
  Calendar as ScheduleCalendar,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { User, Stethoscope, Calendar, ClipboardList } from "lucide-react";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(ScheduleCalendar);

const Scheduler = () => {
  const [surgeryData, setSurgeryData] = useState([
    {
      _id: "653acb1e8a432ab12c6a1f10",
      patient: "Emily Davis",
      surgeon: "Dr. John Doe",
      surgeryBefore: "2024-10-26T10:00:00",
      surgery: "44950",
      surgeryName: "Appendectomy",
      duration: 90, // Duration in minutes
    },
    {
      _id: "653acb1e8a432ab12c6a1f11",
      patient: "Jane Smith",
      surgeon: "Dr. James White",
      surgeryBefore: "2024-10-26T12:00:00",
      surgery: "44950",
      surgeryName: "Appendectomy",
      duration: 90,
    },
    {
      _id: "653acb1e8a432ab12c6a1f12",
      patient: "Jane Smith",
      surgeon: "Dr. John Doe",
      surgeryBefore: "2024-10-26T14:00:00",
      surgery: "47562",
      surgeryName: "Cholecystectomy",
      duration: 60,
    },
    {
      _id: "653acb1e8a432ab12c6a1f13",
      patient: "Christopher Harris",
      surgeon: "Dr. Sarah Lee",
      surgeryBefore: "2024-10-26T16:00:00",
      surgery: "47562",
      surgeryName: "Cholecystectomy",
      duration: 60,
    },
    {
      _id: "653acb1e8a432ab12c6a1f14",
      patient: "Christopher Harris",
      surgeon: "Dr. James White",
      surgeryBefore: "2024-10-26T18:00:00",
      surgery: "66984",
      surgeryName: "Cataract Surgery",
      duration: 45,
    },
    {
      _id: "653acb1e8a432ab12c6a1f15",
      patient: "Emily Davis",
      surgeon: "Dr. James White",
      surgeryBefore: "2024-10-26T20:00:00",
      surgery: "66984",
      surgeryName: "Cataract Surgery",
      duration: 45,
    },
    {
      _id: "653acb1e8a432ab12c6a1f16",
      patient: "Michael Johnson",
      surgeon: "Dr. James White",
      surgeryBefore: "2024-10-26T22:00:00",
      surgery: "47562",
      surgeryName: "Cholecystectomy",
      duration: 60,
    },
    {
      _id: "653acb1e8a432ab12c6a1f17",
      patient: "Emily Davis",
      surgeon: "Dr. James White",
      surgeryBefore: "2024-10-27T00:00:00",
      surgery: "44950",
      surgeryName: "Appendectomy",
      duration: 90,
    },
    {
      _id: "653acb1e8a432ab12c6a1f18",
      patient: "Emily Davis",
      surgeon: "Dr. Sarah Lee",
      surgeryBefore: "2024-10-27T02:00:00",
      surgery: "66984",
      surgeryName: "Cataract Surgery",
      duration: 45,
    },
    {
      _id: "653acb1e8a432ab12c6a1f19",
      patient: "Michael Johnson",
      surgeon: "Dr. John Doe",
      surgeryBefore: "2024-10-27T04:00:00",
      surgery: "66984",
      surgeryName: "Cataract Surgery",
      duration: 45,
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [draggedSurgery, setDraggedSurgery] = useState(null);

  // Start dragging a surgery card
  const handleDragStart = (surgery) => {
    setDraggedSurgery(surgery);
  };

  // Drop the surgery on a calendar slot
  const handleSlotSelect = (slotInfo) => {
    if (draggedSurgery) {
      // Ensure the surgery is dropped before its 'surgeryBefore' time
      const surgeryBeforeTime = new Date(draggedSurgery.surgeryBefore);
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
      if (newStartTime < surgeryBeforeTime) {
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
  
        return updatedData.sort((a, b) => new Date(a.surgeryBefore) - new Date(b.surgeryBefore));
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
          style={{ height: "100%", padding: "10px" }}
          selectable
          resizable={false}
          //   onSelectSlot={handleSlotSelect}
          onEventDrop={handleEventDrop}
          onDropFromOutside={handleSlotSelect}
          defaultView="day"
          views={["day", "week"]}
          components={{
            event: EventComponent,
          }}
        />
      </div>
    </div>
  );
};

export default Scheduler;
