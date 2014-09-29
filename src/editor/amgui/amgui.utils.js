'use strict';

var amgui;

module.exports = function (_amgui) {

    amgui = _amgui;

    return {
        placeToPoint: placeToPoint,
        callOnAdded: callOnAdded,
    };
};


function placeToPoint(de, mx, my, way) {

    var px = 0, py = 0,
        br = de.getBoundingClientRect(),
        w = br.width,
        h = br.height,
        ww = window.innerWidth,
        wh = window.innerHeight;

    way = way || 'left';

    switch (way) {

        case 'top':
            px = mx - (w / 2);
            py = my - h;
            break;

        case 'right':
            px = mx;
            py = my - (h / 2);
            break;

        case 'bottom':
            px = mx - (w / 2);
            py = my;
            break;

        default:
        case 'left':
            px = mx - w;
            py = my - (h / 2);
    }

    if (py < 0) py = 0;
    if (px + w > ww) px -= (px + w) - ww;
    if (py + h > wh) py -= (py + h) - wh;
    if (px < 0) px = 0;

    de.style.left = px + 'px';
    de.style.top = py + 'px';
}

function callOnAdded(de, cb, thisArg) {

    var setI = setInterval(function () {

        if (check(de)) {

            clearInterval(setI);

            cb.call(thisArg);
        }
        
    }, 234);
    
    function check (node) {

        while (node.parentNode) {

            node = node.parentNode;
            
            if (node.nodeType === 9 || node.nodeType === 11) {

                return true;
            }
        }
    }
}