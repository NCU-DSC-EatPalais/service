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
			res.render( "guest-home", { uid: req.session.uid, name: req.session.name, list:r, shop_name:"" } );
		} );
	}
});


router.get('/shop', (req, res)=>{
  let { page, name } = req.query;
  page = page || 0;
  let sql = `SELECT * FROM DSC.users WHERE name LIKE"%${name}%" limit ${page*10}, 10`;
  res.database.query( sql, (e, r, f)=>{
    res.render( 'guest-home', { list: r, shop_name: name, name:(req.session.name || "訪客")} );
  } );
});

router.get('/shop/:id', (req, res)=>{
	let { id } = req.params;
	let sql = `SELECT id, name, contact, intro, address FROM DSC.users WHERE id=${id};`
	res.database.query( sql, (e, r, f)=>{
		console.log( r )
		if(r && r.length > 0){
			res.render( 'shop-info', { data: r[0] } );
		}else{
			res.send("404 not found");
		}
	} );
});

router.get('/shop/:id/calendar', (req, res)=>{
	let { id } = req.params;
	let { m } = req.query;
	res.render( 'shop-calendar', {
		name: req.session.name || "訪客",
		message:m || "",
	} );
});

router.get('/login', (req, res)=>{
	res.redirect("/");
});

router.get("/test", (req, res)=>{
	res.render("gen_qrcode");
})

router.get('/shop/:id/preorder/:year/:month/:day', (req, res)=>{
	let { id, year, month, day } = req.params;
	let schedule = [];
	for(let i = 0 ; i < 24 ; i ++){
		schedule.push( {
			uid: id,
			text: i,
			count: ~~(Math.random()*10),
			link:`/shop/${id}/preorder/${year}/${month}/${day}/${i}`,
		} );
	}
	res.render('preorder', {
		id, year, month, day, schedule, 
		name: req.session.name || "訪客",
	});
});

router.get('/shop/:id/preorder/:year/:month/:day/:hour', (req, res)=>{
	let { id, year, month, day } = req.params;
	res.redirect(`/shop/${id}/calendar/?m=預約成功`)
});

router.get('/quick_pass', (req, res)=>{
	res.render('scan_qrcode');
});

module.exports = router;
