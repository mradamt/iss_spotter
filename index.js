


const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("Nope didn't work", error);
//     return;
//   }

//   console.log('Worked! Returned IP:::', ip);
// })

// fetchCoordsByIP('172.103.153.555557', (error, data) => {
//   if (error) console.log(error);
//   if (data) console.log('data:::', data)
// })

// const latLongObj = { latitude: '49.27670', longitude: '-123.13000' };
// fetchISSFlyOverTimes(latLongObj, (error, data) => {
//   if (error) console.log(error);
//   if (data) console.log('data:::\n', data);
// });