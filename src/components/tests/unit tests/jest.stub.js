
if (typeof window.URL.createObjectURL === 'undefined') {
    window.URL.createObjectURL = () => {
    };
  }

  if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder } = require('util');
    global.TextEncoder = TextEncoder;
}