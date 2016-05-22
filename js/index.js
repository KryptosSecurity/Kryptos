/* initial variables */
var password;
var inputContent = document.getElementById("content");
var buttonSave = document.getElementById("save-content");

var screenLogin = document.getElementById("screen-login");
var inputLogin = document.getElementById("pw");
var buttonLogin = document.getElementById("button-login");

/* mini jquery */
function addClass(el, className) {
  if (el.classList)
    el.classList.add(className);
  else
    el.className += ' ' + className;
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  }
  else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

/* software code */
function checkPW() {
  console.info(password);
  if (password == undefined) {
    addClass(screenLogin, 'active');
    return false;
  }
  else {
    return true;
  }
}

function setPassowrd(pw) {
  password = md5(pw);
}

function getPassowrd() {
  return password;
}

function encodeCrypto() {
  var text = inputContent.value;

  if (!checkPW()) {
    return false;
  }
  var key = aesjs.util.convertStringToBytes(getPassowrd());
  var textBytes = aesjs.util.convertStringToBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  console.info(aesjs.util.convertBytesToString(encryptedBytes, 'hex'));
  localStorage.setItem("data", aesjs.util.convertBytesToString(encryptedBytes, 'hex'));
}

function decodeCrypto() {
  if (!checkPW()) {
    return false;
  }

  console.info(getPassowrd());
  var key = aesjs.util.convertStringToBytes(getPassowrd());
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var textBytes = aesjs.util.convertStringToBytes(localStorage.getItem("data"), 'hex');
  var decryptedBytes = aesCtr.decrypt(textBytes);
  var decryptedText = aesjs.util.convertBytesToString(decryptedBytes);
  inputContent.value = decryptedText;
}

buttonSave.addEventListener('click', function() {
  encodeCrypto();
});

function initialLogin() {
  var pw = inputLogin.value
  inputLogin.value = "";
  if (pw.length < 1) {
    inputLogin.style.outline = "2px solid red";
    return false;
  }

  setPassowrd(pw);
  console.log(getPassowrd());
  if (localStorage.getItem("data") != undefined) {
    console.log("entrando");
    decodeCrypto();
    
  }
  removeClass(screenLogin, 'active');
}

inputLogin.addEventListener("keypress", function() {
  if (event.which == 13 || event.keyCode == 13) {
    initialLogin();
  }
});

buttonLogin.addEventListener('click', function() {
  initialLogin();
});