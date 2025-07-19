import { getParisTime } from './timezone.js'

export const formatIslamicDate = (date) => {
  // Convert to Paris time before processing
  const parisTime = getParisTime()
  const parisDate = parisTime.toJSDate()
  
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "numeric", 
    year: "numeric",
    calendar: "islamic-umalqura",
  });

  const formattedParts = formatter.formatToParts(parisDate);

  // Customize the month names
  const monthNames = [
    " Muharrem ",
    " Sefer ",
    " Rebiul Evvel ",
    " Rebiul Ahir ",
    " Xhumadel Ula ",
    " Xhumadel Ahir ",
    " Rexheb ",
    " Shaban ",
    " Ramazan ",
    " Shevval ",
    " Dhul Kaade ",
    " Dhul Hixhxhe ",
  ];

  const formattedDateParts = formattedParts.map((part) => {
    if (part.type === "month") {
      const monthIndex = parseInt(part.value, 10) - 1;
      return { type: part.type, value: monthNames[monthIndex] };
    }
    return part;
  });
  const formattedDate = formattedDateParts.map((part) => part.value).join("");

  // Check if AH is already included, if not add it
  return formattedDate.includes("AH") ? formattedDate : formattedDate + " H";
}
