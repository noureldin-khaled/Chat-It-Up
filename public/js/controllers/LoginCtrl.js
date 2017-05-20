App.controller('LoginCtrl', function(UserSrv, $location) {
    var self = this;

    self.user = {};
    self.submitted = false;
    self.error_msg = null;

    if (UserSrv.getUser()) {
        UserSrv.logout();
    }

    self.login = function() {
        self.submitted = true;
        self.error_msg = null;
        if (self.LoginForm.$valid) {
            UserSrv.login(self.user).then(function(res) {
                UserSrv.setUser(res.data.user);
                $location.url('/');
            }, function(err) {
                console.log(err);
                if (err.status == 500) {
                    self.error_msg = "Opss.. Something went wrong!";
                }
                else if (err.status == 404) {
                    self.error_msg = "Incorrect Username or Password";
                }
                else if (err.status == 403) {
                    self.error_msg = "This account is alread logged in";
                }
                else {
                    var errors = err.data.errors;
                    for (var i = 0; i < errors.length; i++) {
                        var current = errors[i];
                        if (current.msg == 'required') {
                            if (current.param == 'username') {
                                self.LoginForm.username.$setValidity('required', false);
                            }
                            else if (current.param == 'password') {
                                self.LoginForm.password.$setValidity('required', false);
                            }
                            else {
                                self.error_msg = "Opss.. Something went wrong!";
                            }
                        }
                        else {
                            self.error_msg = "Opss.. Something went wrong!";
                        }
                    }
                }
            });
        }
    };

    self.change = function() {
        self.LoginForm.username.$setValidity('taken', true);
    };


    self.register = function() {
        self.submitted = true;
        self.error_msg = null;
        if (self.LoginForm.$valid) {
            self.LoginForm.username.$setValidity('taken', true);
            UserSrv.register(self.user).then(function(res) {
                self.login();
            }, function(err) {
                console.log(err);
                if (err.status == 500) {
                    self.error_msg = "Opss.. Something went wrong!";
                }
                else {
                    var errors = err.data.errors;
                    for (var i = 0; i < errors.length; i++) {
                        var current = errors[i];
                        if (current.msg == 'required') {
                            if (current.param == 'username') {
                                self.LoginForm.username.$setValidity('required', false);
                            }
                            else if (current.param == 'password') {
                                self.LoginForm.password.$setValidity('required', false);
                            }
                            else {
                                self.error_msg = "Opss.. Something went wrong!";
                            }
                        }
                        else if (current.msg == 'unique violation') {
                            if (current.param == 'username') {
                                self.LoginForm.username.$setValidity('taken', false);
                            }
                            else {
                                self.error_msg = "Opss.. Something went wrong!";
                            }
                        }
                        else {
                            self.error_msg = "Opss.. Something went wrong!";
                        }
                    }
                }
            });
        }
    };

    window.onbeforeunload = function () {
        if (UserSrv.getUser()) {
            UserSrv.logoutSync();
        }
    };
});
