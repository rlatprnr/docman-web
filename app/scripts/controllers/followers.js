'use strict';

/**
 * @ngdoc function
 * @name docmanWebApp.controller:FollowersCtrl
 * @description
 * # FollowersCtrl
 * Controller of the docmanWebApp
 */
angular.module('docman.followers', [])
  .controller('FollowersCtrl', function ($scope, $uibModal, Auth, Followers, Follower) {

    Followers.getAll().then(function(followers){
      $scope.followers = followers;
    });

    $scope.checkFollowers = function() {
      $scope.followers.forEach(function(follower){
        follower.checked = $scope.checkedAll;
      })
    }

    $scope.openPopup = function (size) {

      // show popup
      var modalInstance = $uibModal.open({
        templateUrl: 'invite-dialog.html',
        controller: 'InviteCtrl',
        resolve: {
          ui: function () {
            return $scope.ui;
          }
        }
      });

      // result
      modalInstance.result.then(function (emails) {
        
        if (emails.length == 0) return;

        emails.forEach(function(email){
          var follower = new Follower({email:email});
          follower.save().then(function(){
            for(var key in $scope.followers) {
              if ($scope.followers[key].email == email) return;
            }
            $scope.followers.push(follower);
          });
        });      

      });
      
    };
    
  })

  .controller('InviteCtrl', function ($scope, $uibModalInstance, ui) {

    $scope.ui = ui;

    $scope.ok = function () {

      var str = $scope.emails;
      str = str.replace(/[ \n;,]+/g, ' ');
      var arr = str.split(' ');
      var emails = [];
      for(var key in arr) {
        var email = arr[key];
        if (validateEmail(email)) {
          emails.push(email);
        }        
      }
      
      $uibModalInstance.close(emails);
    };

    function validateEmail(email) {
      //var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      var reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/
      if (reg.test(email)) {
        return true;
      } else {
        return false;
      }
    }

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

 ;
