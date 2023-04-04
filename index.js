const cors = require('cors')
const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs')

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/')
    }, 
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
    }
})

const uploadMulter = multer({
    storage: multerStorage,
})

const validateMulter = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'tmp/')
        }
    }),
})

const port = 3000

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port, () => {
    console.log(`Example app listening at port: ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World! Welcome to mst.pe server')
})

app.post('/upload', uploadMulter.array('files'), (req, res) => {
    // TODO: Add file validations and error handling
    res.send('Files uploaded successfully')
})

app.post('/validate/simple', validateMulter.single('file') ,(req, res) => {

    // TODO: Add file validations and error handling
    const file = req.file

    const folderFiles = fs.readdirSync('files/')

    const filteredFiles = folderFiles.filter((folderFile) => {{
        return folderFile === file.originalname
    }})

    if (filteredFiles.length > 0) {
        res.status(400).send({
            message: 'File already exists',
        })
    }

    res.send('Files are valid')    

})

app.post('/validate/massive', validateMulter.array('files') ,(req, res) => {

    const files = req.files

    const folderFiles = fs.readdirSync('files/')

    // it receives a list of files and show which ones are already in the folder

    const duplicatedFiles = []

    folderFiles.filter((folderFile) => {
        files.forEach((file) => {
            if (folderFile === file.originalname) {
                duplicatedFiles.push(file.originalname)
            }
        })
    })

    if (duplicatedFiles.length > 0) {
        res.status(400).send({
            message: 'Files already exists',
            duplicatedFiles,
        })
    } else {
        res.send('Files are valid')
    }
})