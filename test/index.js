var tape = require("tape"),
    cookies = require("..");


tape("cookies.set(key, value[, end, path, domain, secure]), cookies.get(key)", function(assert) {
    cookies.set("key", "value");
    assert.equal(cookies.get("key"), "value");
    assert.end();
});

tape("cookies.has(key)", function(assert) {
    assert.equal(cookies.has("key"), true);
    assert.equal(cookies.has("value"), false);
    assert.end();
});

tape("cookies.keys()", function(assert) {
    assert.deepEqual(cookies.keys("key"), ["key"]);
    assert.end();
});

tape("cookies.remove(key)", function(assert) {
    cookies.remove("key", "value");
    assert.equal(cookies.get("key"), undefined);
    assert.end();
});
