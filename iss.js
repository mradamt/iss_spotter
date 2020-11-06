const request = require('request');

const fetchMyIP = function(callback) { 
  request('https://api.ipify.org/?format=json', (err, response, body) => {
    if (err) {
      return callback(err, null);
    };
    data = JSON.parse(body)
    console.log(data)
    return callback(null, data.ip)

    // console.log('request returns:::', data, ip); 
  })
}

module.exports = { fetchMyIP };