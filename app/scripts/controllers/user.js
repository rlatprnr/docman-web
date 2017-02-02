'use strict';

/**
 * @ngdoc function
 * @name docmanWebApp.controller:LoginCtrl, RegisterCtrl
 * @description
 * # LoginCtrl, RegisterCtrl
 * Controller of the docmanWebApp
 */
angular.module('docman.user', [])

  .controller('RegisterCtrl', function ($scope, $state, Auth) {

    $scope.form = {};

    $scope.signUp = function() {
      Auth.signUp($scope.form).then(function(){
        localStorage.setItem("docman-remember", false);
        $scope.$parent.$parent.isLogged = true;
        $state.go('main.profile');
      }).catch(function(error){
        $scope.form.error = error;
      });
    };

  })

  .controller('LoginCtrl', function ($scope, $state, Auth) {

    $scope.form = {};

    $scope.signIn = function() {
      Auth.signIn($scope.form.username, $scope.form.password).then(function(){
        localStorage.setItem("docman-remember", $scope.remember);
        if ($scope.remember) {
          localStorage.setItem("docman-user", $scope.form.username);
          localStorage.setItem("docman-pass", $scope.form.password);
        }
        $scope.$parent.$parent.isLogged = true;
        $state.go('main.profile');
      }).catch(function(error){
        $scope.form.error = error;
      });
    };

    $scope.checkEnter = function(event) {
      if (event.keyCode == 13 && $scope.form.username != '') {
        $scope.signIn();
      }
    }

    $scope.remember = localStorage.getItem("docman-remember")=='true';
    if ($scope.remember) {
      $scope.form.username = localStorage.getItem("docman-user") || '';
      $scope.form.password = localStorage.getItem("docman-pass") || '';
    }

    if ($scope.$parent.$parent.first) {
      $scope.$parent.$parent.first = false;
      if ($scope.remember) {
        $scope.signIn();
      }      
    }
        
  })

  .controller('ForgetCtrl', function ($scope, $http, SHA, Loading, Config) {

    $scope.retrievePassword = function() {

      return;
      
      var email = $scope.form.email;

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
    


      var now = new Date();
      var key = email + now.getTime() + Math.random();
      key = SHA(key);

      var url = Config.base_url + '#/verify/' + key;
      var message = 'Hi<br>' +
                    'To change your password, please click on this <a href="'+url+'">link</a>.<br>' +
                    'If you did not request this change, you do not need to do anything.<br>' +
                    'This link will expire in 1 hours.<br>' +
                    'Thanks';

      $http.post(Config.email_gateway, $.param({
        from: '',
        to: email,
        subject: 'Forgotten password request',
        message: message
      })).then(function(result){
        $scope.sent_email = true;    

        var ref = firebase.database().ref('/reset/' + key);
        var promise = ref.set({
          email: $scope.form.email,
          expiring_date: now.getTime() + 60*60,
        });
        return Loading.progress(promise);
      });
    }

  })

  .controller('ProfileCtrl', function ($scope, $q, Auth, DocFile) {

    // get user's information

    Auth.getUser().then(function(user){
      $scope.form = {
        username: user.username,     
        email: user.email,
        password: user.password,
        repassword: user.password,
        address1: user.address1 || '',
        address2: user.address2 || '',
        contact_number: user.contact_number || '',
        contact_person: user.contact_person || '',
        logo: user.logo,
      };

      if (user.logo == undefined) {
        DocFile.download('logo-'+user.id).then(function(url){
          user.logo = url;
          $scope.form.logo = url;          
        });
      }
    }).catch(function(error){
      Auth.signOut();
    })

    $scope.browser = function() {

      $('#logo-file').click();

    }
    
    // save user's information

    $scope.update = function() {

      var file = $('#logo-file')[0].files[0];
      if (file) {
        var uploadfile = "logo-" + Auth.getID();
        DocFile.upload(file, uploadfile).then(function(){
          updateProfile();
        }).catch(function(){
          $scope.form.error = error;
        });          
      } else {
        updateProfile();
      }
            
    };

    function updateProfile() {
      Auth.updateUser($scope.form).catch(function() {
        $scope.form.error = error;
      });
    }

    /*
      change logo file
     */
    $('#logo-file')[0].addEventListener('change', function(evt){
      
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt.target.files[0];
      var img = $('.profile-container .logo')[0];
      img.classList.add("obj");
      img.file = file;

      var reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);

    }, false);

  })

;
