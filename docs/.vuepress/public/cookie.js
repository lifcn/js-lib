var Cookie = function() {
  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    if (v) return v[2]

    return localStorage.getItem(name)
  }

  function setCookie(name, value, days = 365) {
    var d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
  }

  function delCookie(name) {
    setCookie(name, '', -1)
  }

  return {
    getCookie: getCookie,
    setCookie: setCookie,
    delCookie: delCookie,
  }
}()

