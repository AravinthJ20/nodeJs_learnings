const os = require('os');

console.log('OS Platform:', os.platform());       // e.g., 'linux', 'darwin', 'win32'
console.log('CPU Architecture:', os.arch());      // e.g., 'x64'
console.log('CPU Info:', os.cpus().length, 'cores');
console.log('Free Memory:', os.freemem() / 1024 / 1024, 'MB');
console.log('Total Memory:', os.totalmem() / 1024 / 1024, 'MB');
console.log('Home Directory:', os.homedir());
console.log('Uptime:', os.uptime(), 'seconds');
