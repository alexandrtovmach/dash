const patientRepository = require('../repositories/patient')
const storageRepository = require('../repositories/storage')

module.exports = {

  getAllPatients: (callback) => {
    patientRepository.getAll(callback)
  },

  getPatientById: (patientId, callback) => {
    patientRepository.findById(patientId, callback)
  },

  searchPatient: (searchKey, callback) => {
    patientRepository.searchByKey(searchKey, callback)
  },

  addPatient: (patientObj, callback) => {
    patientRepository.add(patientObj)
      .then((data) => {
        callback(null, data.key)
      })
      .catch((err) => {
        callback(err)
      })
  },

  updatePatient: (patientId, newPatientObj, callback) => {
    patientRepository.update(patientId, newPatientObj)
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

