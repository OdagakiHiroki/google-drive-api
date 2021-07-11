import { resFiles } from 'utils/types/gapi/files';
import {
  useExportMethodMimeTypeList,
  mapMimeTypeToExportType,
} from 'utils/index';
import { createRequest, executeRequest } from 'utils/gapi';

const getFilesList = async (params): Promise<resFiles> => {
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

// NOTE: google spredsheetなどgoogle用
// const getFileById = async (fileId, params) => {
//   const request = createRequest({
//     path: `/drive/v3/files/${fileId}/export`,
//     method: 'GET',
//     params,
//   });
//   const res = await executeRequest(request);
//   console.debug(res);
//   return res;
// };

// TODO: リファクタ
const getDownloadURL = async (fileObj, params) => {
  // const fields = [
  //   'kind',
  //   'id',
  //   'name',
  //   'mimeType',
  //   'description',
  //   'starred',
  //   'trashed',
  //   'webContentLink',
  //   'webViewLink',
  // ].join(', ');
  // const params = {
  //   fields,
  //   // mimeType:
  //   //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   // alt: 'media', // NOTE: binaryで返却される
  // };
  const { id: fileId, mimeType } = fileObj;
  const useExportApi = useExportMethodMimeTypeList.includes(mimeType);
  // const useExportApi = true;
  // const path = `/drive/v3/files/${fileId}`;
  const path = useExportApi
    ? `/drive/v3/files/${fileId}/export`
    : `/drive/v3/files/${fileId}`;
  const exportMimeType = mapMimeTypeToExportType(mimeType);
  if (useExportApi) {
    params = {
      ...params,
      mimeType: exportMimeType,
      alt: 'media',
    };
  }
  console.debug(params);
  const request = createRequest({
    path,
    method: 'GET',
    params,
  });
  const res = await executeRequest(request, useExportApi);
  if (useExportApi) {
    console.debug(JSON.parse(res));
    const { body, headers } = JSON.parse(res).gapiRequest.data;
    console.debug(headers['Content-Type']);
    console.debug(body);
    const strBase64 = window.btoa(body);
    const dataUrl = `data:${headers['Content-Type']};base64,${strBase64}`;
    return dataUrl;
  } else {
    return res.webContentLink;
  }
};

// NOTE: 通常用
const getFileById = async (fileId, params) => {
  // const fields = [
  //   'kind',
  //   'id',
  //   'name',
  //   'mimeType',
  //   'description',
  //   'starred',
  //   'trashed',
  //   'webContentLink',
  //   'webViewLink',
  // ].join(', ');
  // const params = {
  //   fields,
  //   // mimeType:
  //   //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   // alt: 'media', // NOTE: binaryで返却される
  // };
  const isRawRes = params.alt === 'media';
  const request = createRequest({
    path: `/drive/v3/files/${fileId}`,
    method: 'GET',
    params,
  });
  const res = await executeRequest(request, isRawRes);
  console.debug(res);
  if (isRawRes) {
    console.debug(JSON.parse(res));
    return JSON.parse(res);
  }
  return res;
};

export { getFilesList, createFile, getFileById, getDownloadURL };
