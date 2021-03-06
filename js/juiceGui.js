document.addEventListener("keyup",function(ev){
    if (ev.keyCode == 27){
        document.body.classList.toggle("showOptions");
    }

});

var breathingAnimationOptionContainer = document.querySelector(".breathingAnimationOption");
breathingAnimationOptionContainer.addEventListener("click",function(ev){
    var isChecked = breathingAnimationOptionContainer.querySelector("input").checked;
    if(isChecked){
        breathingAnimationOptionContainer.querySelector("input").checked = false;
        document.body.classList.remove("breathingAnimationOn");
    }
    else{
        breathingAnimationOptionContainer.querySelector("input").checked = true;
        document.body.classList.add("breathingAnimationOn");
    }
});

var particleOptionsContainer = document.querySelector(".particlesOption");
particleOptionsContainer.addEventListener("click",function(ev){
    var isChecked = particleOptionsContainer.querySelector("input").checked;
    if(isChecked){
        particleOptionsContainer.querySelector("input").checked = false;
        document.body.classList.remove("particlesOn");
    }
    else{
        particleOptionsContainer.querySelector("input").checked = true;
        document.body.classList.add("particlesOn");
    }
});

var cameraMovementOptionContainer = document.querySelector(".cameraMovementOption");
cameraMovementOptionContainer.addEventListener("click",function(ev){
    var isChecked = cameraMovementOptionContainer.querySelector("input").checked;
    if(isChecked){
        cameraMovementOptionContainer.querySelector("input").checked = false;
        cameraMovement = false;
    }
    else{
        cameraMovementOptionContainer.querySelector("input").checked = true;
        cameraMovement = true;
    }
});

var physicsOptionContainer = document.querySelector(".physicsOption");
physicsOptionContainer.addEventListener("click",function(ev){
    var isChecked = physicsOptionContainer.querySelector("input").checked;
    if(isChecked){
        physicsOptionContainer.querySelector("input").checked = false;
        canFormBreak = false;
    }
    else{
        physicsOptionContainer.querySelector("input").checked = true;
        canFormBreak = true;
    }
});