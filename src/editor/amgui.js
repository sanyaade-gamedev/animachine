'use strict';

var fontelloConf = require('./assets/fontello/config.json')

var amgui = {

    FONT_FAMILY: '"Open Sans", sans-serif',
    FONT_SIZE: '15px',

    color: {
        bg0: '#000',
        bg1: '#222',
        bg2: '#444',
        bg3: '#666',
        text: '#efe'
    },

    createKeyline: function (opt) {

        var timescale = opt.timescale || 0.2,
            keyframes = {};

        var de = document.createElement('div');
        de.style.width = '100%';
        de.style.height = (opt.height || 21) + 'px';
        de.style.background = opt.background || 'grey';
        de.style.position = 'relative';

        de.addKey = function (time) {

            var key = amgui.createKey();
            keyframes[time] = key;

            key.addEventListener('click', onSelectKey);

            de.appendChild(key);

            positionKeys();
        }

        de.setTimescale = function (ts) {

            timescale = ts;
            positionKeys();
        }

        function onSelectKey () {

            var time;

            Object.keys(keyframes).some(function (t) {

                if (keyframes[t] === this) {

                    return time = t;
                }
            }, this);

            de.dispatchEvent(new CustomEvent('selectKey', {detail: {time: time}}));
        }

        function positionKeys() {

            Object.keys(keyframes).forEach(function (time) {

                keyframes[time].style.left = (timescale * time) + 'px';
            });
        }

        return de;
    },

    createKey: function (opt) {

        var de = document.createElement('div');
        de.style.position = 'absolute';

        var key = document.createElement('div');
        key.style.width = '0';
        key.style.height = '0';
        key.style.borderStyle = 'solid';
        key.style.borderWidth = '21px 3.5px 0 3.5px';
        key.style.borderColor = '#7700ff transparent transparent transparent';
        de.appendChild(key);

        return de;
    },

    createDialog: function (opt) {

        var de = document.createElement('dialog');

        var title = document.createElement('div');
        title.textContent = opt.title || 'Dialog';
        title.style.height = '34px';
        title.style.fontSize = '23px';
        de.appendChild(de);

        de.appendChild(opt.content);

        if (opt.buttons) {

            opt.buttons.forEach(function (caption) {

                var btn = this.createBtn({caption: caption});
                btn.style.display = 'inline-block';
                de.appendChild(btn);

                btn.addEventListener('click', function () {
                    de.dispatchEvent(new Event('click' + caption));
                });
            }, this);
        }

        return de;
    },

    createBtn: function (opt) {

        var de = document.createElement('div');
        de.style.height = (opt.height || 21) + 'px';
        de.style.cursor = 'pointer';
        de.style.color = 'white';
        de.textContent = opt.caption || 'button';

        de.addEventListener('mouseenter', onMOver);
        de.addEventListener('mouseleave', onMOut);

        function onMOver() {

            this.style.background = 'darkgrey';
        }

        function onMOut() {
            
            this.style.background = 'none';
        }

        return de;
    },

    createIconBtn: function (opt) {

        var de = amgui.createIcon({size: opt.height, icon: opt.icon});
        de.style.width = (opt.width || 21) + 'px';
        de.style.cursor = 'pointer';
        de.style.color = 'white';
        de.style.overflow = 'hidden';

        de.addEventListener('mouseenter', onMOver);
        de.addEventListener('mouseleave', onMOut);

        if (opt.onClick) {

            de.addEventListener('click', opt.onClick);
        }

        function onMOver() {

            this.style.background = 'darkgrey';
        }

        function onMOut() {
            
            this.style.background = 'none';
        }

        return de;
    },

    createToggleIconBtn: function (opt) {

        var isOn = false;
        var de = amgui.createIconBtn(opt);
        setIcon();

        de.addEventListener('click', onClick);

        de.setToggle = function (on) {

            on = !!on;
            if (on === isOn) {
                return;
            }
            isOn = on;
            setIcon();

            de.dispatchEvent(new CustomEvent('toggle', {detail: {state: isOn}}));
            de.dispatchEvent(new CustomEvent(isOn ? 'toggleOn' : 'toggleOff'));
        };

        de.state = function () {

            return isOn;
        }

        function onClick() {
            
            de.setToggle(!isOn);
        }

        function setIcon() {

            de.setIcon(isOn ? opt.iconOn : opt.iconOff);
        }

        return de;
    },

    createIcon: function (opt) {

        opt = opt || {};
        opt.size = opt.size || 23;
        
        var de = document.createElement('div');
        de.style.color = '#fff';
        de.style.width = opt.size + 'px';
        de.style.height = opt.size + 'px';
        de.style.textAlign = 'center';
        de.style.fontFamily = 'amgui';
        de.style.fontSize = Math.round(opt.size * 0.9) + 'px';

        de.setIcon = function (icon) {

            var glyph = fontelloConf.glyphs.find(function (glyph) {

                return glyph.css === icon
            });

            var code = glyph ? glyph.code : 59393;
            de.textContent = String.fromCharCode(code);
        };

        de.setIcon(opt.icon);

        return de;
    },  

    createDropdown: function (opt) {

        var options = opt.options || [];

        var de = document.createElement('ul');
        de.style.listStyleType = 'none';
        de.style.margin = 0;
        de.style.padding = 0;

        options.forEach(function (text) {

            var li = document.createElement('li');
            li.textContent = text;
            li.style.cursor = 'pointer';
            li.style.color = 'white';
            li.style.background = 'darkcyan';

            li.addEventListener('click', function () {

                de.dispatchEvent(new CustomEvent('select', {detail: {selection: text}}));
            });
            de.appendChild(li);
        });

        return de;
    },

    bindDropdown: function(deBtn, deDropdown) {

        var isOpened = false;

        deDropdown.style.position = 'fixed';

        deBtn.addEventListener('click', function () {

            isOpened ? close() : open();
        });
        deDropdown.addEventListener('select', close);

        function open() {

            if (isOpened) return;
            isOpened = true;

            var bcr = deBtn.getBoundingClientRect();
            deDropdown.style.left = bcr.left + 'px';
            deDropdown.style.top = bcr.bottom + 'px';

            document.body.appendChild(deDropdown);
        }

        function close() {

            if (!isOpened) return;
            isOpened = false;
            
            if (deDropdown.parentElement) {
                deDropdown.parentElement.removeChild(deDropdown);
            }
        }
    },

    createKeyValueInput: function (opt) {

        opt = opt || {};

        var de = document.createElement('div');
        de.style.margin = '0 1px';

        var keyOn = false;

        var oldKey, oldValue;

        var inpKey = createInput();
        inpKey.addEventListener('keypress', onKeyPress);

        var divider = createDivider();

        var inpValue = createInput();
        // inpValue.style.color = 'lightblue';
        inpValue.style.textAlign = 'right';
        inpValue.style.right = '0px';

        showHideValue(keyOn);

        de.getKey = function () {
            return inpKey.value;
        };

        de.setKey = function (v) {
            
            if (v === oldKey) return;
            
            oldKey = v;
            inpKey.value = v;
            checkKeyOn();
        };

        de.getValue = function () {
            return inpValue.value;
        };

        de.setValue = function (v) {
            
            if (v === oldValue) return;

            oldValue = v;
            inpValue.value = v;
        };

        if (opt.parent) {
            opt.parent.appendChild(de);
        }

        if (opt.key) {
            de.setKey(opt.key);
        }

        if (opt.value) {
            de.setValue(opt.value);
        }

        if (opt.onChange) {
            de.addEventListener('change', opt.onChange);
        }

        function onChange(e) {
            
            checkKeyOn();

            var detail = {};
            
            if (de.getKey() !== oldKey) {
                oldKey = detail.key = de.getKey();
            }
            if (de.getValue() !== oldValue) {
                oldValue = detail.value = de.getValue();
            }

            if ('value' in detail || 'key' in detail) {

                de.dispatchEvent(new CustomEvent('change', {detail: detail}));
            }
        }

        function onKeyPress(e) {
            if (e.keyCode === 13) {
                
                inpValue.focus();
            }
        }

        function checkKeyOn() {

            var on = !!inpKey.value;

            if (on !== keyOn) {
                
                keyOn = on;
                showHideValue(keyOn);
            }
        }

        function showHideValue(show) {
            
            divider.style.display = show ? 'inline' : 'none';
            inpValue.style.display = show ? 'inline-block' : 'none';
            inpKey.style.width = show ? 'calc(50% - 5px)' : '100%';
        }

        function createInput() {

            var inp = document.createElement('input');
            inp.type = 'text';
            inp.style.width = '50%';
            inp.style.height = '100%';
            inp.style.fontSize = amgui.FONT_SIZE;
            inp.style.fontFamily = amgui.FONT_FAMILY;
            inp.style.border = 'none';
            inp.style.color = 'white';
            inp.style.background = 'none';
            inp.addEventListener('change', onChange);
            inp.addEventListener('keyup', onChange);
            // $(inp).autosizeInput({space: 0});
            de.appendChild(inp);
            return inp;
        }

        function createDivider () {

            var divider = document.createElement('span');
            divider.textContent = ':';
            divider.style.color = 'white';
            divider.style.width = '2px';
            divider.style.fontSize = amgui.FONT_SIZE;
            divider.style.fontFamily = amgui.FONT_FAMILY;
            de.appendChild(divider);

            return divider;
        }

        return de;
    }
}


module.exports = amgui;