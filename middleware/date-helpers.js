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
    console.log(breakdown[2] === "PM");

    const hours = breakdown[1].split(":")[0];

    console.log(hours);
  },
};
