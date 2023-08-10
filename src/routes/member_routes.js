import { MemberModel } from "@src/models"
import { Router } from "express"

const router = Router()

router.get('/', async (req, res) => {
  res.send(await MemberModel.find())
})

export default router
