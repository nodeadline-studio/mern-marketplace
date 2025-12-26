import express from 'express'
import serviceCtrl from '../controllers/service.controller'
import authCtrl from '../controllers/auth.controller'
import userCtrl from '../controllers/user.controller'

const router = express.Router()

// Route to create service (requires authentication and seller role)
router.route('/api/services/by/:userId')
  .post(authCtrl.requireSignin, authCtrl.hasAuthorization, serviceCtrl.create)
  .get(serviceCtrl.listBySeller)

// Route for latest services
router.route('/api/services/latest')
  .get(serviceCtrl.listLatest)

// Route for featured services
router.route('/api/services/featured')
  .get(serviceCtrl.listFeatured)

// Route for related services
router.route('/api/services/related/:serviceId')
  .get(serviceCtrl.listRelated)

// Route for service categories
router.route('/api/services/categories')
  .get(serviceCtrl.listCategories)

// Route for all services (with optional query params)
router.route('/api/services')
  .get(serviceCtrl.list)

// Route for service search (mapped to list for clarity)
router.route('/api/services/search')
  .get(serviceCtrl.list)

// Route for specific service
router.route('/api/services/:serviceId')
  .get(serviceCtrl.read)
  .put(authCtrl.requireSignin, serviceCtrl.update)
  .delete(authCtrl.requireSignin, serviceCtrl.remove)

// Route for service image
router.route('/api/service/image/:serviceId')
  .get(serviceCtrl.photo, serviceCtrl.defaultPhoto)

// Route for default service image
router.route('/api/service/defaultphoto')
  .get(serviceCtrl.defaultPhoto)

// Middleware to load service by ID
router.param('serviceId', serviceCtrl.serviceByID)
router.param('userId', userCtrl.userByID)

export default router

