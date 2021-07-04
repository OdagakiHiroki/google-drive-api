import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { mapMimeTypeToDispType } from 'utils/index';
import { file } from 'utils/types/gapi/files';
import { getFilesList, createFile, getFileById } from 'utils/api/drive/files';
import { Container, Row, FileTitle, FileType } from './style';

export function Home() {
  const [fileList, setFileList] = useState<file[]>([]);
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
    console.debug(res);
    if (res && res.files.length > 0) {
      setFileList(res.files);
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
        <meta name="description" content="A Boilerplate application home" />
      </Helmet>
      <Container>
        <span>HOME</span>
        <span>ファイル一覧</span>
        <Row>
          <Container>
            {fileList.map(file => (
              <Row key={file.id}>
                <FileTitle>
                  <span>{file.name}</span>
                </FileTitle>
                <FileType>
                  <span>{mapMimeTypeToDispType(file.mimeType)}</span>
                </FileType>
              </Row>
            ))}
          </Container>
        </Row>
        <Row>
          <button onClick={() => getFiles()}>ファイル取得</button>
          <button onClick={() => uploadFile()}>ファイルアップロード</button>
          <button onClick={() => downloadFile()}>ファイルダウンロード</button>
        </Row>
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
      </Container>
    </>
  );
}
