
angular.module('docman.fund-model', [])

.service('Funds', function($q, Auth, Fund, Loading) {

  this.getAll = function(uid) {

    uid = uid || Auth.getID();

    var promise = firebase.database().ref('/funds')
      .orderByChild('uid').equalTo(uid)
      .once('value').then(function(snapshot) {
        var funds = [];
        snapshot.forEach(function(data) {
          var info = data.val();
          info.id = data.key;
          info.inception_date = new Date(info.inception_date);
          info.performance_date = new Date(info.performance_date);
          funds.push(new Fund(info));
        });
        return $q.resolve(funds);
      });

    return Loading.progress(promise); 

  }

})


.factory('Fund', function(Auth, Loading) {

  function Fund(info) {

    this.id = (info && info.id) || null;
    this.uid = (info && info.uid) || Auth.getID();

    this.full_name = (info && info.full_name) || 'Arowana Asian Fund Limited';
    this.manager = (info && info.manager) || 'Arowana Asset Management Ltd';
    this.advisor = (info && info.advisor) || 'N/A';
    this.fund_strategy = (info && info.fund_strategy) || 'Fund of Funds Asia with China Bias';
    this.regulatory_registrations = (info && info.regulatory_registrations) || 'SFC Type 4 and Type 9';
    this.portpolio_manager = (info && info.portpolio_manager) || 'Pierre Hoebrechts';
    this.biography = (info && info.biography) || 'Biography';
    this.coo = (info && info.coo) || 'Russell Davidson';
    this.inception_date = (info && info.inception_date) || (new Date());
    this.aum = (info && info.aum) || '40m';
    this.firm_aum = (info && info.firm_aum) || '40m';
    this.administrator = (info && info.administrator) || 'Harmonic';
    this.auditor = (info && info.auditor) || 'KPMG';
    this.prime_broker = (info && info.prime_broker) || 'N/A';
    this.onshore_legal_counsel = (info && info.onshore_legal_counsel) || 'Simmons & Simmons';
    this.offshore_legal_counsel = (info && info.offshore_legal_counsel) || 'Walkers';
    this.subscriptions = (info && info.subscriptions) || 'Monthly';
    this.redemption = (info && info.redemption) || 'Monthly';
    this.notice_period = (info && info.notice_period) || '60 days';
    this.lock_up = (info && info.lock_up) || 'None';
    this.penalty_fee = (info && info.penalty_fee) || '2% within 12 months'
    this.fund_level = (info && info.fund_level) || 'None';
    this.investor_level = (info && info.investor_level) || 'None';
    this.minimum = (info && info.minimum) || '1000,000';
    this.management_pee = (info && info.management_pee) || '0.75%';
    this.performance_fee = (info && info.performance_fee) || '10%';
    this.hurdle_rate = (info && info.hurdle_rate) || '5%';
    this.loss_carry_forward = (info && info.loss_carry_forward) || 'Yes';
    this.high_water_mark = (info && info.high_water_mark) || 'Yes';
    this.bloomberg_ticker = (info && info.bloomberg_ticker) || '';
    this.performance_date = (info && info.performance_date) || (new Date());
    this.mtd = (info && info.mtd) || '0%';
    this.ytd = (info && info.ytd) || '0%';
    this.avg = (info && info.avg) || '0%';
    this.strategy = (info && info.strategy) || 'strategy...';

    this.docs = [];
  }

  Fund.prototype.save = function() {

    var ref = firebase.database().ref('/funds');

    if (this.id) {
      ref = ref.child(this.id);
    } else {
      ref = ref.push();
      this.id = ref.key;
    }

    var promise = ref.set({
      uid: this.uid,
      full_name: this.full_name,
      manager: this.manager,
      advisor: this.advisor,
      fund_strategy: this.fund_strategy,
      regulatory_registrations: this.regulatory_registrations,
      portpolio_manager: this.portpolio_manager,
      coo: this.coo,
      biography: this.biography,
      inception_date: this.inception_date.getTime(),
      aum: this.aum,
      firm_aum: this.firm_aum,
      administrator: this.administrator,
      auditor: this.auditor,
      prime_broker: this.prime_broker,
      onshore_legal_counsel: this.onshore_legal_counsel,
      offshore_legal_counsel: this.offshore_legal_counsel,
      subscriptions: this.subscriptions,
      redemption: this.redemption,
      notice_period: this.notice_period,
      lock_up: this.lock_up,
      penalty_fee: this.penalty_fee,
      fund_level: this.fund_level,
      investor_level: this.investor_level,
      minimum: this.minimum,
      management_pee: this.management_pee,
      performance_fee: this.performance_fee,
      hurdle_rate: this.hurdle_rate,
      loss_carry_forward: this.loss_carry_forward,
      high_water_mark: this.high_water_mark,
      bloomberg_ticker: this.bloomberg_ticker,
      performance_date: this.performance_date.getTime(),
      mtd: this.mtd,
      ytd: this.ytd,
      avg: this.avg,
      strategy: this.strategy,
    });

    return Loading.progress(promise);
  }

  Fund.prototype.remove = function() {
    this.docs.forEach(function(doc){
      doc.remove();
    });
    var promise = firebase.database().ref('/funds/' + this.id).remove();
    return Loading.progress(promise);
  }

  return Fund;

})
