import axios from 'axios'
import defaultConfig from './config.json'
export default class Base {
    constructor (token) {
        if (token) {
            this.newAxios()
        } else {
            this.$http = this.newAxios(defaultConfig)
        }
    }

    newAxios (config) {
        return axios.create({
            headers: config.headers,
            timeout: config.timeout
        })
    }

    getDefaultConfig () {
        return defaultConfig
    }

    getAxios () {
        return axios
    }

    setToken (token) {
        if (token) {
            defaultConfig.headers.Authorization = token
            this.$http = this.newAxios(defaultConfig)
        }
    }

    get (url, params) {
        let self = this
        return new Promise(function (resolve, reject) {
            self.$http.get(self.appendDomain(url), {params: params})
                .then(response => {
                    resolve(self.handleSuccess(response))
                })
                .catch(error => {
                    reject(self.handleError(error))
                })
        })
    }

    post (url, params) {
        let self = this
        return new Promise(function (resolve, reject) {
            self.$http.post(self.appendDomain(url), params)
                .then(response => {
                    resolve(self.handleSuccess(response))
                }).catch(error => {
                    reject(self.handleError(error))
                })
        })
    }

    put (url, params) {
        let self = this
        return new Promise(function (resolve, reject) {
            self.$http.put(self.appendDomain(url), params)
                .then(response => {
                    resolve(self.handleSuccess(response))
                }).catch(error => {
                    reject(self.handleError(error))
                })
        })
    }

    delete (url, params) {
        let self = this
        return new Promise(function (resolve, reject) {
            self.$http.delete(self.appendDomain(url), {params: params})
                .then(response => {
                    resolve(self.handleSuccess(response))
                }).catch(error => {
                    reject(self.handleError(error))
                })
        })
    }

    urlParams (params) {
        if (!params || params === null) return ''
        var paramStr = '?'
        for (var key in params) {
            paramStr += key + '=' + params[key] + '&'
        }
        paramStr = paramStr.substring(0, paramStr.length - 1)
        return paramStr
    }

    handleSuccess (response) {
        let data = response.data
        return {
            status: data.resultCode === 0 ? 1 : 0,
            data: data
        }
    }

    handleError (error) {
        let resp = {
            code: 0,
            message: null,
            random: Math.random() * 100
        }
        if (error.response) {
            if (error.response.status === 401) {
                window.postMessage('401', '*')
                resp.code = 401
            } else if (error.response.status === 500) {
                resp.code = 500
                resp.message = '服务器内部出错'
            } else if (error.response.status === 504) {
                resp.message = error.response.data
                resp.code = 504
            } else if (error.response.status === 502) {
                resp.message = '网关延时'
                resp.code = 502
            } else if (error.response.status === 503) {
                resp.message = '后台服务未开启'
                resp.code = 503
            }
        } else {
            resp.code = -1
            resp.message = error.message
        }
        return resp
    }

    appendDomain (url) {
        if (url.indexOf('/') !== -1) {
            var urls = url.split('/')
            if (urls && urls.length > 2 && (urls[1] === 'api' || urls[1] === 'public')) {
                return url
            }
        }
        return defaultConfig.domain + '/api/' + url
    }

}
