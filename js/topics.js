var topic = document.getElementById("topic");
var desc = document.getElementById("topic_desc");
var displayDiv = document.getElementById("display");
var customIcon = document.getElementById("custom_icon");
var createBut = document.getElementById("create");
var topLogo = document.getElementById("topper");

topLogo.addEventListener("click", function(){
    location.href = "/"
})
$(document).ready(function(){
$.ajax({
            url:"/roomCRUD",
            type:"post",
            data:{
                type: "read"
            },
            success:function(resp){
                //should send an array back if successful
                if(resp.status == "success"){
                    var topics = resp.arr;
                    for(var i = 0; i<topics.length; i++){
                        
                        //variables
                        var ndiv = document.createElement("div");
                        var divContainer = document.createElement("div");
                        var icon = document.createElement("img");
                        var topicDiv = document.createElement('h1');
                        var descDiv = document.createElement("h5");
                        
                        //assign variables to their classes for css
                        icon.id = "icons";
                        topicDiv.id = "topic_div";
                        descDiv.id = "desc_div";
                        ndiv.id = "new_div";
                        divContainer.id = "div_container";
                        
                        //append
                        displayDiv.appendChild(ndiv);
                        ndiv.appendChild(icon);
                        ndiv.appendChild(divContainer);
                        divContainer.appendChild(topicDiv);
                        divContainer.appendChild(descDiv);
                        
                        //values
                        topicDiv.innerHTML = topics[i].topic;
                        descDiv.innerHTML = topics[i].desc;
                        icon.src = topics[i].url;
                        

                        //store the index of the array into the div using a custom property
                        ndiv.myindex = i;
                        ndiv.addEventListener("click", function(){
                            //change the location to this new link with the index as the parameter
                            location.href = "/topic/"+this.myindex;
                        });
                    }
                }
            }
        });

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
    }else{
    customIcon.disabled = true;
    createBut.disabled = false;
    }
})

createBut.addEventListener("click", function(){
    var imgUrl = "/images/preset.png";
    if(menu.value == "Opinions"){
        imgUrl = "/images/opinion.png"
    }
    if(menu.value == "Questions"){
        imgUrl = "/images/question.png"
    }
    if(menu.value == "Help"){
        imgUrl = "/images/help.png"
    }
    if(menu.value == "Custom"){
        imgUrl = customIcon.value;
    }
        $.ajax({
            url:"/roomCRUD",
            type:"post",
            data:{
                obj:{
                topic: topic.value,
                desc: desc.value,
                category: menu.value,
                url: imgUrl
                },
                type: "create"
            },
            success:function(resp){
                //should send an array back if successful
                if(resp.status == "success"){
                    
                        //variables
                        var ndiv = document.createElement("div");
                        var divContainer = document.createElement("div");
                        var icon = document.createElement("img");
                        var topicDiv = document.createElement('h1');
                        var descDiv = document.createElement("h5");
                        
                        //assign variables to their classes for css
                        icon.id = "icons";
                        topicDiv.id = "topic_div";
                        descDiv.id = "desc_div";
                        ndiv.id = "new_div";
                        divContainer.id = "div_container";
                    
                        //append
                        displayDiv.appendChild(ndiv);
                        ndiv.appendChild(icon);
                        ndiv.appendChild(divContainer);
                        divContainer.appendChild(topicDiv);
                        divContainer.appendChild(descDiv);
                        
                        //values
                        topicDiv.innerHTML = resp.name.topic;
                        descDiv.innerHTML = resp.name.desc;
                        icon.src = resp.name.url;
                    
                        
                    
                    //store the index of the array into the div using a custom property
                        ndiv.myindex = resp.index;
                        ndiv.addEventListener("click", function(){
                            //change the location to this new link with the index as the parameter
                            location.href = "/topic/"+this.myindex;
                        });
                    }
                }
            });
        topic.value = "";
        desc.value ="";
        customIcon.value = "";
    });
});