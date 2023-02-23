function doPostDemo() {

  const file = DriveApp.getFileById('140zyF9KElMlxrK87aTHDARhlPjbhrHlu');

  const blob = Utilities.newBlob(
    file.getBlob().getBytes(),
    file.getMimeType(),
    file.getName()
  )

  e = {
    postData: blob
  }

  doPost(e)
  
}


function doPost(e) {

  let folder = DriveApp.getFolderById('1WbWyvI9nMzsrFubusVEjafVPkYqzPypp')

  try {
    let file = DriveApp.createFile('kintone gas 連携テスト.csv', e, MimeType.PLAIN_TEXT)
    folder.createFile('ログ.log', e, MimeType.PLAIN_TEXT)
  
  } catch (error) {
    
    folder.createFile('エラー.log', error.message, MimeType.PLAIN_TEXT)
    
  }

  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON)

  const response = {
    status: 200,
    message: 'Hello World'
  }

  output.setContent(JSON.stringify(response))

  return output
}
