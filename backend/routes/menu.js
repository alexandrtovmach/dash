const express = require('express')
const Multer = require('multer')
const router = express.Router()
const menuService = require('../services/menu')

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

// router.get('/', (req, res, next) => {
//     menuService.getAllMenus((err, result) => {
//         if (err) {
//             console.error(err)
//             res.status(400).send(err)
//         }
//         res.status(200).send(result)
//     })
// })

router.get('/:id', (req, res, next) => {
    menuService.getMenuById(req.params.id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/', (req, res, next) => {
    menuService.addMenu(req.body, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.put('/:id', (req, res, next) => {
    menuService.updateMenu(req.params.id, req.body, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/upload', multer.single('file'), (req, res, next) => {
    menuService.uploadImage(req.file, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
})

router.post('/uploadFile', multer.single('file'), (req, res, next) => {
    console.log(req.file)
    // menuService.uploadImage(req.file, (err, result) => {
    //     if (err) {
    //         console.error(err)
    //         res.status(400).send(err)
    //     }
    //     res.status(200).send(result)
    // })
})


router.delete('/delete/:id', (req, res, next) => {
    menuService.deleteImage(req.params.id, (err, result) => {
        if (err) {
            console.error(err)
            res.status(400).send(err)
        }
        res.sendStatus(200)
    })
})



module.exports = router
