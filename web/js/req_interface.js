var ThermoInterface = function (url) {

    this.

    this.httpInterface = {
        url: url,

        // =============================================
        // Session Functions
        // =============================================

        // POST /login {password}   ->  if ok then {session_id} else HTTP 401
        login: function (password) {
            return fetch(url + "/login", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(password)
            }).then(this.handleHttpError).then(function (data) {
                document.cookie = data.session_id;
            });
        },

        // POST /logout {}
        logout: function () {
            return fetch(url + "/logout", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /set_password {password}
        set_password: function (password) {
            return fetch(url + "/set_password", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(password)
            }).then(this.handleHttpError);
        },

        // GET /login_mode {}
        get_login_mode: function () {
            return fetch(url + "/login_mode", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /login_mode {mode}
        post_login_mode: function (mode) {
            return fetch(url + "/login_mode", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(mode)
            }).then(this.handleHttpError);
        },


        // =============================================
        // Switching Mode
        // =============================================

        // GET /switching_mode {}
        get_switching_mode: function () {
            return fetch(url + "/switching_mode", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /switching_mode {mode}
        post_switching_mode: function (mode) {
            return fetch(url + "/switching_mode", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(mode)
            }).then(this.handleHttpError);
        },

        // GET /auto_days_prog {}
        get_auto_days_prog: function () {
            return fetch(url + "/auto_days_prog", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /auto_days_prog {prog}
        post_auto_days_prog: function (prog) {
            return fetch(url + "/auto_days_prog", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(prog)
            }).then(this.handleHttpError);
        },

        // GET /auto_temp {}
        get_auto_temp: function () {
            return fetch(url + "/auto_temp", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /auto_temp {temp}
        post_auto_temp: function (temp) {
            return fetch(url + "/auto_temp", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(temp)
            }).then(this.handleHttpError);
        },


        // =============================================
        // Diagnostics
        // =============================================

        // GET /temp {}
        temp: function () {
            return fetch(url + "/temp", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // GET /version {}
        version: function () {
            return fetch(url + "/version", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // GET /time {}
        get_time: function () {
            return fetch(url + "/time", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /time {area}
        post_time: function (area) {
            return fetch(url + "/time", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(area)
            }).then(this.handleHttpError);
        },

        // GET /identifier {}
        get_identifier: function () {
            return fetch(url + "/identifier", {
                method: 'get',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(this.handleHttpError);
        },

        // POST /identifier {identifier}
        post_identifier: function (identifier) {
            return fetch(url + "/identifier", {
                method: 'post',
                credentials: 'include',
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: JSON.stringify(identifier)
            }).then(this.handleHttpError);
        },

        handleHttpError: function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else if (response.status == 401) {
                return Promise.reject(new Error("Password errata"));
            } else if (response.status == 403) {
                return Promise.reject(new Error("Login non effettuato"));
            } else {
                return Promise.reject(new Error("Errore: " + response.statusText));
            }
        }
    };
};
