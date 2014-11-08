var type = require("type");


var cookies = module.exports,
    reReplacer = /[\-\.\+\*]/g,
    reKeys = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
    reValues = /\s*(?:\=[^;]*)?;\s*/,
    reSet = /^(?:expires|max\-age|path|domain|secure)$/i;


cookies.get = function(key) {
    var value;

    if (!key) {
        return null;
    }

    value = (
        decodeURIComponent(
            document.cookie.replace(
                new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(reReplacer, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"
            )
        ) || null
    );

    return value != null && value !== "undefined" ? JSON.parse(value) : null;
};

cookies.set = function(key, value, end, path, domain, secure) {
    var expires;

    if (!key || reSet.test(key)) {
        return false;
    }

    expires = "";

    if (type.isNumber(end)) {
        expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
    } else if (type.isString(end)) {
        expires = "; expires=" + end;
    } else if (type.isDate(end)) {
        expires = "; expires=" + end.toUTCString();
    }

    if (type.isObject(value)) {
        value = JSON.stringify(value);
    } else {
        value = value + "";
    }

    document.cookie = encodeURIComponent(key) + "=" + (
        encodeURIComponent(value) +
        expires +
        (domain ? "; domain=" + domain : "") +
        (path ? "; path=" + sPath : "") +
        (secure ? "; secure" : "")
    );

    return true;
};

cookies.has = function(key) {
    if (!key) {
        return false;
    }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(key).replace(reReplacer, "\\$&") + "\\s*\\=")).test(document.cookie);

};

cookies.keys = function() {
    var keys = document.cookie.replace(reKeys, "").split(reValues),
        length = keys.length - 1,
        i = -1;

    while (i++ < length) {
        keys[i] = decodeURIComponent(keys[i]);
    }

    return keys;
};

cookies.remove = function(key, path, domain) {
    if (!cookies.has(key)) {
        return false;
    }
    document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (
        (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "")
    );
    return true;
};
