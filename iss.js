const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org/?format=json', (err, response, body) => {
    // If request returns an error (invalid domain, api offline etc.)
    if (err) return callback(err, null);

    // If response is not successful i.e. 200
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Request was successful, parse and return body (i.e. IP address)
    const data = JSON.parse(body);
    return callback(null, data.ip);
  });
};


/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ip-api.com/json/${ip}`, (err, response, body) => {
    // If request returns an error (invalid domain, api offline etc.)
    if (err) {
      return callback(err, null);
    }

    // If request fails i.e. statusCode !== 200
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // Request has content, parse it
    const data = JSON.parse(body);
    
    // If geolocation doesn't succeed this service logs it as 'status' within body
    if (data.status !== 'success') {
      const errorMsg = `Request status: ${data.status}\nResponse: ${body}`;
      callback(errorMsg, null);
      return;
    }
    
    // Geolocation successful, return coords
    return callback(null, { latitude: data.lat, longitude: data.lon });
  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const query = `lat=${coords.latitude}&lon=${coords.longitude}`;
  request(`http://api.open-notify.org/iss-pass.json?${query}`, (err, response, body) => {
    // If request returns an error (invalid domain, api offline etc.)
    if (err) {
      return callback(err, null);
    }

    // If request fails i.e. statusCode !== 200
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times:\n${body}`;
      callback(Error(msg), null);
      return;
    }

    // Request has content, parse it
    const data = JSON.parse(body);
    return callback(null, data.response);
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  // if (error) return callback(error, null)

  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, latLongObj) => {
      if (error) return callback(error, null);
    
      fetchISSFlyOverTimes(latLongObj, (error, passTimeArr) => {
        if (error) return callback(error, null);

        return callback(null, passTimeArr);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };