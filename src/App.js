import React, { useState, useEffect } from "react";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Helper function to remove duplicates
  const removeDuplicates = (array) => [...new Set(array)];

  // Fetch countries on initial render
  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((response) => response.json())
      .then((data) => {
        const uniqueCountries = removeDuplicates(data);
        setCountries(uniqueCountries);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
      )
        .then((response) => response.json())
        .then((data) => {
          const uniqueStates = removeDuplicates(data);
          setStates(uniqueStates);
          setCities([]); // Reset cities when country changes
          setSelectedState("");
          setSelectedCity("");
        })
        .catch((error) => console.error("Error fetching states:", error));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Fetch cities when state is selected
  useEffect(() => {
    if (selectedState) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      )
        .then((response) => response.json())
        .then((data) => {
          const uniqueCities = removeDuplicates(data);
          setCities(uniqueCities);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
    }
  }, [selectedCountry, selectedState]);

  return (
    <div>
      <h1>Select Location</h1>
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setSelectedState("");
          setSelectedCity("");
        }}
      >
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={`${country}-${index}`} value={country}>
            {country}
          </option>
        ))}
      </select>

      <select
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
        }}
        disabled={!selectedCountry}
      >
        <option value="">Select State</option>
        {states.map((state, index) => (
          <option key={`${state}-${index}`} value={state}>
            {state}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        disabled={!selectedState}
      >
        <option value="">Select City</option>
        {cities.map((city, index) => (
          <option key={`${city}-${index}`} value={city}>
            {city}
          </option>
        ))}
      </select>

      {selectedCity && (
        <p>
          <strong>
            You selected{" "}
            <span style={{ fontSize: "1.5em" }}>{selectedCity}</span>
          </strong>
          , {selectedState}, {selectedCountry}
        </p>
      )}
    </div>
  );
};

export default LocationSelector;
