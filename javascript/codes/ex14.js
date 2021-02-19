// JavaScript demonstration
function doDemo (button) {
    var square = document.getElementById("square")
    square.style.backgroundColor = "#fa4"
    square.style.position = 'absolute';
    square.style.left = '20em';
    button.setAttribute("disabled", "true")
    setTimeout(clearDemo, 2000, button)
}
  
function clearDemo (button) {
    var square = document.getElementById("square")
    square.style.backgroundColor = "transparent"
    square.style.left = '0em';
    square.style.position = 'relative';
    button.removeAttribute("disabled")
}