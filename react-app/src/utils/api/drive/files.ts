import { resFiles } from 'utils/types/gapi/files';
import {
  useExportMethodMimeTypeList,
  mapMimeTypeToExportType,
  toBase64,
} from 'utils/index';
import {
  createRequest,
  executeRequest,
  createBatchRequest,
  executeBatchRequest,
} from 'utils/gapi';

const getFilesList = async (params): Promise<resFiles> => {
  // TODO: requestの作り方をwindow.gapi.client.drive.files.updateのように統一するか検討
  const request = createRequest({
    path: '/drive/v3/files',
    method: 'GET',
    params,
  });
  return await executeRequest(request);
};

const getFileById = async (fileId, params) => {
  const request = createRequest({
    path: `/drive/v3/files/${fileId}`,
    method: 'GET',
    params,
  });
  return await executeRequest(request);
};

const uploadFileData = async fileObj => {
  const { name, size, type } = fileObj;
  const params = {
    uploadType: 'multipart',
  };
  const boundary = 'foo_bar_baz';
  const delimiter = `\n--${boundary}\n`;
  const delimiterEnd = `\n--${boundary}--`;
  const headers = {
    'Content-Type': `multipart/related; boundary=${boundary}`,
    'Content-Length': size,
  };
  const fileData = (await toBase64(fileObj)).replace(/^.*base64,/, '');
  const metaData = {
    name,
    mimeType: type,
  };
  // TODO: テンプレートリテラルで改行をうまく処理する方法を考える
  // const body = `${delimiter}Content-Type: application/json; charset=UTF-8\n\n${JSON.stringify(metaData)}${delimiter}Content-Type: ${type}\nContent-Transfer-Encoding: base64\n\n${fileData}\n${delimiterEnd}`
  const body =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\n\n' +
    JSON.stringify(metaData) +
    delimiter +
    `Content-Type: ${type}\n` +
    'Content-Transfer-Encoding: base64\n\n' +
    `${fileData}\n` +
    delimiterEnd;

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
  return await _getFileContentLinkById(fileId, params);
};

// NOTE: 通常用
const _getFileContentLinkById = async (fileId, params) => {
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

const updateFile = async (fileId, body) => {
  const request = createRequest({
    path: `/drive/v3/files/${fileId}`,
    method: 'PATCH',
    body,
  });
  return await executeRequest(request);
};

const updateMultiFiles = async (fileIds, body) => {
  const requests = fileIds.map(fileId => {
    return window.gapi.client.drive.files.update({ fileId, ...body });
  });
  const batch = createBatchRequest(requests);
  return await executeBatchRequest(batch);
};

export {
  getFilesList,
  getFileById,
  uploadFileData,
  getDownloadURL,
  updateFile,
  updateMultiFiles,
};
