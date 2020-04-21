import { NotFoundError } from 'restify-errors'
import * as restify from 'restify'
import { ModelRouter } from "../common/model-router"
import { Review } from './reviews.model'

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {

        super(Review)

    }

    //TRANSFORMAR OS OBJECTS ID EM ENTIDADES - 
    findById = (req, res, next) => {

        this.model.findById(req.params.id)
                  .populate('user', 'name')
                  .populate('restaurant', 'name')
                  .then(this.render(res, next))
                  .catch(next)

    }

    applyRoutes(application: restify.Server) {
        
        application.get('/reviews', this.findAll)

        application.get('/reviews/:id', [this.validateId, this.findById])

        application.post('/reviews', this.save)

        application.del('/reviews/:id', [this.validateId, this.delete])

    }

}

export const reviewsRouter = new ReviewsRouter()