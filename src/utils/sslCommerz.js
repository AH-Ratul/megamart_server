const SSLCommerzPayment = require("sslcommerz-lts");

const config = {
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWD,
  is_live: false, //true for live, false for sandbox
};

const sslcz = new SSLCommerzPayment(
  config.store_id,
  config.store_passwd,
  config.is_live
);

module.exports = sslcz;
