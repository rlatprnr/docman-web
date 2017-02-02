
angular.module('docman.loading', [])

.service('Loading', function($loading){

  var self = this;
  var counter = 0;

  this.show = function() {
    if (counter == 0) {
      $loading.start('loading');
    }
    counter++;
  }

  this.hide = function() {
    counter--;
    if (counter == 0) {
      $loading.finish('loading');
    }
  }

  this.progress = function(promise) {
    self.show();
    return promise.then(function(){
      self.hide();
      return promise;
    }).catch(function(error){
      self.hide();
      console.log(error);
      return promise;
    });
  }

})

.service('Config', function(){

  this.base_url = '';
  this.email_gateway = '';

})
