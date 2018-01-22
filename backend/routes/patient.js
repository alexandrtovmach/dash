const express = require('express')
const Multer = require('multer')
const router = express.Router()
const patientService = require('../services/patient')

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

router.get('/', (req, res, next) => {
    patientService.getAllPatients((err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.get('/:id', (req, res, next) => {
    patientService.getPatientById(req.params.id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.get('/search/:key', (req, res, next) => {
    patientService.searchPatient(req.params.key, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/', (req, res, next) => {
    patientService.addPatient(req.body, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.put('/:id', (req, res, next) => {
    patientService.updatePatient(req.params.id, req.body, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/upload', multer.single('file'), (req, res, next) => {
    patientService.uploadImage(req.file, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/uploadFile', multer.single('file'), (req, res, next) => {
    console.log(req.file)
    // patientService.uploadImage(req.file, (err, result) => {
    //     if (err) {
    //         console.error(err)
    //         res.status(400).send(err)
    //     }
    //     res.status(200).send(result)
    // })
})


router.delete('/delete/:id', (req, res, next) => {
    patientService.deleteImage(req.params.id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.sendStatus(200)
    })
})



module.exports = router
