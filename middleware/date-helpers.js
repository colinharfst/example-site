module.exports = {
  getDateBreakdown: () => {
    const today = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const breakdown = today.split("/");
    var dd = String(breakdown[1]).padStart(2, "0");
    var mm = String(breakdown[0]).padStart(2, "0");
    var yyyy = breakdown[2].substring(0, 4);
    return { year: yyyy, month: mm, day: dd };
  },
  getEasternTimeHour: () => {
    const today = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const breakdown = today.split(" ");
    const isAM = breakdown[2] === "AM";
    const isPM = breakdown[2] === "PM";
    let hours = parseInt(breakdown[1].split(":")[0]);
    if (isAM && hours === 12) hours = 0;
    if (isPM && hours !== 12) hours += 12;
    return hours;
  },
  customTimeAdder: (startTime, duration, roundUp) => {
    // Example:
    // startTime = "06:05 pm"
    // duration = "3:21"
    const startTimeSplit1 = startTime.split(" ");
    const startTimeSplit2 = startTimeSplit1[0].split(":");
    const durationSplit = duration.split(":");

    let startHours = parseInt(startTimeSplit2[0]);
    const startMin = parseInt(startTimeSplit2[2]);
    const durationHours = parseInt(durationSplit[0]);
    const durationMin = parseInt(durationSplit[1]);

    if (startTimeSplit1[1] == "pm" && startHours !== 12) startHours += 12;

    const endHours = startHours + durationHours;
    const endMin = startMin + durationMin;
    if (endMin >= 60) endHours += 1;
    // Round up to create 30 minute buffer for Kaffeine to ping Heroku
    // https://kaffeine.herokuapp.com/
    if (roundUp && endMin % 60 >= 30) endHours += 1;
    return endHours;
  },
};
