const MSWordDocumentMimeType =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const MSExcelMimeType =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const MSPowerPointMimeType =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation';

const mimeTypeMap = {
  'text/plain': {
    typeName: 'テキストファイル',
    exportMimeType: 'text/plain',
  },
  'application/vnd.google-apps.document': {
    typeName: 'ドキュメント',
    exportMimeType: MSWordDocumentMimeType,
  },
  'application/vnd.google-apps.spreadsheet': {
    typeName: 'スプレッドシート',
    exportMimeType: MSExcelMimeType,
  },
  'application/vnd.google-apps.folder': {
    typeName: 'フォルダ',
    exportMimeType: 'application/octet-stream',
  },
  'application/pdf': {
    typeName: 'PDF',
    exportMimeType: 'application/pdf',
  },
  'image/png': {
    typeName: '画像ファイル',
    exportMimeType: 'image/png',
  },
  'video/mp4': {
    typeName: '動画ファイル',
    exportMimeType: 'video/mp4',
  },
  'application/octet-stream': {
    typeName: '不明',
    exportMimeType: 'application/octet-stream',
  },
};

const useExportMethodMimeTypeList = [
  'application/vnd.google-apps.document',
  'application/vnd.google-apps.spreadsheet',
];

const mapMimeTypeToDispType = mimeType => {
  if (!mimeTypeMap[mimeType]) {
    return '不明';
  }
  return mimeTypeMap[mimeType].typeName;
};

const mapMimeTypeToExportType = mimeType => {
  if (!mimeTypeMap[mimeType]) {
    return mimeType;
  }
  return mimeTypeMap[mimeType].exportMimeType;
};

const toBase64 = (file): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// const toBinaryString = (file): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsBinaryString(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// };

export {
  useExportMethodMimeTypeList,
  mapMimeTypeToDispType,
  mapMimeTypeToExportType,
  toBase64,
};
