const dns = require('dns');
const csv = require('csv-parser');
const fs = require('fs');

const promises = [];

fs.createReadStream('subdomains-10000.csv')
  .pipe(csv())
  .on('data', (subdomain) => {
    promises.push(new Promise((resolve, reject) => {
      dns.resolve(`${subdomain.name}.thegioididong.com`, function (err, ip) {
        return resolve({ subdomain: subdomain.name + '.thegioididong.com', ip: ip });
      });
    }));
  })
  .on('end', () => {

   // after all of the DNS queries have completed, log the results
   Promise.all(promises).then(function(results) {
    results.forEach((result) => {
      if (!!result.ip) {
        console.log(result);
      }
    });
  });
 });