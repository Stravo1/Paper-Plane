/*
Facts:

mass_of_glider: 25kg;
mass_of_pilot: 50kg;
total mass = 75kg;

force due to gravity = 75*10 N;

drag = 0.5*⍴CAv^2
    C = 1.15
lift = (C⸤⍴(v^2)A)/2
    C⸤ = 0.75, ⍴ = 1.225, A = 14m^2

required velocity = 15m/s
wind speed = 10-20m/s
thus thrust velocity req = 0 - 5m/s

*/
var glider = {
    Cd: 0.45,
    Cl: 0.45,
    d: 1.225,
    A: 14,
    Ad: 2,
    time: 0.05,
}
var v_p_x = 0, v_p_y = 0, dist = 0;

var scroll_speed;

console.log("hello World")
window.onload = () => {
    var elem = document.getElementById('canvas')
    elem.height = screen.height;
    //console.log('loaded', elem)
    //document.getElementById('canvas').width = screen.width - 20;
    //document.getElementById('canvas').height = screen.height - 20;
}
window.onscroll = (e) => {
    if(document.body.scrollHeight - (window.scrollY + screen.height) < 200){
    var extend = document.createElement('canvas');
    extend.style = "border: 1px solid black";
    document.body.appendChild(extend)
    }
    //console.log(e)
    checkScrollSpeed()
}

const checkScrollSpeed = () => {
    var lastPos = window.scrollY;
    setTimeout(() => {
         scroll_speed = Math.round(window.scrollY - lastPos);
         document.getElementById('speed').innerHTML= scroll_speed;
         if( document.getElementById('max').innerHTML < scroll_speed){
            document.getElementById('max').innerHTML= scroll_speed
         }
         
    }, 50)
}
const gliderSpeed = () => {
    if(!scroll_speed && v_p_y < 0) {drift(v_p_y); return}
    var F_scroll = !scroll_speed ? 0 : scroll_speed+750;
    //console.log(F_scroll)
    var F_drag = 0.5*glider.Cd*glider.d*v_p_x*v_p_x*glider.Ad
    //console.log(F_drag, "drag")
    var acc_x = (F_scroll - F_drag - (dist || !v_p_x ? 0 : 750*0.25))/75
    //console.log(acc_net, "acc", v_p_x, "v")
    console.log(dist && !v_p_x, dist, v_p_x)
    var vx = v_p_x + acc_x*glider.time
    document.getElementById('speedx').innerHTML = vx
    
    //console.log(glider.time*acc_net,"mul", acc_net, "acc", v_p_x + acc_net*glider.time, "vr", v_p_x, "v_p_x")
    if (vx > 0){
        v_p_x = vx
    }
    else {
        v_p_x = 0
    }
    
    //console.log(F_scroll-F_drag, acc_x, v_p_x,)
}
const drift = (vy) => {
    var acc_glide = 0.0001*Math.abs(vy)
    console.log(vy)
    v_p_x += acc_glide*glider.time
}
const lift = () => {
    document.getElementById('speedy').innerHTML = Math.round(v_p_y)
    var acc_y

    acc_y = (0.5*glider.Cl*glider.d*v_p_x*v_p_x*glider.A - (dist > 0 ? 0.5*glider.Cd*glider.d*Math.abs(v_p_y)*v_p_y*glider.A + 750 : 0))/75
        //console.log(dist, acc_y,"gg", v_p_x)
    var vy = v_p_y + acc_y*glider.time
    dist += v_p_y*glider.time + 0.5*acc_y*Math.pow(glider.time, 2)
    v_p_y = vy
    if(dist < 0){
        v_p_y = vy = dist = 0;
    }
    //console.log(acc_y, "hh")
    document.getElementById('lift').innerHTML = Math.round(dist)
    if(document.getElementById('accy').innerHTML < acc_y){
        document.getElementById('accy').innerHTML = acc_y
    }
}
setInterval(() => {
    gliderSpeed()
    lift()
}, 50);