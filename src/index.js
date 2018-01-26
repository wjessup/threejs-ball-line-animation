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
import {
  hue2rgb,
  setHSL,
  getNearbyObjectsFor,
} from './utils'

const MAX_CONNECT_LINES = 4
const NUM_SPHERES = 100
const SPHERE_DIAMETER = 40
const LINE_WIDTH = 8

let myReq

const renderer = new WebGLRenderer();
const sphereMaterial = new MeshBasicMaterial({ color: new Color('purple') })
const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2,3000)
const scene = new Scene()
const spheres = new Group()
const lineMaterial = new MeshLineMaterial({
  lineWidth: LINE_WIDTH,
  color: new Color('purple'),
})

const addSpheres = (howMany) => {
  for (var i = 0; i < howMany; i++) {
    var geometry = new SphereGeometry(SPHERE_DIAMETER, 32, 32)
    var sphere = new Mesh(geometry, sphereMaterial)

    sphere.position.x = 2000 * Math.random() - 1000
    sphere.position.y = 2000 * Math.random() - 1000
    sphere.position.z = 2000 * Math.random() - 1000
    spheres.add(sphere)
  }
  scene.add(spheres)
}

const init = ({ container, howMany }) => {

  camera.position.z = 1000

  scene.fog = new FogExp2(0x000000, 0.0006)

  addSpheres(howMany)

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
  const time = Date.now() * 0.00005;
  //optional: moving around mouse changes the camera animation
  //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  //camera.position.y += ( - mouseY - camera.position.y ) * 0.03;
  //camera.position.x = camera.position.x + 1
  //camera.lookAt( scene.position );
  const h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
  sphereMaterial.color.setHSL( h, 0.5, 0.5 );
  lineMaterial.uniforms.color.value = setHSL(h, 0.5, 0.5)

  renderer.render( scene, camera );
}

const animate = () => {
  myReq = window.requestAnimationFrame(animate);
  render()
}

export default class extends Component {

  componentDidMount() {
    const { howMany=NUM_SPHERES } = this.props
    init({
      container: this.container,
      howMany,
    })
    animate()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(myReq)
  }

  render() {
    return <div ref={c => this.container = c} />
  }
}
