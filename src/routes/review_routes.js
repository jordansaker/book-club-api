import { Router } from "express"
import { ReviewModel } from "@src/models"

const reviewRouter = Router()

reviewRouter.get('/', async (req, res) => {
    const reviews = await ReviewModel.find()
    reviews ? res.send(reviews) : res.status(404).send({ error: "No reviews found"})
})

export default reviewRouter