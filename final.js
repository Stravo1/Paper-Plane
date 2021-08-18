const glider = {
    C_d: 0.45,
    C_l: 0.45,
    Area_l: 14,
    Area_d: 2,
};

const status = {
    turn: null,
    aerial: false,
    glide: false,
    landing: false,
    ground: 'on ground',
    elv_ch: null,
}

const del_time = 0.05*2, density = 1.225, friction_coeff = 0.25;
var v_p_x = elv = elv_p = v_x = v_y = scroll_speed = 0;
var v_p_y = 0


const setUpInfiniteScroll = () => {
    document.getElementById('canvas').height = screen.height;
    console.log('gg')
    window.onscroll = () => {
        if(document.body.scrollHeight - (window.scrollY + screen.height) < 200){
            var extend = document.createElement('canvas');
            document.body.appendChild(extend);
        }
        updateScrollSpeed()
    }
}

const updateScrollSpeed = () => {
    var lastPos = window.scrollY;
    setTimeout(() => {
         scroll_speed = Math.round(window.scrollY - lastPos);
         //scroll_Instructions(scroll_speed) 
    }, 50)
}

const startGlider = () => {
    setInterval(() => {
        motion_x();
        motion_y();
        dashboard_updt();
    }, 50*2);
}

const motion_x = () => {
    //console.log(status.glide)
    if(status.glide) {
        //console.log('entered')
        glide_motion();
        return;
    }
    var F_scroll = !scroll_speed ? 0 : scroll_speed+750;

    var F_drag = 0.5*glider.C_d*density*v_p_x*v_p_x*glider.Area_d

    var acc_x = (F_scroll - F_drag - (elv || !v_p_x ? 0 : 750*friction_coeff))/75
    //console.log(acc_net, "acc", v_p_x, "v")
    
    v_x = v_p_x + acc_x*del_time

    document.getElementById('speedx').innerHTML = Math.round(v_x)
    
    //console.log(glider.time*acc_net,"mul", acc_net, "acc", v_p_x + acc_net*glider.time, "vr", v_p_x, "v_p_x")
    if (v_x > 0){
        v_p_x = v_x
    }
    else {
        v_p_x = 0
    }
    
}

const glide_motion = () => {
    var acc_glide = 0.0001*Math.abs(v_y)
    console.log("gliding")
    v_p_x += acc_glide*del_time
}

const motion_y = () => {
    var acc_y = (0.5*glider.C_l*density*v_p_x*v_p_x*glider.Area_l - (elv > 0 ? 0.5*glider.C_d*density*Math.abs(v_p_y)*v_p_y*glider.Area_l + 750 : 0))/75
        //console.log(dist, acc_y,"gg", v_p_x)
    //console.log("ggg", v_p_y, acc_y, "kk");
    v_y = v_p_y + acc_y*del_time
    //console.log(v_p_y, v_y, "y");
    elv += v_p_y*del_time + 0.5*acc_y*Math.pow(del_time, 2)
    v_p_y = v_y
    //console.log(v_p_y);

    if(elv < 0){
        v_p_y = v_y = elv = 0;
    }
    //console.log(v_y,'hh')
}

const dashboard_updt = () => {
    //console.log(v_x,v_y)
    document.getElementById('speedX').innerHTML = v_x.toFixed(2);
    document.getElementById('speedY').innerHTML = v_y.toFixed(2);
    document.getElementById('elevation').innerHTML = elv.toFixed(2);
    document.getElementById('del_elev').innerHTML = del_elev();
    document.getElementById('status').innerHTML = info();

    if(!scroll_speed && v_p_y < 0) {
        status.glide =true
        //console.log('gg')
    }
    else {
        status.glide = false
        //console.log('ng')
    }

}
const del_elev = () => {
    var elv_pt = elv_p
    elv_p = elv
    if (elv_pt < elv) return 'Ascending'
    else if (elv_pt > elv) return 'Descending'
    return "Alt. fixed"
}
const info = () => {
    var result = '';
    if (!scroll_speed) result+="No thrust | "
    else result+="Thrust = "+ JSON.stringify(scroll_speed+750) +" | "
    if (elv && !status.glide) result+="Airborne | "
    else if (elv && status.glide) result += "Airborne and Glidding | "
    else result+=" On ground | "
    return result;
}
const setUpOrientationSense = () => {
    window.addEventListener("deviceorientation", handleOrientation, true);
}
const handleOrientation = (event) => {
    console.log(event)
}
const setUpAll = () => {
    setUpInfiniteScroll()
    setUpOrientationSense();
    startGlider();
}

setUpAll()
