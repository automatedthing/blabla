var express = require('express');
var app = express();
var instagram = require('./source/instagram')

function setup(){
  instagram.login()
}

function server() {    
    app.get('/instagram/followers/:user', function(req, res) {
        instagram.GetFollow(req, res, 'followers')
    })
    app.get('/instagram/following/:user', function(req, res) {
        instagram.GetFollow(req, res, 'following')
    })
    app.get('/instagram/profile/:user', function(req, res) {
        instagram.profile(req,res)
    })
    app.listen(3000)
}
if (process.argv[2] == 'setup') {
    setup()
} else {
    server()
}
