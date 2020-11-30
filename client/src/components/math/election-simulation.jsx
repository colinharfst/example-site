import React, { useEffect, useState } from "react";
import "./election-simulation.scss";
import USAMap from "react-usa-map";
import Slider from "@material-ui/core/Slider";
import Z from "random-z";

export function Election() {
  document.title = "Election Simulation";

  const [results, setResults] = useState([]);
  const [bias, setBias] = useState(0);

  const stateCustomizer = () => {
    const retVal = {};
    results.forEach((result) => {
      const abbreviation = result.state === "DC" ? "DC2" : result.state;
      retVal[abbreviation] = {
        fill: result.demPercentage + bias / 100 > result.repPercentage - bias / 100 ? "blue" : "red",
      };
    });
    return retVal;
  };

  useEffect(() => {
    document.getElementsByClassName("DC2")[0].innerHTML = "<title>District of Columbia</title>";
    // prettier-ignore
    const stateDetails = [
      {abbrev: 'AL', name: 'Alabama', electoralVotes: 9,  demPercentage: 0.367, repPercentage: 0.622},        {abbrev: 'AK', name: 'Alaska', electoralVotes: 3,  demPercentage: 0.430, repPercentage: 0.531},         {abbrev: 'AZ', name: 'Arizona', electoralVotes: 11,  demPercentage: 0.494, repPercentage: 0.491},    {abbrev: 'AR', name: 'Arkansas', electoralVotes: 6,  demPercentage: 0.348, repPercentage: 0.624},             {abbrev: 'CA', name: 'California', electoralVotes: 55,  demPercentage: 0.636, repPercentage: 0.343},
      {abbrev: 'CO', name: 'Colorado', electoralVotes: 9,  demPercentage: 0.554, repPercentage: 0.419},       {abbrev: 'CT', name: 'Connecticut', electoralVotes: 7,  demPercentage: 0.593, repPercentage: 0.392},    {abbrev: 'DE', name: 'Deleware', electoralVotes: 3,  demPercentage: 0.588, repPercentage: 0.398},    {abbrev: 'DC', name: 'District of Columbia', electoralVotes: 3,  demPercentage: 0.930, repPercentage: 0.054}, {abbrev: 'FL', name: 'Florida', electoralVotes: 29,  demPercentage: 0.479, repPercentage: 0.512},
      {abbrev: 'GA', name: 'Georgia', electoralVotes: 16,  demPercentage: 0.495, repPercentage: 0.493},       {abbrev: 'HI', name: 'Hawaii', electoralVotes: 4,  demPercentage: 0.637, repPercentage: 0.343},         {abbrev: 'ID', name: 'Idaho', electoralVotes: 4,  demPercentage: 0.331, repPercentage: 0.639},       {abbrev: 'IL', name: 'Illinois', electoralVotes: 20,  demPercentage: 0.575, repPercentage: 0.406},            {abbrev: 'IN', name: 'Indiana', electoralVotes: 11,  demPercentage: 0.410, repPercentage: 0.571},
      {abbrev: 'IA', name: 'Iowa', electoralVotes: 6,  demPercentage: 0.450, repPercentage: 0.532},           {abbrev: 'KS', name: 'Kansas', electoralVotes: 6,  demPercentage: 0.413, repPercentage: 0.565},         {abbrev: 'KY', name: 'Kentucky', electoralVotes: 8,  demPercentage: 0.362, repPercentage: 0.621},    {abbrev: 'LA', name: 'Louisiana', electoralVotes: 8,  demPercentage: 0.399, repPercentage: 0.585},            {abbrev: 'ME', name: 'Maine', electoralVotes: 4,  demPercentage: 0.529, repPercentage: 0.442},
      {abbrev: 'MD', name: 'Maryland', electoralVotes: 10,  demPercentage: 0.658, repPercentage: 0.324},      {abbrev: 'MA', name: 'Massachusetts', electoralVotes: 11,  demPercentage: 0.658, repPercentage: 0.324}, {abbrev: 'MI', name: 'Michigan', electoralVotes: 16,  demPercentage: 0.506, repPercentage: 0.478},   {abbrev: 'MN', name: 'Minnesota', electoralVotes: 10,  demPercentage: 0.526, repPercentage: 0.454},           {abbrev: 'MS', name: 'Mississippi', electoralVotes: 6,  demPercentage: 0.411, repPercentage: 0.576},
      {abbrev: 'MO', name: 'Missouri', electoralVotes: 10,  demPercentage: 0.414, repPercentage: 0.568},      {abbrev: 'MT', name: 'Montana', electoralVotes: 3,  demPercentage: 0.406, repPercentage: 0.569},        {abbrev: 'NE', name: 'Nebraska', electoralVotes: 5,  demPercentage: 0.394, repPercentage: 0.585},    {abbrev: 'NV', name: 'Nevada', electoralVotes: 6,  demPercentage: 0.501, repPercentage: 0.477},               {abbrev: 'NH', name: 'New Hampshire', electoralVotes: 4,  demPercentage: 0.529, repPercentage: 0.455},
      {abbrev: 'NJ', name: 'New Jersey', electoralVotes: 14,  demPercentage: 0.673, repPercentage: 0.414},    {abbrev: 'NM', name: 'New Mexico', electoralVotes: 5,  demPercentage: 0.543, repPercentage: 0.435},     {abbrev: 'NY', name: 'New York', electoralVotes: 29,  demPercentage: 0.569, repPercentage: 0.417},   {abbrev: 'NC', name: 'North Carolina', electoralVotes: 15,  demPercentage: 0.487, repPercentage: 0.501},      {abbrev: 'ND', name: 'North Dakota', electoralVotes: 3,  demPercentage: 0.319, repPercentage: 0.655},
      {abbrev: 'OH', name: 'Ohio', electoralVotes: 18,  demPercentage: 0.453, repPercentage: 0.533},          {abbrev: 'OK', name: 'Oklahoma', electoralVotes: 7,  demPercentage: 0.323, repPercentage: 0.654},       {abbrev: 'OR', name: 'Oregon', electoralVotes: 7,  demPercentage: 0.571, repPercentage: 0.405},      {abbrev: 'PA', name: 'Pennsylvania', electoralVotes: 20,  demPercentage: 0.500, repPercentage: 0.488},        {abbrev: 'RI', name: 'Rhode Island', electoralVotes: 4,  demPercentage: 0.596, repPercentage: 0.389},
      {abbrev: 'SC', name: 'South Carolina', electoralVotes: 9,  demPercentage: 0.434, repPercentage: 0.551}, {abbrev: 'SD', name: 'South Dakota', electoralVotes: 3,  demPercentage: 0.356, repPercentage: 0.618},   {abbrev: 'TN', name: 'Tennessee', electoralVotes: 11,  demPercentage: 0.374, repPercentage: 0.607},  {abbrev: 'TX', name: 'Texas', electoralVotes: 38,  demPercentage: 0.465, repPercentage: 0.521},               {abbrev: 'UT', name: 'Utah', electoralVotes: 6,  demPercentage: 0.377, repPercentage: 0.582},
      {abbrev: 'VT', name: 'Vermont', electoralVotes: 3,  demPercentage: 0.664, repPercentage: 0.308},        {abbrev: 'VA', name: 'Virginia', electoralVotes: 13,  demPercentage: 0.544, repPercentage: 0.442},      {abbrev: 'WA', name: 'Washington', electoralVotes: 12,  demPercentage: 0.584, repPercentage: 0.390}, {abbrev: 'WV', name: 'West Virginia', electoralVotes: 5,  demPercentage: 0.297, repPercentage: 0.686},        {abbrev: 'WI', name: 'Wisconson', electoralVotes: 10,  demPercentage: 0.496, repPercentage: 0.489}, {abbrev: 'WY', name: 'Wyoming', electoralVotes: 3,  demPercentage: 0.267, repPercentage: 0.704}
    ];
    const res = stateDetails.map((state) => {
      const randomVal = (Z() * 2) / 100;
      return {
        state: state.abbrev,
        demPercentage: state.demPercentage + randomVal,
        repPercentage: state.repPercentage - randomVal,
      };
    });
    setResults(res);
  }, []);

  const handleChange = (_event, value) => {
    setBias(value);
  };

  return (
    <div>
      <h3>A statistically dubious Electoral College simulation</h3>
      <div>
        <USAMap title="Electoral Map" customize={stateCustomizer()} />
        <Slider
          value={bias}
          min={-5}
          max={5}
          marks
          onChange={handleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => {
            if (val > 0) {
              return `+${val} D`;
            } else if (val < 0) {
              return `+${-val} R`;
            } else return 0;
          }}
          style={{ color: "#61dafb", width: "40%" }}
        />
      </div>
    </div>
  );
}

export default Election;
