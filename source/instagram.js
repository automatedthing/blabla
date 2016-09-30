var Nightmare = require('nightmare');
var request = require('request');

module.exports = {
    login: function() {
        var nightmare = Nightmare({
            show: false
        })
        nightmare
            .goto('http://instagram.com')
            .inject('js', 'jquery.js')
            .wait('#react-root > section > main > article > div > div:nth-child(2) > p > a')
            .click('#react-root > section > main > article > div > div:nth-child(2) > p > a')
            .wait('[name=username]')
            .type('[name=username]', 'indo.pictures')
            .type('[name=password]', 'Cipc0pmimiig')
            .click('form button')
            .wait('.coreSpriteSearchIcon')
            .then(function() {
                nightmare.end()
            })
            .end()
    },
    profile: function(req, res) {
        var self = this
        var nightmare = Nightmare({
            show: true
        })
        var running = true
        var result = {}

        function doCollectData() {
            nightmare
                .evaluate(function() {
                    function scroll() {
                        var objDiv = document.querySelector('body')
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }
                    var target = jQuery('#react-root > section > main > article > header > div > ul > li:nth-child(1) > span > span').text()
                    target = parseInt(target)
                    if (target > 150) {
                        target = 150
                    }

                    function down() {
                        $('title').html(jQuery('main article>div a').length + 'of' + target)
                        if (jQuery('main article>div a').length < target) {
                            setTimeout(function() {
                                scroll()
                                down()
                            }, 1000)
                        } else {
                            jQuery('body').append('<donepost>donepost</donepost>')
                            $('title').html(jQuery('main article>div a').length + 'of' + target + ' - DONE')
                        }
                    }
                    down();
                })
        }

        function waitCollectData() {
            if (running)
                nightmare
                .evaluate(function() {
                    return $('donepost').length > 0
                })
                .then(function(done) {
                    console.log("DONE", done)
                    if (done) {
                        running = false
                        nightmare
                            .evaluate(function() {

                                var data = {}
                                data.total_comments = 0
                                data.total_likes = 0

                                var target = jQuery('#react-root > section > main > article > header > div > ul > li:nth-child(1) > span > span').text()
                                data.total_posts = parseInt(target)
                                if (jQuery('mediax').length > 0)
                                    var media = JSON.parse(jQuery('mediax').text())
                                var items = []
                                for (var n in media) {
                                    for (var nn in media[n]) {
                                        var item = media[n][nn]
                                        var o = {}
                                        o.caption = item.caption
                                        o.comments = item.comments.count
                                        o.img = item.display_src
                                        o.likes = item.likes.count
                                        items.push(o)
                                        data.total_comments = data.total_comments + o.comments
                                        data.total_likes = data.total_likes + o.likes
                                    }
                                }
                                data.items = items
                                return data
                            })
                            .run(
                                function(err, data) {
                                    if (err) return console.log(err);
                                    console.log("DONEX")
                                    result.total_likes = data.total_likes
                                    result.total_comments = data.total_comments
                                    result.posts = data.items
                                    result.total_posts = data.total_posts

                                    res.json(result)
                                }
                            )
                            .end()

                    } else {
                        setTimeout(waitCollectData, 500)
                    }
                })
        }

        nightmare
            .goto('http://instagram.com/' + req.params.user)
            .inject('js', 'jquery.js')
            .on('console', function(type, arg) {
                console.log("LOOOG", type, arg)
            })
            .click('a[href*=max_id]')
            .evaluate(function() {
                var o = {}
                o.title = $('[property*=title]').attr('content')
                o.status = $('[property*=description]').attr('content')
                o.link = $('[rel*=me]').text()
                var body = $('body').html()
                var following = body.split('"follows": {"count": ')
                following = following[1].split('}, "')
                var follower = body.split('"followed_by": {"count": ')
                follower = follower[1].split('}, "')
                o.followers = parseInt(follower[0])
                o.following = parseInt(following[0])
                return o

            })
            .then(function(o) {
                result = o
                waitCollectData()
                doCollectData()
            })
    },
    GetFollow: function(req, res, mode) {
        var nightmare = Nightmare({
            show: false
        })
        var running = true;

        function done() {
            if (running)
                nightmare.evaluate(function() {
                    return $('done').length
                })
                .then(function(x) {
                    if (x > 0) {
                        running = false
                        nightmare
                            .evaluate(function() {
                                $('done').remove();
                                var followData = []
                                var n = 0;
                                jQuery('[role=dialog] ul li').each(function() {
                                    var a = jQuery(this).find('a').eq(1)
                                    if (a.length > 0) {
                                        followData.push(jQuery(this).find('a').eq(1).text())
                                        n++;
                                    }
                                })

                                return followData
                            })
                            .end()
                            .then(function(followData) {
                                console.log('done')
                                res.json(followData)
                            })
                            .catch(function(error) {
                                console.error('Search failed:', error);
                            });
                    } else {
                        setTimeout(done, 10)
                    }
                })
        }
        nightmare
            .goto('http://instagram.com/' + req.params.user)
            .inject('js', 'jquery.js')
            .click('[href*=' + mode + ']')
            .wait('[role=dialog]>div:nth-child(2)>div>div:nth-child(2)')
            .evaluate(function() {
                function scroll() {
                    var objDiv = document.querySelector('[role=dialog]>div:nth-child(2)>div>div:nth-child(2)')
                    objDiv.scrollTop = objDiv.scrollHeight;
                }
                var follow = document.querySelector('[href*=followers] span').getAttribute('title')
                follow = follow.replaceAll(',', '')
                follow = parseInt(follow)
                follow = (follow > 0) ? follow : 0
                var target = 100
                if (follow < 100) {
                    target = follow
                }
                follow = 100000
                var i = 0

                function down(i) {
                    if (jQuery('[role=dialog] ul li').length < target) {
                        setTimeout(function() {
                            $('title').html(jQuery('[role=dialog] ul li').length)
                            scroll()
                            i++
                            down(i)
                        }, 500)
                    } else {
                        $('body').append('<done>done</done>')
                    }
                }
                down(0)

            })
        done()
    }
}
