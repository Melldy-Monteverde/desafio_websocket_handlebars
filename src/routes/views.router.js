const { Router } = require('express')
const router = Router()

router.get('/', async (req, res) => {
  res.status(200).render('realTimeProducts')
})

module.exports = router
