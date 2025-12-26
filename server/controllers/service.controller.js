import formidable from 'formidable'
import fs from 'fs'
import extend from 'lodash/extend'
import Service from '../models/service.model'
import errorHandler from './../helpers/dbErrorHandler'

// Allowed image types and max size
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const validateImage = (file) => {
  if (!file) return { valid: true }

  const filePath = file.filepath || file.path
  const fileType = file.mimetype || file.type
  const fileSize = file.size

  if (!ALLOWED_TYPES.includes(fileType)) {
    return { valid: false, error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP' }
  }
  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: 'Image too large. Maximum size is 5MB' }
  }
  return { valid: true, path: filePath, type: fileType }
}

const create = (req, res, next) => {
  const form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.maxFileSize = MAX_FILE_SIZE

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Image could not be uploaded' })
    }

    // Validate image if provided
    const imageValidation = validateImage(files.image)
    if (!imageValidation.valid) {
      return res.status(400).json({ error: imageValidation.error })
    }

    const service = new Service(fields)
    service.seller = req.profile._id

    if (files.image && imageValidation.path) {
      service.image.data = fs.readFileSync(imageValidation.path)
      service.image.contentType = imageValidation.type
    }

    try {
      const result = await service.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
    }
  })
}

const serviceByID = async (req, res, next, id) => {
  try {
    const service = await Service.findById(id).populate('seller', '_id name').exec()
    if (!service) {
      return res.status(400).json({ error: 'Service not found' })
    }
    req.service = service
    next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve service' })
  }
}

const photo = (req, res, next) => {
  if (req.service.image.data) {
    res.set('Content-Type', req.service.image.contentType)
    return res.send(req.service.image.data)
  }
  next()
}

const defaultPhoto = (req, res) => {
  return res.status(404).json({ error: 'No image available' })
}

const read = (req, res) => {
  req.service.image = undefined
  return res.json(req.service)
}

const update = (req, res) => {
  const form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.maxFileSize = MAX_FILE_SIZE

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: 'Photo could not be uploaded' })
    }

    // Validate image if provided
    const imageValidation = validateImage(files.image)
    if (!imageValidation.valid) {
      return res.status(400).json({ error: imageValidation.error })
    }

    let service = req.service
    service = extend(service, fields)
    service.updated = Date.now()

    if (files.image && imageValidation.path) {
      service.image.data = fs.readFileSync(imageValidation.path)
      service.image.contentType = imageValidation.type
    }

    try {
      const result = await service.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
    }
  })
}

const remove = async (req, res) => {
  try {
    const service = req.service
    await Service.deleteOne({ _id: service._id })
    res.json({ message: 'Service deleted successfully', deleted: service._id })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}


const list = async (req, res) => {
  // Build query based on available filters
  const query = {}
  if (req.query.search) {
    query.$text = { $search: req.query.search }
  }
  if (req.query.category && req.query.category !== 'All') {
    query.category = req.query.category
  }
  if (req.query.seller) {
    query.seller = req.query.seller
  }
  if (req.query.status) {
    query.status = req.query.status
  }
  if (typeof req.query.featured !== 'undefined') {
    query.featured = req.query.featured === 'true'
  }

  try {
    let findQuery = Service.find(query).populate('seller', '_id name')

    // Use text score when searching; otherwise fall back to recency
    if (req.query.search) {
      findQuery = findQuery
        .select({ image: 0, score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, created: -1 })
    } else {
      findQuery = findQuery
        .select('-image')
        .sort('-created')
    }

    const services = await findQuery.exec()
    res.json(services)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listBySeller = async (req, res) => {
  try {
    let services = await Service.find({ seller: req.profile._id })
      .select('-image')
      .populate('seller', '_id name')
      .sort('-created')
      .exec()
    res.json(services)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listLatest = async (req, res) => {
  try {
    let services = await Service.find({ status: 'active' })
      .select('-image')
      .populate('seller', '_id name')
      .limit(6)
      .sort('-created')
      .exec()
    res.json(services)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listRelated = async (req, res) => {
  try {
    let service = await Service.findById(req.params.serviceId)
    let services = await Service.find({
      _id: { $ne: req.params.serviceId },
      category: service.category,
      status: 'active'
    })
      .select('-image')
      .populate('seller', '_id name')
      .limit(6)
      .sort('-created')
      .exec()
    res.json(services)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listCategories = async (req, res) => {
  try {
    let categories = await Service.distinct('category', { status: 'active' })
    res.json(categories)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const listFeatured = async (req, res) => {
  try {
    let services = await Service.find({ featured: true, status: 'active' })
      .select('-image')
      .populate('seller', '_id name')
      .limit(6)
      .sort('-created')
      .exec()
    res.json(services)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  serviceByID,
  photo,
  defaultPhoto,
  read,
  update,
  remove,
  list,
  listBySeller,
  listLatest,
  listRelated,
  listCategories,
  listFeatured
}

