import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { mapMimeTypeToDispType } from 'utils/index';
import { file } from 'utils/types/gapi/files';
import {
  getFilesList,
  getFileById,
  uploadFileData,
  getDownloadURL,
  updateMultiFiles,
} from 'utils/api/drive/files';
import {
  Container,
  Row,
  Tab,
  CheckColumn,
  CheckBox,
  FileTitle,
  FileType,
} from './style';

type tabs = {
  myDrive: number;
  trash: number;
};

export function Home() {
  const tabList: tabs = useMemo(() => {
    return {
      myDrive: 0,
      trash: 99,
    };
  }, []);

  const downloadLinkEl = useRef<HTMLAnchorElement>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<number>(tabList.myDrive);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>('root');
  const [parentFolderId, setParentFolderId] = useState<string | undefined>('');
  const [baseQuery, setBaseQuery] = useState<string>('');
  const [fileList, setFileList] = useState<file[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [downloadFileName, setDownloadFileName] = useState<string>('');
  const [checkedFileList, setCheckedFileList] = useState<string[]>([]);

  useEffect(() => {
    if (baseQuery === '') {
      return;
    }
    getFiles();
  }, [baseQuery]);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      const { parents } = await getFolder(currentFolderId);
      if (unmounted) {
        return;
      }
      setParentFolderId(parents?.[0]);
    })();
    return () => {
      unmounted = true;
    };
  }, [currentFolderId]);

  useEffect(() => {
    const isTrashed = selectedTab === tabList.trash;
    const query = `trashed = ${isTrashed} and '${currentFolderId}' in parents`;
    setBaseQuery(query);
  }, [selectedTab, currentFolderId, tabList]);

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
    'parents, kind, id, name, mimeType, description, starred, trashed, webContentLink, webViewLink';

  const handleFileCheck = (e, fileId) => {
    e.stopPropagation();
    setCheckedFileList(prevList => {
      if (prevList.includes(fileId)) {
        return prevList.filter(prev => prev !== fileId);
      }
      return [...prevList, fileId];
    });
  };

  const handleTabClick = (tabValue: number) => {
    setCurrentFolderId('root');
    setSelectedTab(tabValue);
  };

  const handleClickBack = async () => {
    const { parents } = await getFolder(currentFolderId);
    changeCurrentFolder(parents?.[0]);
  };

  const handleFileItemClick = file => {
    const { id, mimeType } = file;
    if (mimeType !== 'application/vnd.google-apps.folder') {
      return;
    }
    changeCurrentFolder(id);
  };

  const changeCurrentFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const getFolder = async folderId => {
    if (folderId === '') {
      return null;
    }
    const params = {
      fields: fileFields,
    };
    return await getFileById(folderId, params);
  };

  const getFiles = async () => {
    setCheckedFileList([]);
    const params = {
      fields: `kind, nextPageToken, files(${fileFields})`,
      q: baseQuery,
    };
    const { files, error } = await getFilesList(params);
    if (error) {
      console.debug('ファイル取得失敗');
    }
    if (files) {
      setFileList(files);
    }
  };

  const searchFiles = async (text: string) => {
    setCheckedFileList([]);
    const query = `${baseQuery} and name contains '${text}'`;
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
    e.persist();
    const res = await uploadFileData(e.target.files[0]);
    if (res.id) {
      e.target.value = '';
      await getFiles();
    }
  };

  const downloadFile = async (e, file) => {
    e.stopPropagation();
    const params = {
      fields: fileFields,
    };
    const res = await getDownloadURL(file, params);
    setDownloadFileName(file.name);
    setDownloadLink(res);
  };

  const trashFile = async () => {
    if (checkedFileList.length === 0) {
      return;
    }
    const body = {
      trashed: true,
    };
    await updateMultiFiles(checkedFileList, body);
    await getFiles();
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
        <Row>
          <button onClick={() => trashFile()}>削除</button>
        </Row>
        <Row>
          <Tab
            isActive={selectedTab === tabList.myDrive}
            onClick={() => handleTabClick(tabList.myDrive)}
          >
            マイドライブ
          </Tab>
          <Tab
            isActive={selectedTab === tabList.trash}
            onClick={() => handleTabClick(tabList.trash)}
          >
            ゴミ箱
          </Tab>
        </Row>
        <span>ファイル一覧</span>
        {parentFolderId && (
          <Row>
            <button onClick={() => handleClickBack()}>←戻る</button>
          </Row>
        )}
        <Row>
          <Container>
            {fileList.length === 0 ? (
              <span>ファイルがありません</span>
            ) : (
              fileList.map(file => (
                <Row key={file.id} onClick={() => handleFileItemClick(file)}>
                  <CheckColumn>
                    <CheckBox
                      isActive={checkedFileList.includes(file.id)}
                      onClick={e => handleFileCheck(e, file.id)}
                    >
                      ✔︎
                    </CheckBox>
                  </CheckColumn>
                  <FileTitle>
                    <span>{file.name}</span>
                  </FileTitle>
                  <FileType>
                    <span>{mapMimeTypeToDispType(file.mimeType)}</span>
                  </FileType>
                  {file.mimeType !== 'application/vnd.google-apps.folder' && (
                    <button onClick={e => downloadFile(e, file)}>DL</button>
                  )}
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
