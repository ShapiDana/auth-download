import { TIMEOUT_MILISEC } from './config.js';

const timeout = function (ms) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${ms} second`));
      }, ms * 1000);
    });
  };

export const AJAX = async (url, uploadData = undefined) => {
    try {
        const fetchPro = uploadData
        ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(uploadData)
        })
        : fetch(url);
  
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_MILISEC)]);

        let data;
        try {
          data = await res.json();
        } catch(err) {
          return res.body;
        }
        if (!res.ok) throw new Error(`${data.error} (${res.status})`);

        return data;
    } catch (err) {
        console.error(`AJAX: ${err.toString()}`);
        throw err;
    }
  };