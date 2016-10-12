var Nightmare = require('nightmare');
var request = require('request');
const realMouse = require('nightmare-real-mouse');
realMouse(Nightmare);

module.exports = {
    login: function() {
        var nightmare = Nightmare({
            show: true
        })
        nightmare
            .goto('https://www.linkedin.com/uas/login')
            .type('#session_key-login', 'luklukaha@gmail.com')
            .type('#session_password-login', 'p123123p')
            .realClick('#btn-primary')
            .wait('.account-toggle')
            .end()
            .run(function(err) {
                console.log('success')
                if (err) console.log(err)
            })
    },
    profile:function(req,res){
      var nightmare = Nightmare({
          show: true
      })
      nightmare
      .goto('https://www.linkedin.com/in/'+req.params.user)
      .inject('js', 'jquery.js')
      .evaluate(function() {
        var data = {}
        data.name = jQuery('.full-name').text()
        data.summary = jQuery('#summary-item').html()
        data.experiences = []
        data.educations = []
        jQuery('#background-experience .section-item').each(function(){
          var o = {}
          o.position = jQuery(this).find('h4').text()
          o.company = jQuery(this).find('h5').text()
          jQuery(this).find('.locality').first().remove()
          o.startdate = jQuery(this).find('.experience-date-locale time').first().text()
          jQuery(this).find('.experience-date-locale time').first().remove()
          o.enddate = (jQuery(this).find('.experience-date-locale').text()+'').replace('–','')
          o.description = jQuery(this).find('.description').text()
          data.experiences.push(o)
        })
        jQuery('#background-education-container .section-item').each(function(){
          var o = {}
          o.university = jQuery(this).find('h4').text()
          o.degree = jQuery(this).find('h5').text()
          jQuery(this).find('.locality').first().remove()
          o.startdate = jQuery(this).find('.education-date time').first().text()
          jQuery(this).find('.education-date time').first().remove()
          o.enddate = (jQuery(this).find('.education-date time').text()+'').replace('–','')
          o.notes = jQuery(this).find('.notes').text()
          data.educations.push(o)
        })
        return data
      })
      .end()
      .then(function(data){
        res.json(data)
      })
    }
  }
