var List = require('../../model/list.js');

module.exports = {
	os: function(req, res) {

		res.json({ message: JSON.stringify(req.body)});
	},
}