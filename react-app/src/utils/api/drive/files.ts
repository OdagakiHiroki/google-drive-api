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

const getDownloadURL = async (fileObj, params) => {
  const { id: fileId, mimeType } = fileObj;
  const useExportApi = useExportMethodMimeTypeList.includes(mimeType);
  if (useExportApi) {
    const exportMimeType = mapMimeTypeToExportType(mimeType);
    return await _getFileContent(fileId, exportMimeType, params);
  }
  return await _getFileById(fileId, params);
};

// NOTE: 通常用
const _getFileById = async (fileId, params) => {
  const request = createRequest({
    path: `/drive/v3/files/${fileId}`,
    method: 'GET',
    params,
  });
  const res = await executeRequest(request);
  return res.webContentLink;
};

const _getFileContent = async (fileId, exportMimeType, params) => {
  const request = createRequest({
    path: `/drive/v3/files/${fileId}/export`,
    method: 'GET',
    params: {
      ...params,
      mimeType: exportMimeType,
      alt: 'media',
    },
  });
  const res = await executeRequest(request, true);
  const { body, headers } = JSON.parse(res).gapiRequest.data;
  const strBase64 = window.btoa(body);
  const dataUrl = `data:${headers['Content-Type']};base64,${strBase64}`;
  return dataUrl;
};

export { getFilesList, createFile, getDownloadURL };
