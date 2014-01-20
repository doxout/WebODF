var xhr = new XMLHttpRequest(),
    code;
xhr.open("GET", "../WebODF/webodf/lib/runtime.js", false);
xhr.send(null);
code = xhr.responseText;
code += "\n//# sourceURL=../WebODF/webodf/lib/runtime.js";
code += "\n//@ sourceURL=../WebODF/webodf/lib/runtime.js"; // Chrome
eval(code);
