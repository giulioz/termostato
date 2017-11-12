var ThermoInterface = {

    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    
    // =============================================
    // Session Functions
    // =============================================

    // POST /login {password}   ->  if ok then {session_id} else HTTP 401
    login: function (password) {
        return fetch(config.url + "/login", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(password)
        }).then(this.handleHttpError).then(function (data) {
            document.cookie = data.session_id;
        });
    },

    // POST /logout {}
    logout: function () {
        return fetch(config.url + "/logout", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /set_password {password}
    set_password: function (password) {
        return fetch(config.url + "/set_password", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(password)
        }).then(this.handleHttpError);
    },

    // GET /login_mode {}
    get_login_mode: function () {
        return fetch(config.url + "/login_mode", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /login_mode {mode}
    post_login_mode: function (mode) {
        return fetch(config.url + "/login_mode", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(mode)
        }).then(this.handleHttpError);
    },


    // =============================================
    // Switching Mode
    // =============================================

    // GET /switching_mode {}
    get_switching_mode: function () {
        return fetch(config.url + "/switching_mode", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /switching_mode {mode}
    post_switching_mode: function (mode) {
        return fetch(config.url + "/switching_mode", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(mode)
        }).then(this.handleHttpError);
    },

    // GET /auto_prog {}
    get_auto_prog: function () {
        return fetch(config.url + "/auto_prog", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /auto_prog {prog}
    post_auto_prog: function (prog) {
        return fetch(config.url + "/auto_prog", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(prog)
        }).then(this.handleHttpError);
    },


    // =============================================
    // Diagnostics
    // =============================================

    // GET /temp {}
    temp: function () {
        return fetch(config.url + "/temp", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // GET /version {}
    version: function () {
        return fetch(config.url + "/version", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // GET /time {}
    get_time: function () {
        return fetch(config.url + "/time", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /time {area}
    post_time: function (area) {
        return fetch(config.url + "/time", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(area)
        }).then(this.handleHttpError);
    },

    // GET /identifier {}
    get_identifier: function () {
        return fetch(config.url + "/identifier", {
            method: 'get',
            credentials: 'include', mode: 'cors',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /identifier {identifier}
    post_identifier: function (identifier) {
        return fetch(config.url + "/identifier", {
            method: 'post',
            credentials: 'include', mode: 'cors',
            headers: this.headers,
            body: JSON.stringify(identifier)
        }).then(this.handleHttpError);
    },

    handleHttpError: function (response) {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else if (response.status == 401) {
            return Promise.reject(new Error(locale.error_wrongPassword));
        } else if (response.status == 403) {
            return Promise.reject(new Error(locale.error_noLogin));
        } else {
            return Promise.reject(new Error(locale.error + response.statusText));
        }
    }
};
