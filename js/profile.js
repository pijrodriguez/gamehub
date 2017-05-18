var menu = document.getElementById("avatar_menu");
var user = document.getElementById("username");
var createBut = document.getElementById("create");
var icon = document.getElementById("avatar");
var mainDiv = document.getElementById("main");
var radioMale = document.getElementById("radio_male");
var radioFemale = document.getElementById("radio_female");
var customIcon = document.getElementById("custom_img");
var genderColor = "#1D77EF";
var imgUrl = "/images/noavatar.jpg";
var topLogo = document.getElementById("topper");
var goToTopics = document.getElementById("topics");

topLogo.addEventListener("click", function(){
    location.href = "/"
});

goToTopics.addEventListener("click", function(){
    location.href = "/topics";
});
//if statements for the name color
radioMale.onclick = function(){
    genderColor = "#1D77EF";
    console.log(genderColor);
};
radioFemale.onclick = function(){
    genderColor = "#FF4981";
    console.log(genderColor);
};

menu.addEventListener("change", function(){
    if(menu.value == "Custom"){
        customIcon.disabled = false;
        if(customIcon.value == ""){
            createBut.disabled = true;
            }
        customIcon.onkeyup = function(){
            if(customIcon.value != ""){
                createBut.disabled = false;
                }
            else if(customIcon.value == ""){
                createBut.disabled = true;
            }
        }
    }
    else{
        customIcon.disabled = true;
        createBut.disabled = false;
        }        
});

createBut.addEventListener("click", function(){    
    //if statements for the user icon
    if(menu.value == "Trevor"){
        imgUrl = "/images/trevor.jpg"
        icon.src = imgUrl;
    }
    if(menu.value == "Crash"){
        imgUrl = "/images/crash.jpg"
        icon.src = imgUrl;
    }
    if(menu.value == "Cash"){
        imgUrl = "/images/cash.jpg"
        icon.src = imgUrl;
    }
    if(menu.value == "Custom"){
        imgUrl = customIcon.value;
        icon.src = imgUrl;
    }

    $.ajax({
        url:"/user",
        type:"post",
        data:{
            obj:{
            user: user.value,
            avatar: imgUrl,
            gender: genderColor
              },
            type: "create"
            },
            success:function(resp){
            var status = document.createElement("h5");
            status.className = "text-center";
            
            mainDiv.appendChild(status);
            status.innerHTML = "User saved: "+ resp.account.user;
        }
    })
})