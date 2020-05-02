import { NotFoundError } from 'restify-errors'
import * as restify from 'restify'
import { ModelRouter } from "../common/model-router"
import { Review } from './reviews.model'
import { authorize } from '../security/authz.handler'

class ReviewsRouter extends ModelRouter<Review> {

    constructor() {

        super(Review)

    }

    envelope(document) {

        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant 

        let resource = super.envelope(document)
            resource._links.restaurant = `restaurants/${restId}`
        
        return resource
  
     }
  

    //TRANSFORMAR OS OBJECTS ID EM ENTIDADES - SOBRESCREVER OS MÉTODOS COMO ABAIXO
    findById = (req, res, next) => {

        this.model.findById(req.params.id)
                  .populate('user', 'name')
                  .populate('restaurant', 'name')
                  .then(this.render(res, next))
                  .catch(next)

    }

    applyRoutes(application: restify.Server) {
        
        application.get(`${this.basePath}`, this.findAll)

        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])

        application.post(`${this.basePath}`, [authorize('user'), this.save])

        application.del(`${this.basePath}/:id`, [this.validateId, this.delete])

    }

}

export const reviewsRouter = new ReviewsRouter()