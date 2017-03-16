describe('LoginCtrl', function () {

  var controller,
    deferredLogin,
    UserServiceMock ={login:null},
    stateMock,
    DataCacheService,
    $translate,
    InitializeService,
    $ionicLoading,
    ionicPopupMock,
    scope={},
    rscope={};

  var UserServiceMockAll={
    rightCredentials: function (params, callback) {
      callback({token: 'myToken', userId: '123456'});
    },
    wrongCredentials: function (para, callback) {
      callback({status: 'err', message: 'wrong credentials'});
    }
  };

  beforeEach(module('starter'));

  beforeEach(module(function ($provide, $urlRouterProvider) {
    $provide.value('$ionicTemplateCache', function () {
    });
    $urlRouterProvider.deferIntercept();
  }));

  describe('LoginCtrl', function () {

    beforeEach(inject(function ($controller, $q) {
      deferredLogin=$q.defer();

      DataCacheService={
        clearCache: jasmine.createSpy('clearCache')
          .and.returnValue(deferredLogin.promise)
      };

      $ionicLoading={
        show: jasmine.createSpy('show')
          .and.returnValue(deferredLogin.promise),
        hide: jasmine.createSpy('hide')
          .and.returnValue(deferredLogin.promise)
      };

      $translate=function (translation) {
        return {
          then: function (callback) {
            var translated={};
            translation.map(function (transl) {
              translated[transl]=transl;
            });
            return callback(translated);
          }
        }
      };

      jasmine.createSpy('$translate', $translate).and.callThrough();
      stateMock=jasmine.createSpyObj('$state spy', ['go']);
      InitializeService=jasmine.createSpyObj('InitializeService spy', ['initialize']);
      ionicPopupMock=jasmine.createSpyObj('$ionicPopup spy', ['alert']);

      controller=$controller('LoginCtrl', {
          '$scope': scope,
          '$state': stateMock,
          'DataCacheService': DataCacheService,
          '$rootScope': rscope,
          'User': UserServiceMock,
          '$ionicPopup': ionicPopupMock,
          '$translate': $translate,
          '$ionicLoading': $ionicLoading,
          'InitializeService': InitializeService
        }
      );
    }));

    it('should focus the next input if the password not entered ', function () {
      rscope.AAuser.email='damien@gymbirds.com';
      spyOn(scope, "focusPassword").and.callThrough();
      scope.login();

      expect(scope.focusPassword).toHaveBeenCalled();
    });

    it('should not login with wrong credentials ', function () {
      UserServiceMock.login=UserServiceMockAll.wrongCredentials;

      rscope.AAuser.email='damien@gymbirds.com';
      rscope.AAuser.password='qwerty';
      spyOn(scope, "showInvalidCredential").and.callThrough();

      scope.login();

      expect(scope.showInvalidCredential).toHaveBeenCalled();
      expect($ionicLoading.show).toHaveBeenCalled();
      expect($ionicLoading.hide).toHaveBeenCalled();
      expect(ionicPopupMock.alert).toHaveBeenCalledWith({
        title: 'INVALID_CREDENTIALS',
        template: 'TRY_AGAIN'
      });
    });

    it('should login with right credentials', function () {
      UserServiceMock.login=UserServiceMockAll.rightCredentials;

      rscope.AAuser.email='damien@gymbirds.com';
      rscope.AAuser.password='qwerty';

      scope.login();

      expect($ionicLoading.show).toHaveBeenCalled();
      expect($ionicLoading.hide).toHaveBeenCalled();
    });

    it('should go to resetPassword', function () {
      rscope.AAuser.email='damien@gymbirds.com';

      scope.resetPassword();

      expect(stateMock.go).toHaveBeenCalledWith('ForgotPassword');
    });

  });
});






