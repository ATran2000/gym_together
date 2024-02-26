// this function converts dates like Mon Jan 1 2024 00:00:00 GMT-0500 (Eastern Standard Time) to 2024-01-01
// this date will be sent to the backend and is needed because my date field for my model rquires it
export const formatDateBackend = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
};

// converts dates like 2024-01-01 to Monday Jan 1 2024 for readibility
export const formatDateReadable = (date) => {
  return date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};

// this function converts times like 1:00 AM to 01:00:00
// this time was provided by the user and will be sent to the backend
export const formatTime12to24 = (time) => {
  let [timeDigits, period] = time.split(" ");
  let [hours, minutes] = timeDigits.split(":");

  hours = parseInt(hours, 10);

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

// this function converts times like 01:00:00 to 1:00 AM
// this time was retrieved from the backend and will be converted for readibility
export const formatTime24To12 = (time) => {
  const formattedTime = new Date(`2000-01-01T${time}`);  // random date is used, only time is required
  return formattedTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
};
