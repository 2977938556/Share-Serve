
function GetIp() {
  let os = require('os');
  const nakeOS = os.networkInterfaces();
  for (const item of nakeOS.WLAN) {
    if (item.family == "IPv4") {
      return item.address
    }
  }

}


module.exports = GetIp