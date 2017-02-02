'use strict';

angular.module('docman.funds', [])

  .controller('FundsCtrl', function ($scope, $timeout, $location, $anchorScroll, Funds, Fund, Docs, Doc, DocFile) {

    // new fund
  	$scope.newFund = function() {
      var fund = new Fund();
      fund.save().then(function() {
        $scope.funds.push(fund);
        $scope.selectFund(fund);
      });
    };

    // select fund
    $scope.selectFund = function(fund) {
      $scope.form = fund;
      $('#datepicker1').datepicker( "setDate", $scope.form.inception_date);
      $('#datepicker2').datepicker( "setDate", $scope.form.performance_date);

      $scope.filename = '';
      $scope.mq = 'm';
      $('#datepicker3').datepicker( "setDate", new Date());
      Docs.getAll($scope.form.id).then(function(docs){
        $scope.form.docs = docs;
      });
    }

    $scope.saveFund = function() {
      $scope.form.inception_date = $('#datepicker1').datepicker( "getDate" );
      $scope.form.performance_date = $('#datepicker2').datepicker( "getDate" );
      $scope.form.save();
    }

    // publish
    $scope.publish_new = function() {
      var fileObj = $('#new-document input')[0];
      var file = fileObj.files[0];
      DocFile.upload(file).then(function(uploadname){

        var date = $('#datepicker3').datepicker( "getDate" );
        var doc = new Doc({
          fid: $scope.form.id,
          filename: file.name,
          uploadname: uploadname,
          date: date,
          mq: $scope.mq,
        });

        doc.save().then(function(){
          $scope.form.docs.push(doc);
          $scope.form.docs = _.orderBy($scope.form.docs, ['date', 'mq'], ['desc', 'asc']);
          $scope.filename = '';
          $(fileObj).val('');
        });

      });
    }

    $scope.changeDocState = function(doc) {
      doc.publish = doc.publish=='y' ? 'n':'y';
      doc.save();
    }

    $scope.removeFund = function() {
      $scope.form.remove().then(function(){
        var index = $scope.funds.indexOf($scope.form);
        $scope.funds.splice(index, 1);

        $scope.form = null;
        if ($scope.funds.length) {
          $scope.selectFund($scope.funds[0]);
        }
      });
    }

    // add document file
    $('#new-document input')[0].addEventListener('change', function(evt){
      evt.stopPropagation();
      evt.preventDefault();

      var file = evt.target.files[0];

      $timeout(function(){
        $scope.filename = file.name;  
      });      
    }, false);

    // ui functions
    $scope.gotoNewDocument = function() {
      $location.hash('new-document');
      $anchorScroll();
    };

    $('#datepicker1,#datepicker2').datepicker({
      dateFormat: "dd.mm.yy",
    });
    $( "#datepicker3" ).datepicker({
      showOn: "button",
      buttonImage: "images/calendar.png",
      buttonImageOnly: true,
      altField: "#datepicker3-label",
      altFormat: "M y",
      changeMonth: true,
      changeYear: true
    });
    
    // get all funds
    Funds.getAll().then(function(funds) {
      $scope.funds = funds;
      if (funds.length) {
        $scope.selectFund(funds[0]);
      }
    });

  })
