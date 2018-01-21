const storage = require('../db/firebase').storage
const format = require('util').format

class StorageRepository {

  uploadImage(imgFile) {
    return new Promise((resolve, reject) => {
      if (!imgFile) {
        reject('No image file')
      }

      const fileUpload = storage.file(`${imgFile.fieldname}-${imgFile.size}-${Date.now()*13}`)

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: imgFile.mimetype
        },
        public: true
      })

      blobStream.on('error', (error) => {
        console.error(error)
        reject('Something is wrong! Unable to upload at the moment')
      })

      blobStream.on('finish', () => {
        const url = format(`https://storage.googleapis.com/${storage.name}/${fileUpload.name}`)
        resolve(url)
      })

      blobStream.end(imgFile.buffer)
    })
  }

  deleteImage(id) {
    return storage.file(id).delete()
  }

}

module.exports = new StorageRepository()
