const mimeTypeMap = {
  'text/plain': 'テキストファイル',
  'application/vnd.google-apps.document': 'ドキュメント',
  'application/vnd.google-apps.spreadsheet': 'スプレッドシート',
  'application/vnd.google-apps.folder': 'フォルダ',
  'application/pdf': 'PDF',
  'image/png': '画像ファイル',
  'video/mp4': '動画ファイル',
  'application/octet-stream': '不明',
}

const mapMimeTypeToDispType = mimeType => {
  return mimeTypeMap[mimeType] || '不明';
}

export { mapMimeTypeToDispType };
