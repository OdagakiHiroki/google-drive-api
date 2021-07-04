type file = {
  kind: string;
  id: string;
  name: string;
  mimeType: string;
  description: string;
  starred: boolean;
  trashed: boolean;
};

type resFiles = {
  kind: string;
  nextPageToken?: string;
  incompleteSearch?: boolean;
  files: file[];
  error?: object;
};

export type { file, resFiles };