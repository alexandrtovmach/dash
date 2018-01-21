const menuRepository = require('../repositories/menu')
const storageRepository = require('../repositories/storage')

module.exports = {

  getAllMenus: (callback) => {
    menuRepository.findAll()
      .then((data) => {
        callback(null, data.val())
      })
      .catch((err) => {
        callback(err)
      })
  },

  getMenuById: (menuId, callback) => {
    menuRepository.findById(menuId)
      .then((data) => {
        callback(null, data.val())
      })
      .catch((err) => {
        callback(err)
      })
  },

  addMenu: (menuObj, callback) => {
    menuRepository.add(menuObj)
      .then((data) => {
        callback(null, data.key)
      })
      .catch((err) => {
        callback(err)
      })
  },

  updateMenu: (menuId, newMenuObj, callback) => {
    menuRepository.update(menuId, newMenuObj)
      .then((data) => {
        callback(null, true)
      })
      .catch((err) => {
        callback(err)
      })
  },

  uploadImage: (file, callback) => {
    storageRepository.uploadImage(file)
      .then((success) => {
        callback(null, success)
      })
      .catch((error) => {
        callback(error)
      })
  },

  deleteImage: (fileId, callback) => {
    storageRepository.deleteImage(fileId)
      .then((success) => {
        callback(null, success)
      })
      .catch((error) => {
        callback(error)
      })
  }
}

