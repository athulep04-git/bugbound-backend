//1 import multer
const multer=require('multer')
//setting destination and file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `IMG-${file.originalname}`)
  }
})

function fileFilter (req, file, cb) {

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

if(file.mimetype=='image/png'||file.mimetype=='image/jpeg'||file.mimetype=='image/jpg')
{
// To accept the file pass `true`, like so:
  cb(null, true)
}
else{
// To reject this file pass `false`, like so:

  cb(null, false)
   // You can always pass an error if something goes wrong:
  return cb(new Error(`I don't have a clue!`))
}

}


const multerConfig = multer({ 
    storage,
    fileFilter
})

module.exports=multerConfig