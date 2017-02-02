'use strict';

angular.module('docman.doc-model', [])

.service('Docs', function($q, Doc, Loading) {

  this.getAll = function(fid) {

    var promise = firebase.database().ref('/docs')
      .orderByChild('fid').equalTo(fid)
      .once('value').then(function(snapshot) {
        var docs = [];
        snapshot.forEach(function(data) {
          var info = data.val();
          info.id = data.key;
          info.date = new Date(info.date);
          docs.push(new Doc(info));
        });
        docs = _.orderBy(docs, ['date', 'mq'], ['desc', 'asc']);
        return $q.resolve(docs);
      });

    return Loading.progress(promise); 

  }

})


.factory('Doc', function(Auth, Loading) {

  function Doc (info) {
    this.id = (info && info.id) || null;
    this.uid = (info && info.uid) || Auth.getID();
    this.fid = (info && info.fid) || null;

    this.filename = (info && info.filename) || 'noname';
    this.uploadname = info.uploadname;
    this.date = (info && info.date) || (new Date());
    this.mq = (info && info.mq) || 'm';
    this.publish = (info && info.publish) || 'y';
    
    var options = { year: '2-digit', month: 'short' };
    this.date_label = this.date.toLocaleDateString("en-US", options);
  }

  Doc.prototype.save = function() {

    var ref = firebase.database().ref('/docs');

    if (this.id) {
      ref = ref.child(this.id);
    } else {
      ref = ref.push();
      this.id = ref.key;
    }
    
    var promise = ref.set({
      uid: this.uid,
      fid: this.fid,
      filename: this.filename,
      uploadname: this.uploadname,
      date: this.date.getTime(),
      mq: this.mq,
      publish: this.publish,
    });

    return Loading.progress(promise);
  }

  Doc.prototype.remove = function() {
    var promise = firebase.database().ref('/docs/' + this.id).remove();
    return Loading.progress(promise);
  }

  return Doc;

})


.service('DocFile', function($q, Auth, Loading) {

  var storageRef = firebase.storage().ref();

  this.upload = function(file, uploadname) {
    var promise;
    if (file) {
      uploadname = uploadname || Auth.getID() + new Date().getTime() + file.name;
      var uploadTask = storageRef.child(uploadname).put(file, {contentType: file.type});
      promise = $q(function(resolve, reject){
        uploadTask.on('state_changed', null, function(error) {
          reject(error);
        }, function() { 
          resolve(uploadname);
        });
      })
    } else {
      promise =  $q.reject('error');
    }
      
    return Loading.progress(promise);
  }

  this.download = function(filename) {
    var fileReference = storageRef.child(filename);
    var promise = fileReference.getDownloadURL();
    return Loading.progress(promise);
  }

})
