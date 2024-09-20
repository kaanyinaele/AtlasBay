// Add a single DOMContentLoaded event listener to handle both clocks and the map
document.addEventListener("DOMContentLoaded", () => {
  // Clock functionality
  const clocksDiv = document.getElementById("clocks");

  // Function to get the current time in a specific timezone
  function getTime(timezone) {
    const now = new Date(); // Get the current date and time
    const options = {
      timeZone: timezone,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    return now.toLocaleString("en-US", options); // Convert the time to the given timezone
  }

  // Function to create a clock for a specific city and timezone
  function createClock(timezone, cityName) {
    // Create a new div element to hold the clock
    const clockDiv = document.createElement("div");
    clockDiv.classList.add(
      "clock",
      "bg-white",
      "p-4",
      "rounded",
      "shadow-md",
      "text-center",
      "w-full",
      "md:w-auto"
    ); // Add styling classes

    // Add the city name and time display in the clock div
    clockDiv.innerHTML = `
      <h2 class="text-xl font-bold">${cityName}</h2>
      <p id="time-${timezone}" class="text-gray-600"></p>
    `;

    // Add this clock div to the main clocks container
    clocksDiv.appendChild(clockDiv);

    // Update the time every second (1000 milliseconds = 1 second)
    setInterval(() => {
      document.getElementById(`time-${timezone}`).textContent =
        getTime(timezone);
    }, 1000);
  }

  // Create clocks for various timezones
  createClock("Asia/Tokyo", "Tokyo");
  createClock("Africa/Lagos", "Lagos");
  createClock("Europe/London", "London");
  createClock("Australia/Sydney", "Sydney");

  // Add new clock functionality
  const addClockButton = document.getElementById("addClockButton");
  addClockButton.addEventListener("click", () => {
    const cityDropdown = document.getElementById("cityDropdown");
    const timezoneDropdown = document.getElementById("timezoneDropdown");

    const cityName = cityDropdown.value.trim();
    const timezone = timezoneDropdown.value.trim();

    if (cityName && timezone) {
      createClock(timezone, cityName); // Create a new clock with user input
      cityDropdown.selectedIndex = 0; // Reset the dropdowns
      timezoneDropdown.selectedIndex = 0;
    } else {
      alert("Please select both city and timezone.");
    }
  });

  // Initialize the map
  const map = new ol.Map({
    target: "map", // Target the div with id "map"
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(), // Use OpenStreetMap as the source
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([139.6917, 35.6895]), // Center the map at the global level
      zoom: 2, // Initial zoom level
    }),
  });

  // Coordinates for Tokyo (longitude, latitude)
  const tokyoCoordinates = [139.6917, 35.6895];

  // Create a marker feature for Tokyo
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(tokyoCoordinates)),
  });

  // Create a style for the marker using an icon image (like a location pin)
  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1], // Adjust anchor to position the icon properly
      src: "./img/locmark.png", // Path to the icon image
      scale: 0.02, // Adjust the size of the icon
    }),
  });

  // Apply the style to the marker
  marker.setStyle(markerStyle);

  // Create a vector source and add the marker to it
  const vectorSource = new ol.source.Vector({
    features: [marker],
  });

  // Create a vector layer using the vector source
  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
  });

  // Add the vector layer to the map
  map.addLayer(vectorLayer);
});
