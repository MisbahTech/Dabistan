import { Router } from 'express'
import { usersRouter } from './users.routes.js'
import { authRouter } from './auth.routes.js'
import { mostReadRouter } from './mostRead.routes.js'
import { articlesRouter } from './articles.routes.js'
import { booksRouter } from './books.routes.js'
import { sectionsRouter } from './sections.routes.js'
import { categoriesRouter } from './categories.routes.js'
import { postsRouter } from './posts.routes.js'
import { newsRouter } from './news.routes.js'
import { weatherRouter } from './weather.routes.js'
import { exchangeRatesRouter } from './exchangeRates.routes.js'
import { linksRouter } from './links.routes.js'
import { mediaRouter } from './media.routes.js'
import { navRouter } from './nav.routes.js'
import { contactsRouter } from './contacts.routes.js'
import { contentRouter } from './content.routes.js'
import { uploadsRouter } from './uploads.routes.js'
import { publicRouter } from './public.routes.js'
import { videosRouter } from './videos.routes.js'
import { rolesRouter } from './roles.routes.js'
import { permissionsRouter } from './permissions.routes.js'

export const apiRouter = Router()

apiRouter.use('/public', publicRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/roles', rolesRouter)
apiRouter.use('/permissions', permissionsRouter)
apiRouter.use('/posts', postsRouter)
apiRouter.use('/uploads', uploadsRouter)
apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/videos', videosRouter)
apiRouter.use('/most-read', mostReadRouter)
apiRouter.use('/weather', weatherRouter)
apiRouter.use('/exchange-rates', exchangeRatesRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/books', booksRouter)
apiRouter.use('/sections', sectionsRouter)
apiRouter.use('/news', newsRouter)
apiRouter.use('/links', linksRouter)
apiRouter.use('/media', mediaRouter)
apiRouter.use('/nav', navRouter)
apiRouter.use('/contacts', contactsRouter)
apiRouter.use('/content', contentRouter)
