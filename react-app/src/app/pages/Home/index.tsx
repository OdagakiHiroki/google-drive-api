import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { mapMimeTypeToDispType } from 'utils/index';
import { file } from 'utils/types/gapi/files';
import {
  getFilesList,
  createFile,
  getDownloadURL,
} from 'utils/api/drive/files';
import { Container, Row, FileTitle, FileType } from './style';

export function Home() {
  const downloadLinkEl = useRef<HTMLAnchorElement>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [fileList, setFileList] = useState<file[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [downloadFileName, setDownloadFileName] = useState<string>('');

  useEffect(() => {
    if (downloadLinkEl.current === null) {
      return;
    }
    if (!downloadLink) {
      return;
    }
    downloadLinkEl.current.click();
    setDownloadLink('');
    setDownloadFileName('');
  }, [downloadLink]);

  const fileFields =
    'kind, id, name, mimeType, description, starred, trashed, webContentLink, webViewLink';

  const getFiles = async () => {
    const params = {
      fields: `kind, nextPageToken, files(${fileFields})`,
    };
    const { files, error } = await getFilesList(params);
    if (error) {
      console.debug('ファイル取得失敗');
    }
    if (files) {
      setFileList(files);
    }
  };

  const searchFiles = async text => {
    const query = `name contains '${text}'`;
    const params = {
      fields: `kind, nextPageToken, files(${fileFields})`,
      q: query,
    };
    const { files, error } = await getFilesList(params);
    if (error) {
      console.debug('ファイル取得失敗');
    }
    if (files) {
      setFileList(files);
    }
  };

  const uploadFile = async e => {
    const res = await createFile(e.currentTarget.files[0]);
    console.debug(res);
  };

  const downloadFile = async file => {
    const params = {
      fields: fileFields,
    };
    const res = await getDownloadURL(file, params);
    setDownloadFileName(file.name);
    setDownloadLink(res);
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="A Boilerplate application home" />
      </Helmet>
      <Container>
        <span>HOME</span>
        <Row>
          <button onClick={() => getFiles()}>全ファイル取得</button>
          <input type="file" onChange={e => uploadFile(e)} />
        </Row>
        <span>ファイル検索</span>
        <Row>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.currentTarget.value)}
          />
          <button onClick={() => searchFiles(searchText)}>検索</button>
        </Row>
        <span>ファイル一覧</span>
        <Row>
          <Container>
            {fileList.length === 0 ? (
              <span>ファイルがありません</span>
            ) : (
              fileList.map(file => (
                <Row key={file.id}>
                  <FileTitle>
                    <span>{file.name}</span>
                  </FileTitle>
                  <FileType>
                    <span>{mapMimeTypeToDispType(file.mimeType)}</span>
                  </FileType>
                  <button onClick={() => downloadFile(file)}>DL</button>
                </Row>
              ))
            )}
          </Container>
        </Row>
        <div>
          <a
            ref={downloadLinkEl}
            href={downloadLink}
            rel="noreferrer noopener"
            download={downloadFileName}
          >
            {downloadLink}
          </a>
        </div>
      </Container>
    </>
  );
}
