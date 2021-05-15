var express = require('express');
const session = require('express-session');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  res.end( res.database==null  ? 'failed' : 'success' );
});

router.post("/login", (req, res)=>{
  let { ACC, PWD, TYPE } = req.body;
  let table = { shop: "users", guest: "guests" }[TYPE];
  let sql = `SELECT * FROM DSC.${table} WHERE account="${(ACC)}" AND password=md5("${(PWD)}")`;
  console.log( sql )
  res.database.query( sql, (err, r, fields) => {
    if( r.length > 0 ){
      req.session.uid = r[0]['id'];
      req.session.name = r[0]['name'];
      req.session.TYPE = TYPE;
      res.redirect('/');
    }else{
      req.session.uid = null;
      res.redirect("/?e=1")
    }
  } );

});

router.get('/', (req, res)=>{
  let { name } = req.query;
  let sql = `SELECT * FROM DSC.users WHERE name="${ name }"`;

  res.database.query( sql, (e, r, f)=>{
    
  } );
});

router.get('/logout/', (req, res)=>{
  req.session.destroy(()=>{
    res.redirect("/");
  });
});


// login required api: ↓

router.all("*", (req, res, next)=>{
  if( !(req.session.uid) ){
    // console.log("Other need login action");
    res.redirect("/?e=0");
  }else{
    next();
  }
});

router.get('/dorm/sheet', (req, res)=>{
  res.json([ {sheet_id:1, time:"2021-05-12 16:46:32", dorm:"G14", location:"空間", reporter:"Fucking hell", formid:1} ]);
});



module.exports = router;
