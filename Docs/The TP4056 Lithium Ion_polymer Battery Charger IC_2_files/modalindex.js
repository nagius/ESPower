var modal=document.getElementById('ModalIndexID');var btn=document.getElementById("ModalIndexBtnID");var span=document.getElementsByClassName("mainIndexClose")[0];btn.onclick=function(){modal.style.display="block";}
span.onclick=function(){modal.style.display="none";}
window.onclick=function(event){if(event.target==modal){modal.style.display="none";}}
function closeMainIndex(){modal.style.display="none";}