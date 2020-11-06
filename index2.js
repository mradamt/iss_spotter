const { nextISSTimesForMyLocation } = require('./iss_promised');


const printPassTimes = function(passTimes) {
  for (const passTimeObj of passTimes) {
    const risetime = new Date(passTimeObj.risetime);
    const duration = passTimeObj.duration;
    console.log(`Next pass at ${risetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation()
  .then((passTimes) => printPassTimes(passTimes))
  .catch((error) => console.log('It no work bro. Error message:\n', error.message));


