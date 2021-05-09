import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getFilesList, createFile, getFileById } from 'utils/api/drive/files';

export function HomePage() {
  const [downloadLink, setDownloadLink] = useState('');

  const getFiles = async () => {
    const fields = [
      'kind',
      'nextPageToken',
      'files(kind, id, name, mimeType, description, starred, trashed)',
    ].join(', ');
    const params = {
      fields,
    };
    const res = await getFilesList(params);
    if (res) {
      console.debug(res);
    }
  };

  const uploadFile = async () => {
    const file = new File(['Hello, world!'], 'hello world.txt', {
      type: 'text/plain;charset=utf-8',
    });
    const params = {
      uploadType: 'media',
    };
    const headers = {
      'Content-Type': file.type,
      'Content-Length': file.size,
    };
    const body = file;
    const res = await createFile(params, headers, body);
    console.debug(res);
  };

  const downloadFile = async () => {
    const fields = [
      'kind',
      'id',
      'name',
      'mimeType',
      'description',
      'starred',
      'trashed',
      'webContentLink',
      'webViewLink',
    ].join(', ');
    const params = {
      fields,
    };
    const fieldId = '';
    const res: any = await getFileById(fieldId, params);
    console.debug(res.webContentLink);
    setDownloadLink(res.webContentLink);
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <span>HomePage container</span>
      <div>
        <button onClick={() => getFiles()}>ファイル取得</button>
      </div>
      <div>
        <button onClick={() => uploadFile()}>ファイルアップロード</button>
      </div>
      <div>
        <button onClick={() => downloadFile()}>ファイルダウンロード</button>
      </div>
      <div>
        <a
          href={downloadLink}
          rel="noreferrer noopener"
          target="_blank"
          download="sample.mp4"
        >
          {downloadLink}
        </a>
      </div>
    </>
  );
}
