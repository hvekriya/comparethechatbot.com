const express = require('express')
const router = express.Router()
const chatbotController = require('../controllers/chatbotController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(chatbotController.getChatbots))
router.get('/chatbots', catchErrors(chatbotController.getChatbots))
router.get('/chatbots/page/:page', catchErrors(chatbotController.getChatbots))
router.get('/add', authController.isLoggedIn, chatbotController.addChatbot)

router.post('/add',
  chatbotController.upload,
  catchErrors(chatbotController.resize),
  catchErrors(chatbotController.createChatbot)
)

router.post('/add/:id',
  chatbotController.upload,
  catchErrors(chatbotController.resize),
  catchErrors(chatbotController.updateChatbot)
)

router.get('/chatbots/:id/edit', catchErrors(chatbotController.editChatbot))
router.get('/chatbot/:slug', catchErrors(chatbotController.getChatbotBySlug))

router.get('/tags', catchErrors(chatbotController.getChatbotsByTag))
router.get('/tags/:tag', catchErrors(chatbotController.getChatbotsByTag))

router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/register', userController.registerForm)

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
)

router.get('/logout', authController.logout)

router.get('/account', authController.isLoggedIn, userController.account)
router.post('/account', catchErrors(userController.updateAccount))
router.post('/account/forgot', catchErrors(authController.forgot))
router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)
router.get('/hearts', authController.isLoggedIn, catchErrors(chatbotController.getHearts))
router.post('/reviews/:id',
  authController.isLoggedIn,
  catchErrors(reviewController.addReview)
)
router.get('/top', chatbotController.getTopChatbots)
router.get('/faq', (req, res) => {
  return res.render('faq', {title: 'FAQ'})
})

router.get('/news', (req, res) => {
  return res.render('news', {title: 'News'})
})

/*
  API
*/

router.get('/api/search', catchErrors(chatbotController.searchChatbots))
router.get('/api/chatbots/near', catchErrors(chatbotController.mapChatbots))
router.post('/api/chatbots/:id/heart', catchErrors(chatbotController.heartChatbot))

module.exports = router
