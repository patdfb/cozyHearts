import multer from 'multer'

// Store files in memory so we can pass them to Supabase
const upload = multer({ storage: multer.memoryStorage() })

export default upload
