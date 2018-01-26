'use strict';

exports.__esModule = true;
exports.getNearbyObjectsFor = exports.setHSL = exports.hue2rgb = undefined;

var _three = require('three');

var hue2rgb = exports.hue2rgb = function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
  return p;
};

var setHSL = exports.setHSL = function setHSL(h, s, l) {
  var r = void 0,
      g = void 0,
      b = void 0;
  // h,s,l ranges are in 0.0 - 1.0
  h = (h % 1 + 1) % 1; // _Math.euclideanModulo( h, 1 );
  s = Math.max(0, Math.min(1, s)); //_Math.clamp( s, 0, 1 );
  l = Math.max(0, Math.min(1, l)); //_Math.clamp( l, 0, 1 );

  if (s === 0) {
    r = g = b = l;
  } else {
    var p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    var q = 2 * l - p;
    r = hue2rgb(q, p, h + 1 / 3);
    g = hue2rgb(q, p, h);
    b = hue2rgb(q, p, h - 1 / 3);
  }
  return new _three.Color(r, g, b);
};

var getNearbyObjectsFor = exports.getNearbyObjectsFor = function getNearbyObjectsFor(obj, group, maxConnectDistance) {
  var objs = [];
  for (var j = 0; j < group.children.length; j++) {
    if (obj.uuid == group.children[j].uuid) continue;

    var dist = obj.position.distanceTo(group.children[j].position);
    if (dist < maxConnectDistance) {
      objs.push(group.children[j]);
    }
  }
  return objs;
};