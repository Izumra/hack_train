import loginP from './loginP.js'
import listP from './listP.js'
import cardP from './cardP.js'
import catdP from './catdP.js'
import documentsP from './documentsP.js'
import eventsP from './eventsP.js'
import groupP from './groupP.js'
import generateReportP from './generate-reportP.js'
import loginAPI from './api/login.js'
import cardAPI from './api/card.js'

const setRoutes = (app) => {
	app.use('/', loginP)
	app.use('/list', listP)
	app.use('/card', cardP)
	app.use('/catd', catdP)
	app.use('/documents', documentsP)
	app.use('/events', eventsP)
	app.use('/groups', groupP)
	app.use('/generate-report', generateReportP)
	app.get('*', (req, res) => res.render('404'))
	app.use('/api/login', loginAPI)
	app.use('/api/card', cardAPI)
}

export { setRoutes }