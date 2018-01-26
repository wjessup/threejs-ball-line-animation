import React, { Component } from 'react'
import {
  Color,
  FogExp2,
  Geometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { MeshLine, MeshLineMaterial } from 'three.meshline'

const CONNECT_DISTANCE = 400
const MAX_CONNECT_LINES = 4
const NUM_SPHERES = 100
const SPHERE_DIAMETER = 40
const LINE_WIDTH = 8

const renderer = new WebGLRenderer();
const sphereMaterial = new MeshBasicMaterial({ color: new Color('purple') })
const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2,3000)
const scene = new Scene()
const spheres = new Group()
const lineMaterial = new MeshLineMaterial({
    lineWidth: LINE_WIDTH,
    color: new Color('purple'),
  })

const hue2rgb = ( p, q, t ) => {
  if ( t < 0 ) t += 1;
  if ( t > 1 ) t -= 1;
  if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
  if ( t < 1 / 2 ) return q;
  if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
  return p;
}

const setHSL = ( h, s, l ) => {
  let r,g,b
  // h,s,l ranges are in 0.0 - 1.0
  h = ( ( h % 1 ) + 1 ) % 1 // _Math.euclideanModulo( h, 1 );
  s = Math.max( 0, Math.min( 1, s ) )//_Math.clamp( s, 0, 1 );
  l = Math.max( 0, Math.min( 1, l ) )//_Math.clamp( l, 0, 1 );

  if ( s === 0 ) {
    r = g = b = l;
  } else {
    var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
    var q = ( 2 * l ) - p;
    r = hue2rgb( q, p, h + 1 / 3 );
    g = hue2rgb( q, p, h );
    b = hue2rgb( q, p, h - 1 / 3 );
  }
  return new Color(r,g,b);
}

const addSpheres = () => {
  for (var i = 0; i < NUM_SPHERES; i++) {
    var geometry = new SphereGeometry(SPHERE_DIAMETER, 32, 32)
    var sphere = new Mesh(geometry, sphereMaterial)

    sphere.position.x = 2000 * Math.random() - 1000
    sphere.position.y = 2000 * Math.random() - 1000
    sphere.position.z = 2000 * Math.random() - 1000
    spheres.add(sphere)
  }
  scene.add(spheres)
}

const getNearbyObjectsFor = (obj, group) => {
  let objs = []
  for (var j = 0; j < group.children.length; j++) {
    if (obj.uuid == group.children[j].uuid) continue

    var dist = obj.position.distanceTo(group.children[j].position)
    if (dist < CONNECT_DISTANCE) {
      objs.push(group.children[j])
    }
  }
  return objs
}

const init = container => {

  camera.position.z = 1000

  scene.fog = new FogExp2(0x000000, 0.0006)

  addSpheres()

  for (var i = 0; i < spheres.children.length; i++) {
    let obj = spheres.children[i]
    let near = getNearbyObjectsFor(obj, spheres)

    if (near.length == 0) continue

    let lines = Math.floor(MAX_CONNECT_LINES * Math.random())
    for (var k = 0; k < near.length && k <= lines; k++) {
      var lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(obj.position.x, obj.position.y, obj.position.z),
      )
      lineGeometry.vertices.push(
        new Vector3(near[k].position.x, near[k].position.y, near[k].position.z),
      )

      var g = new MeshLine()
      g.setGeometry(lineGeometry)
      g.verticesNeedUpdate = true
      var mesh = new Mesh(g.geometry, lineMaterial)

      scene.add(mesh)
    }
  }

  renderer.setPixelRatio( window.devicePixelRatio );
  //renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setSize(400, 400)
  container.appendChild( renderer.domElement );
}

const render = () => {

        var time = Date.now() * 0.00005;
        //optional: moving around mouse changes the camera animation
        //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        //camera.position.y += ( - mouseY - camera.position.y ) * 0.03;
        //camera.lookAt( scene.position );
        const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
        sphereMaterial.color.setHSL( h, 0.5, 0.5 );
        lineMaterial.uniforms.color.value = setHSL(h, 0.5, 0.5)

        renderer.render( scene, camera );
      }

export default class extends Component {

  componentDidMount() {
    init(this.container)
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
        requestAnimationFrame( animate );
        render();
  }

  render() {
    return (
      <div ref={c => this.container = c}>
      </div>
    )
  }
}
