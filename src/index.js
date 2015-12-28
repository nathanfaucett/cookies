var isNullOrUndefined = require("is_null_or_undefined"),
    isString = require("is_string"),
    isNumber = require("is_number"),
    isDate = require("is_date"),
    isObject = require("is_object"),
    environment = require("environment");


var cookies = exports,
    document = environment.document,
    reReplacer = /[\-\.\+\*]/g,
    reKeys = /((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,
    reValues = /\s*(?:\=[^;]*)?;\s*/,
    reSet = /^(?:expires|max\-age|path|domain|secure)$/i;


function parseJSON(value) {
    var json;
    try {
        json = JSON.parse(value);
    } catch (e) {
        json = value;
    }
    return json;
}

function stringifyJSON(value) {
    var string;
    try {
        string = JSON.stringify(value);
    } catch (e) {
        string = "";
    }
    return string;
}

if (!isString(document.cookie)) {
    document.cookie = "";
}


cookies.get = function(key) {
    var value;

    if (isNullOrUndefined(key)) {
        return value;
    } else {
        value = decodeURIComponent(
            document.cookie.replace(
                new RegExp(
                    "(?:(?:^|.*;)\\s*" + encodeURIComponent(key)
                    .replace(reReplacer, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"
                ), "$1"
            )
        );
        return (!isNullOrUndefined(value) && value !== "undefined" && value !== "null" && value) ? parseJSON(value) : undefined;
    }
};

cookies.set = function(key, value, end, path, domain, secure) {
    var expires;

    if (isNullOrUndefined(key) || reSet.test(key)) {
        return false;
    } else {
        expires = "";

        if (isNumber(end)) {
            expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
        } else if (isString(end)) {
            expires = "; expires=" + end;
        } else if (isDate(end)) {
            expires = "; expires=" + end.toUTCString();
        }

        if (isObject(value)) {
            value = stringifyJSON(value);
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
    }
};

cookies.has = function(key) {
    if (isNullOrUndefined(key)) {
        return false;
    } else {
        return (new RegExp(
            "(?:^|;\\s*)" + encodeURIComponent(key).replace(reReplacer, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
};

cookies.keys = function() {
    var keys = document.cookie.replace(reKeys, "").split(reValues),
        i = -1,
        il = keys.length - 1;

    while (i++ < il) {
        keys[i] = decodeURIComponent(keys[i]);
    }

    return keys;
};

cookies.remove = function(key, path, domain) {
    if (!cookies.has(key)) {
        return false;
    } else {
        document.cookie = encodeURIComponent(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (
            (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "")
        );
        return true;
    }
};
