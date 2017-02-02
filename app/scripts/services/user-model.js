
angular.module('docman.user-model', [])

.service('Users', function($q, Loading) {

  var usersRef = firebase.database().ref('/users');

  this.setUser = function(info) {

    var userRef;
    if (info.id) {
      userRef = usersRef.child(info.id);
    } else {
      userRef = usersRef.push();
    }

    var user = {
      username: info.username.trim(),
      email: info.email.trim(),
      password: info.password,
      address1: info.address1 || '',
      address2: info.address2 || '',
      contact_number: info.contact_number || '',
      contact_person: info.contact_person || '',
    };

    var promise = userRef.set(user).then(function() {
      user.id = userRef.key;
      return $q.resolve(user);
    });

    return Loading.progress(promise);

  }

  this.getUserById = function(id) {

    var promise = usersRef.child(id)
      .once('value').then(function(snapshot) {
        var user = _getUserInfo(snapshot);
        return $q.resolve(user);
      });

    return Loading.progress(promise); 

  }

  this.getUserByName = function(username) {

    var promise = usersRef
      .orderByChild('username').equalTo(username)
      .once('value').then(function(snapshot) {
        var user;
        snapshot.forEach(function(data) {
          user = _getUserInfo(data);
        });
        return $q.resolve(user);
      });

    return Loading.progress(promise); 

  }

  this.getUserByNameAndPass = function(username, password) {

    var promise = usersRef
      .orderByChild('username').equalTo(username)
      .once('value').then(function(snapshot) {
        var user;
        snapshot.forEach(function(data) {
          var tempuser = _getUserInfo(data);
          if (tempuser.password == password) {
            user = tempuser;
          }
        });
        return $q.resolve(user);
      });

    return Loading.progress(promise); 

  }

  function _getUserInfo(snapshot) {
    var key = snapshot.key;
    var user = snapshot.val();
    user.id = key;
    return user;
  }

})

