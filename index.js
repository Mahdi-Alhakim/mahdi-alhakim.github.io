const projects_data = new Promise((resolve, reject) => {
fetch('./const/projects.json')
    .then(respond => {
        resolve(respond.json())
    }).catch(err => {
        reject(err)
    })
})
const site_text_data = new Promise((resolve, reject) => {
    fetch('./const/site_txts.json')
        .then(respond => {
            resolve(respond.json())
        }).catch(err => {
            reject(err)
        })
    })

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    window.scrollTo(0, 0);
}

function handleSubmit(){
    Email.send({
        SecureToken : "0493bf28-2fec-491e-84b8-44510d0a582a",
        To : '0mahdialhakim@gmail.com',
        From : 'mahdi.a.alhakim@gmail.com',
        Subject : "Visited | Contact Message",
        Body : ` <strong>Name:</strong> ${document.getElementById("contact_name").value}
        <br/> <strong>Email:</strong> ${document.getElementById("contact_email").value}
        <br/> <strong>Message:</strong> <br/> ${document.getElementById("contact_message").value} `
    }).then(
      message => alert(message)
    );
}

var titleDiv = document.getElementById("title");
var presentDiv = document.getElementsByClassName("present")[0];
var txt = document.querySelector("p");
var scrollClass= document.getElementsByClassName("body-scroll")[0];
var smallWidth = false;
var projects_result = {}


function reload(){
    var container = document.getElementById("Resume");
    var content = container.innerHTML;
    container.innerHTML= content; 
}

function changeWidth() 
{
    var scrollVal = window.pageYOffset;
    var scrollSlow  = (scrollVal/6);
    //Changing CSS Width
    titleDiv.style.scale = (Math.min(Math.max(scrollSlow+90, 100), 150)) + "%";
    txt.style.fontSize = (isSmallWidth ? 0.5:1)+(Math.min(Math.max(scrollSlow/10, 0.1), (isSmallWidth ? 0.25:0.6))) + "rem";
    scrollClass.style.transform = "translateY(-"+((Math.min(Math.max(0.9*scrollSlow, 0), (1+offset/window.innerWidth)*1000))) + "%)";
    presentDiv.style.marginTop = -((Math.min(Math.max(0.3*scrollSlow, 0), 500))) + "%";
    
}

function scroll_res() {
    requestAnimationFrame(changeWidth);
}
function on_Change() {
    if (window.innerWidth <= 800) {
    isSmallWidth = true;
    } else {
    isSmallWidth = false;
    }
    
}

function on_load() {
    scrollClass.style.marginTop = 0;
    scroll_res();
    var bodyRect = document.body.getBoundingClientRect(),
    bodyScrollRect = scrollClass.getBoundingClientRect();
    offset = bodyScrollRect.top-bodyRect.top;
    document.body.style.minHeight = offset+scrollClass.offsetHeight;

    projects_data.then(function(result){
    for (var i = 0; i < result.length; i++) {
        projects_result[result[i]["title"]] = result[i]
    }
    
    document.getElementById("tt").innerHTML = result.map(x =>
        `
    <a onclick="clickProj(this)" class="proj_card" name="${x["title"]}" id="${x["title"].replace(/\s/g, '')}" style="text-decoration: none;color:cyan;">
    ${(x["type"] == 'vid') ?
    `<video onmouseenter="mouseinvid(this)" onmouseleave="mouseoutvid(this)" style="will-change:opacity;position:relative;left:0;top:0;opacity:${window.innerWidth > 800 ? 0 : 100}%;height:100%;object-fit: fill;" autoplay muted loop id="myVideo">
            <source src="${x["image_url"]}" type="video/mp4">
        </video>`:`<img src="${x["image_url"]}" onmouseenter="mouseinvid(this)" onmouseleave="mouseoutvid(this)" style="will-change:opacity;position:relative;left:0;top:0;opacity:${window.innerWidth > 800 ? 0 : 100}%;height:100%;object-fit: fill;" id="myVideo">
    </img>`}
        <div onmouseenter="mouseinvid(this.previousElementSibling)" onmouseleave="mouseoutvid(this.previousElementSibling)" style="cursor:pointer;position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;top:-100%">
        <h3 style="color: white">${x["title"]}${x["status"] != 'Done' ? `<br><i style="font-size:0.6rem">${x["status"]}</i>` : ''}</h3>
        
        <i style="font-family:courier-new;color:white;text-shadow: 0 0 4vw 1vw cyan">${x["tag"]}</i>
        </div>
        
    </a>`
    ).join('');
})

site_text_data.then(function(result) {
    document.getElementById("titles").innerHTML = result["titles"];
    document.getElementById("my_experience").innerHTML = result["experience"].map(x => `
    <p midinfo style="font-size: max(6px, 1vw);margin:1.5vw;width:70%;height:fit-content;padding:0.5vw;border-radius:4vw;box-shadow: inset 0 0 0.5vw 0.4vw gray, 0 0 1vw 0.3vw #222 ">${x}</p>
    `).join('');
    document.getElementById("thisOne1").innerHTML = result["latest"]["achieved1"];
    document.getElementById("thisOne2").innerHTML = result["latest"]["achieved2"];
    document.getElementById("thisOne3").innerHTML = result["latest"]["achieved3"];
})
}
function mouseinvid(x) {
    if (!x) return
    x.style.opacity = "0.65"
}

function mouseoutvid(x) {
    if (!x || window.innerWidth <= 800) return
    x.style.opacity = "0.0";
}
function exitProj(proj) {
    proj.parentElement.style="background:transparent;transition-duration: 0.35s;position:fixed;left:50vw;width:0";
    proj.parentElement.innerHTML="";
}
function clickProj(proj) {
    PROJ_INFO = projects_result[proj["name"]];
    document.getElementById("pop-up").style = "transition-duration: 0.35s;background:#000d;position:fixed;left:0;top:0;width:100%;height:100%;z-index:2000;display:flex;align-items:center;justify-content:center; overflow:hidden";
    document.getElementById("pop-up").innerHTML = `
        <div closeProj onclick='exitProj(this)'></div>
        <div style="margin:auto;width:50vw;height:50%;border-radius:1vw;border: 0.5vw solid darkcyan;transform: rotateZ(-4deg);background:#4449;box-shadow:0 0 3vw 4vw lightcyan">
        ${(PROJ_INFO["type"] == 'vid' ? `<video poster="./resources/imgs/test.jpg" style="border-radius:1vw;height:100%;object-fit: contain" autoplay muted loop id="myVideo"><source src="${PROJ_INFO["image_url"]}" type="video/mp4"></video>` : `<img src="${PROJ_INFO["image_url"]}" style="border-radius:1vw;height:100%;object-fit: cover" />`)}
        </div>
        <div class="project-content">
            <p><strong>${PROJ_INFO["title"]}</strong><br/>${PROJ_INFO["time-frame"]}<br/>${PROJ_INFO["tag"]}<br/>${PROJ_INFO["status"]}<br/><article style="color:white;font-family:courier;width:fit-content;height:fit-content;background:#5520;border-radius:1vw;padding:1vw">${PROJ_INFO["description"]}</article></p>
            ${PROJ_INFO["link"] ? `<a href="${PROJ_INFO["link"]}"> Go To Project </a>` : ''}
        </div>
    `;
}



on_load()
on_Change();
scroll_res();
window.addEventListener('scroll', scroll_res, false);
document.addEventListener("touchstart", scroll_res, false);
window.addEventListener('resize', () => {
    reload();on_Change(); on_load(); scroll_res();
}, false);
