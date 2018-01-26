function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import { Color, FogExp2, Geometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { hue2rgb, setHSL, getNearbyObjectsFor } from './utils';

var MAX_CONNECT_LINES = 4;
var NUM_SPHERES = 100;
var MAX_CONNECT_DISTANCE = 400;
var SPHERE_DIAMETER = 40;
var LINE_WIDTH = 8;
var MAX_X_LIMIT = 2000;
var MAX_Y_LIMIT = 2000;
var DEFAULT_COLOR = '#800080';
var DEFAULT_MOVEMENT = 0.5;

var myReq = void 0,
    camera = void 0,
    scene = void 0,
    renderer = void 0,
    sphereMaterial = void 0,
    spheres = void 0,
    lineMaterial = void 0,
    animations = {
  color: false,
  x: false,
  y: false
},
    movement = {
  x: DEFAULT_MOVEMENT,
  y: DEFAULT_MOVEMENT
};

var addSpheres = function addSpheres(numSpheres, diameter) {
  for (var i = 0; i < numSpheres; i++) {
    var geometry = new SphereGeometry(diameter, 32, 32);
    var sphere = new Mesh(geometry, sphereMaterial);
    sphere.position.x = 2000 * Math.random() - 1000;
    sphere.position.y = 2000 * Math.random() - 1000;
    sphere.position.z = 2000 * Math.random() - 1000;
    spheres.add(sphere);
  }
  scene.add(spheres);
};

var init = function init(_ref) {
  var container = _ref.container,
      numSpheres = _ref.numSpheres,
      diameter = _ref.diameter,
      maxConnectDistance = _ref.maxConnectDistance,
      maxConnectLines = _ref.maxConnectLines,
      lineWidth = _ref.lineWidth,
      sphereColor = _ref.sphereColor,
      lineColor = _ref.lineColor;

  scene = new Scene();
  scene.fog = new FogExp2(0x000000, 0.0006);

  sphereMaterial = new MeshBasicMaterial({ color: new Color(sphereColor) });
  spheres = new Group();

  lineMaterial = new MeshLineMaterial({
    lineWidth: lineWidth,
    color: new Color(lineColor)
  });

  addSpheres(numSpheres, diameter);

  for (var i = 0; i < spheres.children.length; i++) {
    var obj = spheres.children[i];
    var near = getNearbyObjectsFor(obj, spheres, maxConnectDistance);

    if (near.length == 0) continue;

    var lines = Math.floor(maxConnectLines * Math.random());
    for (var k = 0; k < near.length && k <= lines; k++) {
      var lineGeometry = new Geometry();
      lineGeometry.vertices.push(new Vector3(obj.position.x, obj.position.y, obj.position.z));
      lineGeometry.vertices.push(new Vector3(near[k].position.x, near[k].position.y, near[k].position.z));
      var g = new MeshLine();
      g.setGeometry(lineGeometry);
      g.verticesNeedUpdate = true;
      var mesh = new Mesh(g.geometry, lineMaterial);
      scene.add(mesh);
    }
  }

  camera = new PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 2, 3000);
  camera.position.z = 1000;

  renderer = new WebGLRenderer({
    canvas: container,
    preserveDrawingBuffer: true,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setClearColor(0x000000, 0);
};

var render = function render() {
  if (animations.y) {
    camera.position.y += movement.y;
    if (camera.position.y > MAX_Y_LIMIT || camera.position.y < -MAX_Y_LIMIT) {
      movement.y = -movement.y;
    }
  }
  if (animations.x) {
    camera.position.x += movement.x;
    if (camera.position.x > MAX_X_LIMIT || camera.position.x < -MAX_X_LIMIT) {
      movement.x = -movement.x;
    }
  }
  camera.lookAt(scene.position);
  if (animations.color) {
    var time = Date.now() * 0.00005;
    var h = 360 * (1.0 + time) % 360 / 360;
    sphereMaterial.color.setHSL(h, 0.5, 0.5);
    lineMaterial.uniforms.color.value = setHSL(h, 0.5, 0.5);
  }

  renderer.render(scene, camera);
};

var animate = function animate() {
  myReq = window.requestAnimationFrame(animate);
  render();
};

var _default = function (_Component) {
  _inherits(_default, _Component);

  function _default() {
    _classCallCheck(this, _default);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  _default.prototype.componentDidMount = function componentDidMount() {
    var _props = this.props,
        _props$numSpheres = _props.numSpheres,
        numSpheres = _props$numSpheres === undefined ? NUM_SPHERES : _props$numSpheres,
        _props$diameter = _props.diameter,
        diameter = _props$diameter === undefined ? SPHERE_DIAMETER : _props$diameter,
        _props$maxConnectDist = _props.maxConnectDistance,
        maxConnectDistance = _props$maxConnectDist === undefined ? MAX_CONNECT_DISTANCE : _props$maxConnectDist,
        _props$maxConnectLine = _props.maxConnectLines,
        maxConnectLines = _props$maxConnectLine === undefined ? MAX_CONNECT_LINES : _props$maxConnectLine,
        _props$lineWidth = _props.lineWidth,
        lineWidth = _props$lineWidth === undefined ? LINE_WIDTH : _props$lineWidth,
        _props$animateColor = _props.animateColor,
        animateColor = _props$animateColor === undefined ? false : _props$animateColor,
        _props$animateX = _props.animateX,
        animateX = _props$animateX === undefined ? false : _props$animateX,
        _props$animateY = _props.animateY,
        animateY = _props$animateY === undefined ? false : _props$animateY,
        _props$moveX = _props.moveX,
        moveX = _props$moveX === undefined ? DEFAULT_MOVEMENT : _props$moveX,
        _props$moveY = _props.moveY,
        moveY = _props$moveY === undefined ? DEFAULT_MOVEMENT : _props$moveY,
        _props$sphereColor = _props.sphereColor,
        sphereColor = _props$sphereColor === undefined ? DEFAULT_COLOR : _props$sphereColor,
        _props$lineColor = _props.lineColor,
        lineColor = _props$lineColor === undefined ? DEFAULT_COLOR : _props$lineColor;

    animations = {
      color: animateColor,
      x: animateX,
      y: animateY
    };
    movement = {
      x: moveX,
      y: moveY
    };
    init({
      container: this.container,
      numSpheres: numSpheres,
      diameter: diameter,
      maxConnectDistance: maxConnectDistance,
      maxConnectLines: maxConnectLines,
      lineWidth: lineWidth,
      sphereColor: sphereColor,
      lineColor: lineColor
    });
    animate();
  };

  _default.prototype.componentWillUnmount = function componentWillUnmount() {
    window.cancelAnimationFrame(myReq);
  };

  _default.prototype.render = function render() {
    var _this2 = this;

    return React.createElement('canvas', {
      ref: function ref(c) {
        return _this2.container = c;
      },
      style: {
        width: '100%',
        height: '100%'
      }
    });
  };

  return _default;
}(Component);

export { _default as default };