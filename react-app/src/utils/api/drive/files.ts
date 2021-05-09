import { createRequest, executeRequest } from 'utils/gapi';

const getFilesList = async params => {
  const request = createRequest({
    path: '/drive/v3/files',
    method: 'GET',
    params,
  });
  console.debug(request);
  return await executeRequest(request);
};

const createFile = async (params, headers, body) => {
  const request = createRequest({
    path: '/upload/drive/v3/files',
    method: 'POST',
    params,
    headers,
    body,
  });
  return await executeRequest(request);
};

const getFileById = async (fileId, params) => {
  const request = createRequest({
    path: `/drive/v3/files/${fileId}`,
    method: 'GET',
    params,
  });
  const res = await executeRequest(request);
  console.debug(res);
  return res;
};

export { getFilesList, createFile, getFileById };
