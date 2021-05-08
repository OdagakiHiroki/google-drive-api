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
    const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';
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

export { loadGapi, gapiInit };
