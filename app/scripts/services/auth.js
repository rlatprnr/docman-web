
angular.module('docman.auth', [])

.service('Auth', function($q, $injector, $window, Users, Loading) {

  var _self = this;
  var _currentUser = null;
  
  this.signUp = function(info) {

    var promise = Users.getUserByName(info.username).then(function(user) {
      if (user) {
        return $q.reject('Someone already has this username.');
      }

      var newUser = {
        username: info.username.trim(),
        email: info.email.trim(),
        password: info.password,
        address1: info.address1 || '',
        address2: info.address2 || '',
        contact_number: info.contact_number || '',
        contact_person: info.contact_person || '',
      };

      return Users.setUser(newUser).then(function(user) {
        _setUser(user);
        return $q.resolve(user);
      });
    });

    return Loading.progress(promise);
  }


  this.signIn = function(username, password) {

    var promise = Users.getUserByNameAndPass(username, password).then(function(user) {
      if (!user) {
        return $q.reject('That username or password is incorrect.');
      }
      _setUser(user);
      return $q.resolve(user);
    });

    return Loading.progress(promise);
  }


  this.signOut = function() {
    _setUser();
    $injector.get('$state').go('login.signin');
  }

  // ------------ user information --------------


  function _setUser(user) {
    _currentUser = user;
    if (user) {
      $window.localStorage.setItem('user-id', user.id);
    } else {
      $window.localStorage.removeItem('user-id');
    }
  }


  this.getID = function() {
    return window.localStorage.getItem('user-id');
  }

  this.getUser = function() {

    var id = _self.getID();
    var promise;
    if (!id) {
      promise = $q.reject('');
    } else if (_currentUser) {
      promise = $q.resolve(_currentUser);
    } else {
      promise = Users.getUserById(id).then(function(user){
        _currentUser = user;
        return $q.resolve(_currentUser);
      });
    }
    
    return Loading.progress(promise);

  }


  this.updateUser = function(info) {

    info.id = _self.getID();
    var promise = Users.setUser(info).then(function(user) {
      _setUser(user);
      return $q.resolve(user);
    });

    return Loading.progress(promise);
  }

})
