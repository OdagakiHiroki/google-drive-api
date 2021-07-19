type RequestParam = {
  path: string; // The URL to handle the request.
  method?: string; // The HTTP request method to use. Default is GET.
  params?: object; // URL params in key-value pair form.
  headers?: object; // Additional HTTP request headers.
  body?: string | object; // The HTTP request body (applies to PUT or POST).
};

// TODO: リファクタする
const loadGapi = () => {
  return new Promise((resolve, reject) => {
    const scriptDom = document.createElement('script');
    scriptDom.id = 'gapiScript';
    scriptDom.src = 'https://apis.google.com/js/api.js';
    scriptDom.async = true;
    scriptDom.defer = true;
    scriptDom.onload = () => {
      console.log('gapi.js loaded.');
      resolve('gapi.js loaded');
    };
    scriptDom.onerror = () => {
      console.log('gapi.js not loaded.');
      reject();
    };
    document.getElementsByTagName('head')[0].appendChild(scriptDom);
  });
};

const gapiInit = callback => {
  const initClient = () => {
    const DISCOVERY_DOCS = [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ];
    const SCOPES = 'https://www.googleapis.com/auth/drive';
    window.gapi.client
      .init({
        apiKey: process.env.REACT_APP_GOOGLE_AUTH_API_KEY,
        clientId: process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        console.log('init完了');
        callback();
      });
  };
  (async () => {
    await loadGapi();
    await window.gapi.load('client:auth2', initClient);
  })();
};

const createRequest = ({
  path,
  method,
  params,
  headers,
  body,
}: RequestParam) => {
  return window.gapi.client.request({
    path,
    method,
    params,
    headers,
    body,
  });
};

const executeRequest = (requestObject, isRawRes = false): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestObject.execute((jsonResp, rawResp) => {
      if (isRawRes) {
        if (rawResp) {
          resolve(rawResp);
          return;
        }
        reject('request failure');
        return;
      }
      if (jsonResp) {
        resolve(jsonResp);
        return;
      }
      reject('request failure');
    });
  });
};

export { loadGapi, gapiInit, createRequest, executeRequest };
