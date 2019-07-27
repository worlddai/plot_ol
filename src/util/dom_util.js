
import {stamp,trim} from './core'
export function create(tagName, className, parent, id) {
    var element = document.createElement(tagName);
    element.className = className || '';
    if (id) {
        element.id = id;
    }
    if (parent) {
        parent.appendChild(element);
    }
    return element;
};

export function createHidden(tagName, parent, id) {
    var element = document.createElement(tagName);
    element.style.display = 'none';
    if (id) {
        element.id = id;
    }
    if (parent) {
        parent.appendChild(element);
    }
    return element;
};

export function remove(element, parent) {
    if (parent && element) {
        parent.removeChild(element);
    }
};

export function get(id) {
    return document.getElementById(id);
};

export function getStyle(element, name) {
    var value = element.style[name];
    return value === 'auto' ? null : value;
};

export function hasClass(element, name) {
    return (element.className.length > 0) &&
        new RegExp('(^|\\s)' + name + '(\\s|$)').test(element.className);
};

export function addClass(element, name) {
    if (this.hasClass(element, name)) {
        return;
    }
    if (element.className) {
        element.className += ' ';
    }
    element.className += name;
};

export function removeClass(element, name) {
    element.className = trim((' ' + element.className + ' ').replace(' ' + name + ' ', ' '));
};

export function getDomEventKey(type, fn, context) {
    return '_p_dom_event_' + type + '_' + stamp(fn) + (context ? '_' + stamp(context) : '');
};

export function addListener(element, type, fn, context) {
    var self = this,
        eventKey = getDomEventKey(type, fn, context),
        handler = element[eventKey];

    if (handler) {
        return self;
    }

    handler = function (e) {
        return fn.call(context || element, e);
    };

    if ('addEventListener' in element) {
        element.addEventListener(type, handler, false);
    } else if ('attachEvent' in element) {
        element.attachEvent('on' + type, handler);
    }

    element[eventKey] = handler;
    return self;
};

export function removeListener(element, type, fn, context) {
    var self = this,
        eventKey = getDomEventKey(type, fn, context),
        handler = element[eventKey];

    if (!handler) {
        return self;
    }

    if ('removeEventListener' in element) {
        element.removeEventListener(type, handler, false);
    } else if ('detachEvent' in element) {
        element.detachEvent('on' + type, handler);
    }

    element[eventKey] = null;

    return self;
};