import { Router } from 'express'
import { authRouter } from './auth.routes.js'
import { usersRouter } from './users.routes.js'
import { postsRouter } from './posts.routes.js'
import { uploadsRouter } from './uploads.routes.js'
import { categoriesRouter } from './categories.routes.js'
import { videosRouter } from './videos.routes.js'
import { mostReadRouter } from './mostRead.routes.js'
import { weatherRouter } from './weather.routes.js'
import { exchangeRatesRouter } from './exchangeRates.routes.js'
import { publicRouter } from './public.routes.js'

export const apiRouter = Router()

apiRouter.use('/public', publicRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/posts', postsRouter)
apiRouter.use('/uploads', uploadsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/videos', videosRouter)
apiRouter.use('/most-read', mostReadRouter)
apiRouter.use('/weather', weatherRouter)
apiRouter.use('/exchange-rates', exchangeRatesRouter)
