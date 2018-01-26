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
const SPHERES = 100
const MAX_CONNECT_DISTANCE = 400
const SPHERE_DIAMETER = 40
const LINE_WIDTH = 8

const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2,3000)
camera.position.z = 1000
const scene = new Scene()
scene.fog = new FogExp2(0x000000, 0.0006)
const renderer = new WebGLRenderer();
const sphereMaterial = new MeshBasicMaterial({ color: new Color('purple') })
const spheres = new Group()

let myReq
let lineMaterial

const addSpheres = (howMany, diameter) => {
  for (var i = 0; i < howMany; i++) {
    var geometry = new SphereGeometry(diameter, 32, 32)
    var sphere = new Mesh(geometry, sphereMaterial)

    sphere.position.x = 2000 * Math.random() - 1000
    sphere.position.y = 2000 * Math.random() - 1000
    sphere.position.z = 2000 * Math.random() - 1000
    spheres.add(sphere)
  }
  scene.add(spheres)
}

const init = ({ container, howMany, diameter,  maxConnectDistance }) => {

  lineMaterial = new MeshLineMaterial({
    lineWidth: LINE_WIDTH,
    color: new Color('purple'),
  })

  addSpheres(howMany, diameter)

  for (let i = 0; i < spheres.children.length; i++) {
    const obj = spheres.children[i]
    const near = getNearbyObjectsFor(obj, spheres, maxConnectDistance)

    if (near.length == 0) continue

    let lines = Math.floor(MAX_CONNECT_LINES * Math.random())
    for (let k = 0; k < near.length && k <= lines; k++) {
      const lineGeometry = new Geometry()
      lineGeometry.vertices.push(new Vector3(obj.position.x, obj.position.y, obj.position.z))
      lineGeometry.vertices.push(new Vector3(near[k].position.x, near[k].position.y, near[k].position.z))
      const g = new MeshLine()
      g.setGeometry(lineGeometry)
      g.verticesNeedUpdate = true
      const mesh = new Mesh(g.geometry, lineMaterial)
      scene.add(mesh)
    }
  }

  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(renderer.domElement)
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
    const {
      howMany = SPHERES,
      diameter = SPHERE_DIAMETER,
      maxConnectDistance = MAX_CONNECT_DISTANCE,
    } = this.props
    init({
      container: this.container,
      howMany,
      diameter,
      maxConnectDistance,
    })
    animate()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(myReq)
  }

  render() {
    return <div
      ref={c => this.container = c}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  }
}
