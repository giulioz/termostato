var ThermoInterface = {

    headers: {
        "Content-type": "text/plain",
        "Authorization": "Basic YWRtaW46YWRtaW4="
    },

    // =============================================
    // Switching Mode
    // =============================================

    // GET /switching_mode {}
    get_switching_mode: function () {
        return fetch(config.url + "/thermostat/mode", {
            method: 'get',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /switching_mode {mode}
    post_switching_mode: function (mode) {
        return fetch(config.url + "/thermostat/mode", {
            method: 'post',
            headers: this.headers,
            body: "\"" + mode + "\""
        }).then(this.handleHttpError);
    },

    // GET /auto_prog {}
    get_auto_prog: function () {
        return fetch(config.url + "/thermostat/program", {
            method: 'get',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /auto_prog {prog}
    post_auto_prog: function (prog) {
        return fetch(config.url + "/thermostat/program", {
            method: 'post',
            headers: this.headers,
            body: JSON.stringify(prog)
        }).then(this.handleHttpError);
    },


    // =============================================
    // Diagnostics
    // =============================================

    // GET /temp {}
    temp: function () {
        return fetch(config.url + "/stats/temperature", {
            method: 'get',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // GET /time {}
    get_time: function () {
        return fetch(config.url + "/stats/time", {
            method: 'get',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // GET /identifier {}
    get_identifier: function () {
        return fetch(config.url + "/identifier", {
            method: 'get',
            headers: this.headers
        }).then(this.handleHttpError);
    },

    // POST /identifier {identifier}
    post_identifier: function (identifier) {
        return fetch(config.url + "/identifier", {
            method: 'post',
            headers: this.headers,
            body: JSON.stringify({identifier: identifier})
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
