function openLink(url) {
  window.open(url);
}

function transitionLink(url) {
  document.getElementById("Lollipop").className = "leavingPage";
  setTimeout(() => {
    window.open(url, "_self")
  }, 1000)
}

var meters = document.getElementsByClassName("meterFill")
for (var i = 0; i < meters.length; i++) {
  meters[i].style.setProperty("--animation-time", (((Math.random() * 3) + 1.25) + "s"))
}


function setActivated(element) {
  try {
    document.getElementsByClassName("activated")[0].classList.remove("activated");
  } catch (e) {

  }
  element.classList.add("activated")
  document.getElementById("projectDescriptions").className = "set" + element.id;
}

function toggleMobileNav() {
  var mobileNav = document.getElementById('mobileNav');
  if (mobileNav.classList.contains("open")) {
    mobileNav.classList.remove("open");
    mobileNav.classList.add("closed");
  } else {
    mobileNav.classList.add("open");
    mobileNav.classList.remove("closed");
  }
}



if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
  document.getElementById("Lollipop").className = "enteringPage";
}