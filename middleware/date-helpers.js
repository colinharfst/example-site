module.exports = {
  getDateBreakdown: () => {
    const today = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const breakdown = today.split("/");
    var dd = String(breakdown[1]).padStart(2, "0");
    var mm = String(breakdown[0]).padStart(2, "0");
    var yyyy = breakdown[2].substring(0, 4);
    return { year: yyyy, month: mm, day: dd };
  },
  getEasternTimeTuple: () => {
    const today = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const breakdown = today.split(" ");
    const isAM = breakdown[2] === "AM";
    const isPM = breakdown[2] === "PM";
    const hourAndMinSplit = breakdown[1].split(":");
    let hours = parseInt(hourAndMinSplit[0]);
    if (isAM && hours === 12) hours = 0;
    if (isPM && hours !== 12) hours += 12;
    return { hours, minutes: parseInt(hourAndMinSplit[1]) };
  },
  customTimeAdder: (startTime, duration, roundUp) => {
    // Example:
    // startTime = "06:05 pm" or "6:05 PM"
    // duration = "3:20"
    // duration (with delay) = "3:20 (1:10 delay)"
    const startTimeSplit1 = startTime.split(" ");
    const startTimeSplit2 = startTimeSplit1[0].split(":");
    const durationSplit = duration.includes("delay") ? duration.split(" ")[0].split(":") : duration.split(":");

    let startHours = parseInt(startTimeSplit2[0]);
    const startMin = parseInt(startTimeSplit2[1]);
    const durationHours = parseInt(durationSplit[0]);
    const durationMin = parseInt(durationSplit[1]);

    if ((startTimeSplit1[1] == "pm" || startTimeSplit1[1] == "PM") && startHours !== 12) startHours += 12;

    let delayHours = 0;
    let delayMin = 0;
    if (duration.includes("delay")) {
      const delaySplit1 = duration.split("(")[1].split(" ")[0];
      const delaySplit2 = delaySplit1.split(":");
      delayHours = parseInt(delaySplit2[0]);
      delayMin = parseInt(delaySplit2[1]);
    }

    let endHours = startHours + durationHours + delayHours;
    const endMin = startMin + durationMin + delayMin;
    if (endMin >= 60) endHours += 1;
    // Use to create buffer for Kaffeine to ping Heroku
    // when it's between midnight and 12:35 p.m
    // and the game ended between 11:30 to midnight
    // https://kaffeine.herokuapp.com/
    if (roundUp && endMin % 60 >= 30) endHours += 1;
    return endHours;
  },
};
