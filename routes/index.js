var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){	
	console.log( req.session.uid );
	let type = req.session.TYPE;
	if( type == undefined ){
		res.render('index', { e: req.query.e || undefined });
	}else if( type == 'shop'){
		res.render("shop-home", { name: req.session.name });
	}else if( type == 'guest'){
		res.render( "guest-home", { name: req.session.name } );
	}
});

module.exports = router;
