import { MemberModel } from "@src/models"
import { Router } from "express"

const router = Router()

router.get('/', async (req, res) => {
  res.send({
    members: await MemberModel.find().populate('favouriteBook'),
    decodedJWT: req.decodedJWT
  })
})

export default router
