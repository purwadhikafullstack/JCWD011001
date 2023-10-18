const dateFormatter = (createdAt) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateObject = new Date(createdAt);
  const year = dateObject.getFullYear();
  const monthIndex = dateObject.getMonth();
  const date = dateObject.getDate();
  const monthName = monthNames[monthIndex];
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${date}-${monthName}-${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export default dateFormatter;