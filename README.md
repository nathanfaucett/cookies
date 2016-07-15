cookies
=======

get/set/remove cookies for the browser

```javascript
var cookies = require("@nathanfaucett/cookies");


cookies.set("key", "value");
cookies.get("key") === "value";

cookies.has("key") === true;
cookies.has("value") === false;

cookies.keys() === ["key"];
cookies.remove("key");
```
