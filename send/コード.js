/*
 * kintoneとgasを連携させ、
 * APIで外部システムへCSVファイルを送信する
 * 20230223
 */

const COMMA = ','
const CSV_COLUMN_LIST = ['レコード番号', 'title']

function main() {
  // カーソルIDの取得
  let cursorId = createCursor()

  // レコードの取得
  let records = getRecords(cursorId)

  // csvBlobの生成
  let csvBlob = convertJsonToCsv(records, CSV_COLUMN_LIST)

  const URL =
    'https://script.google.com/macros/s/AKfycbx9c-YQuT5RvXDEiTy3J2PzXHEqf4noa3lBLWZVkD9Y2tS4VniD9dWwqhhJCEXeHlCyLA/exec'

  postBlob(csvBlob, URL)

  // console.log(array.length)
  // console.log(array[array.length-1].title.value)
  // console.log(array[array.length-1].レコード番号.value)

  // リクエストパラメータの設定

  // let body = {
  //   'app': app_id,
  //   // 'query': '更新日時 > \'2012-02-03T09:00:00+0900\' and 更新日時 < \'2012-02-03T10:00:00+0900\' order by レコード番号 asc limit 10 offset 1',
  //   // 'fields': ['レコード番号', 'フィールド']
  // }
  // const options = {
  //   headers : {
  //     'X-Cybozu-API-Token' : API_TOKEN,
  //     'Content-Type': 'application/json'
  //   },
  // };

  // // 取ってきたレコードのデータを表示する
  // const resp = UrlFetchApp.fetch(url,options);
  // let records = JSON.parse(resp.getContentText()).records;
  // console.log(records.length);

  // // var response = UrlFetchApp.fetch('http://www.google.com/');
  // // console.log(response.getContentText());

  // googleドライブにファイルをアップロードするサンプル
  // let folder = DriveApp.getFolderById('1WbWyvI9nMzsrFubusVEjafVPkYqzPypp')
  // let file = folder.createFile('kintone gas 連携テスト.csv', output, MimeType.PLAIN_TEXT)
  // let filename = file.getName();
  // let fileid = file.getId();
  // console.log(fileid)
}

/*
 * カーソルを作成する
 */
function createCursor() {
  // リクエストヘッダ
  const headers = {
    'X-Cybozu-API-Token': API_TOKEN,
    'Content-Type': 'application/json',
  }

  const body = {
    app: API_ID,
    size: 500, // 一度の検索で取得するレコード数
  }

  const options = {
    headers: headers,
    method: 'POST',
    payload: JSON.stringify(body),
  }

  const url = API_URL + '/k/v1/records/cursor.json'
  let cursorId = ''

  // カーソルを作成し、カーソルIDを取得
  try {
    const resCreateCursor = UrlFetchApp.fetch(url, options)
    console.log(resCreateCursor.getContentText())
    cursorId = JSON.parse(resCreateCursor.getContentText()).id
    // let records = JSON.parse(resp.getContentText()).records;
    // console.log(records.length);
  } catch (e) {
    console.log(e)
    // TODO 例外処理
  }

  return cursorId
}

/*
 * カーソルを使ってレコードを取得する。
 */
function getRecords(cursorId) {
  // 返却値初期化
  let records = []

  const url = API_URL + '/k/v1/records/cursor.json' + '?id=' + cursorId

  const headers = {
    'X-Cybozu-API-Token': API_TOKEN,
  }

  const options = {
    headers: headers,
    method: 'GET',
  }

  // カーソルIDを使ってレコードを取得
  try {
    while (true) {
      const resGetRecords = UrlFetchApp.fetch(url, options)
      let json = JSON.parse(resGetRecords.getContentText())

      // 配列に追加
      records.push(...json.records)

      if (!json.next) {
        break
      }
    }
  } catch (e) {
    console.log(e)
    // TODO 例外処理
  }

  return records
}

/*
 * JSONデータをCSV文字列に変換する
 */
function convertJsonToCsv(records, csvColumnList) {
  // nullを返す。
  if (records === null || csvColumnList === null) {
    return null
  }

  let output = ''
  let headerRow = ''

  // 見出し行の生成
  for (let i = 0; i < csvColumnList.length; i++) {
    if (i !== 0) {
      headerRow += COMMA
    }

    headerRow += csvColumnList[i]
  }

  output += headerRow + '\r\n'

  // 明細行の生成
  for (let i = 0; i < records.length; i++) {
    let row = ''

    for (let j = 0; j < csvColumnList.length; j++) {
      if (j !== 0) {
        row += COMMA
      }

      row += records[i][csvColumnList[j]].value
    }

    output += row + '\r\n'
  }

  return Utilities.newBlob(output, MimeType.PLAIN_TEXT, 'csvtest.csv')
}

/*
 * Blobデータをポストする
 */
function postBlob(blob, url) {
  const params = {
    method: 'POST',
    payload: {
      filename: blob,
    },
  }

  return UrlFetchApp.fetch(url, params)
}
