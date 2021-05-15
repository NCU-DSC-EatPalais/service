var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){	
	let type = req.session.TYPE;
	if( type == undefined ){
		res.render('index', { e: req.query.e || undefined });
	}else if( type == 'shop'){
		res.render("shop-home", { uid: req.session.uid, name: req.session.name });
	}else if( type == 'guest'){
		res.database.query( `SELECT id, name, address FROM DSC.users ORDER BY RAND() LIMIT 0, 10`, ( e, r, f )=>{
			console.log( r );
			res.render( "guest-home", { uid: req.session.uid, name: req.session.name, list:r } );
		} );
	}
});

module.exports = router;
