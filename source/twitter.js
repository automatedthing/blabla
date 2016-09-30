var Twit = require("twit")
var T = new Twit({
  consumer_key:         '86xj1gvU9z508IZt1iIA',
  consumer_secret:      'G1VZxlTnU6un2z69TogOfjn57rtOReBEUhyGN1Q',
  access_token:         '47299432-9nWe0EbW4x536VeO8opdASMiWPaKwG2CHEkUZMDgI',
  access_token_secret:  'dr8aNNEl3nb3SlClEr8DJ6DBAE9qjre2Zi0DkuqgpFIRX',
  timeout_ms:           60*1000,
})
module.exports = {
  profile : function(req,res){
    T.get('users/show', { screen_name: 'benakribo'},  function (err, data, response) {
      var profile = {}
      profile.followers = data.followers_count
      profile.following = data.friends_count
    })
  }
}
// T.get('followers/list', { screen_name: 'benakribo',count:100,skip_status:true,include_user_entities:false },  function (err, data, response) {
//   console.log(data)
// })
