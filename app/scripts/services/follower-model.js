'use strict';

angular.module('docman.follower-model', [])

.service('Followers', function($q, Auth, Follower, Loading) {

	/**
   * get all followers
   * @param  uid
   * @return promise
   */
  this.getAll = function(uid) {

    uid = uid || Auth.getID();

    var promise = firebase.database().ref('/followers')
      .orderByChild('uid').equalTo(uid)
      .once('value').then(function(snapshot) {
        var followers = [];
        snapshot.forEach(function(data) {

          var info = data.val();
          info.uid = uid;
          info.date = new Date(info.date);
          followers.push(new Follower(info));
        });
        return $q.resolve(followers);
      });

    return Loading.progress(promise); 

  }

})

.factory('Follower', function(Auth, Loading) {

  function Follower (info) {
    this.id = (info && info.id) || null;
    this.uid = (info && info.uid) || Auth.getID();
    this.email = (info && info.email) || '';
    this.active = (info && info.active) || 0;
    this.activities = (info && info.activities) || 0;
    this.date = (info && info.date) || (new Date());

    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    this.date_label = this.date.toLocaleDateString("en-US", options);
  }

  Follower.prototype.save = function() {

    var ref = firebase.database().ref('/followers');

    if (this.id) {
      ref = ref.child(this.id);
    } else {
      ref = ref.push();
      this.id = ref.key;
    }

    var promise = ref.set({
      uid: this.uid,
      email: this.email,
      active: this.active,
      activities: this.activities,
      date: this.date.getTime(),
    });

    return Loading.progress(promise);
  }

  return Follower;

})
