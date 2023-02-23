// const URL = 'https://script.google.com/macros/s/AKfycbyeAL1VrrROZ81Zw2V3_rAoZuniAwuShZNpPeYQMSDIYM6yRF2fUL9NhlIyAHk0a9RJ/exec'

function myFunctionDemo() {

  const file = DriveApp.getFileById('140zyF9KElMlxrK87aTHDARhlPjbhrHlu');

  const URL = 'https://script.google.com/macros/s/AKfycbyeAL1VrrROZ81Zw2V3_rAoZuniAwuShZNpPeYQMSDIYM6yRF2fUL9NhlIyAHk0a9RJ/exec'

  const blob = Utilities.newBlob(
    file.getBlob().getBytes(),
    file.getMimeType(),
    file.getName()
  )

  const params = {
    method: 'post',
    payload: {
      filename: blob
    }
  }

  const res = UrlFetchApp.fetch(URL, params)
  console.log(res.getContentText())

}

function test() {
  console.log(TEST)
}
