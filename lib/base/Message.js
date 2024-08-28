const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const util = require('util');

// Function to get the current Unix timestamp in seconds
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);

// Function to generate a unique message tag, optionally appending a suffix
const generateMessageTag = (suffix) => {
    let tag = Date.now().toString();
    if (suffix) tag += '--' + suffix;
    return tag;
};

// Function to process time and return the difference in seconds
const processTime = (startTime, endTime) => {
    return moment.duration(endTime - moment(startTime * 1000)).asSeconds();
};

// Function to generate a random string with a given length
const getRandom = (length) => {
    return '' + Math.floor(Math.random() * 10000) + length;
};

// Function to fetch a buffer from a URL
const getBuffer = async (url, options = {}) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Requests': 1,
            },
            ...options,
            responseType: 'arraybuffer'
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Function to fetch JSON data from a URL
const fetchJson = async (url, options = {}) => {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            },
            ...options
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

// Function to calculate runtime and return it in a human-readable format
const runtime = (seconds) => {
    seconds = Number(seconds);
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days > 0 ? days + ' days, ' : ''}${hours > 0 ? hours + ' hours, ' : ''}${minutes > 0 ? minutes + ' minutes, ' : ''}${secs > 0 ? secs + ' seconds' : ''}`;
};

// Function to convert seconds to a clock-like string
const clockString = (seconds) => {
    let hours = isNaN(seconds) ? '--' : Math.floor(seconds / 3600);
    let minutes = isNaN(seconds) ? '--' : Math.floor(seconds / 60) % 60;
    let secs = isNaN(seconds) ? '--' : Math.floor(seconds % 60);
    return [hours, minutes, secs].map(num => num.toString().padStart(2, '0')).join(':');
};

// Function to pause the execution for a given time
const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

// Function to check if a string is a valid URL
const isUrl = (string) => {
    return string.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi));
};

// Function to get the current time in a formatted string
const getTime = (format, timeZone) => {
    return timeZone ? moment(timeZone).locale('id').format(format) : moment.tz('Asia/Jakarta').locale('id').format(format);
};

// Function to format a date in a specific locale
const formatDate = (date, locale = 'id') => {
    let d = new Date(date);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
};

// Function to get the current date in Indonesian format
const tanggal = (date) => {
    const myMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const myDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    const dayName = myDays[d.getDay()];
    const monthName = myMonths[month];
    const currentTime = moment.tz('Asia/Jakarta').format('HH:mm:ss');
    return `${dayName}, ${day} ${monthName} - ${year}`;
};

// Function to format a JSON object as a string
const jsonformat = (json) => {
    return JSON.stringify(json, null, 2);
};

// Function to perform logical checks
const logic = (input, conditions, outputs) => {
    if (conditions.length !== outputs.length) throw new Error('Input and Output must have same length');
    for (let i in conditions) if (util.isDeepStrictEqual(input, conditions[i])) return outputs[i];
    return null;
};

// Function to convert bytes to a human-readable format
const bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Function to get the size of media from a URL or buffer
const getSizeMedia = (media) => {
    return new Promise((resolve, reject) => {
        if (/http/.test(media)) {
            axios.get(media).then(response => {
                let size = parseInt(response.headers['content-length']);
                let formattedSize = bytesToSize(size, 3);
                if (!isNaN(size)) resolve(formattedSize);
            });
        } else {
            if (Buffer.isBuffer(media)) {
                let size = Buffer.byteLength(media);
                let formattedSize = bytesToSize(size, 3);
                if (!isNaN(size)) resolve(formattedSize);
            } else reject('Invalid media format');
        }
    });
};

module.exports = {
    unixTimestampSeconds,
    generateMessageTag,
    processTime,
    getRandom,
    getBuffer,
    fetchJson,
    runtime,
    clockString,
    sleep,
    isUrl,
    getTime,
    formatDate,
    tanggal,
    jsonformat,
    logic,
    bytesToSize,
    getSizeMedia
};
