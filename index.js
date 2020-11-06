const { nextISSTimesForMyLocation } = require('./iss');


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) console.log('It no work', error);

  for (const passTimeObj of passTimes) {
    const risetime = new Date(passTimeObj.risetime);
    const duration = passTimeObj.duration;
    console.log(`Next pass at ${risetime} for ${duration} seconds!`);
  }
});