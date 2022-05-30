/* eslint-disable @typescript-eslint/no-var-requires */
import chalk from 'chalk';
import dayjs from 'dayjs';

function getTime(format = 'HH:mm:ss') {
  return dayjs().format(format);
}

function getTimeColorful() {
  return chalk`{white [}{gray ${getTime()}}{white ]}`;
}

export default {
  info: function info(...msg) {
    console.log(getTimeColorful(), chalk`{greenBright ${msg[0]}}`, ...msg.slice(1));
  },

  warn: function warn(...msg) {
    console.log(getTimeColorful(), chalk`{yellowBright ${msg[0]}}`, ...msg.slice(1));
  },

  log: function log(...msg) {
    console.log(getTimeColorful(), chalk`{cyanBright ${msg[0]}}`, ...msg.slice(1));
  },

  error: function error(...msg) {
    console.log(getTimeColorful(), chalk`{redBright ${msg[0]}}`, ...msg.slice(1));
  },

  fail: function fail(...msg) {
    console.log(getTimeColorful(), chalk`{redBright ${msg[0]}}`, ...msg.slice(1));
  },
};
