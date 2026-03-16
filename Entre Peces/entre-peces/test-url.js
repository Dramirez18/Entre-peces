const https = require('https');
https.get('https://storage.googleapis.com/generativeai-downloads/images/s_65_0.png', (res) => {
  console.log('statusCode:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
