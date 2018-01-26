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
const MAX_X_LIMIT = 2000
const MAX_Y_LIMIT = 2000

let myReq,
  camera,
  scene,
  renderer,
  sphereMaterial,
  spheres,
  lineMaterial,
  animations = {
    color: false,
    x: false,
    y: false,
  },
  movementX = 0.5,
  movementY = 0.5

const addSpheres = (howMany, diameter) => {
  for (let i = 0; i < howMany; i++) {
    const geometry = new SphereGeometry(diameter, 32, 32)
    const sphere = new Mesh(geometry, sphereMaterial)
    sphere.position.x = 2000 * Math.random() - 1000
    sphere.position.y = 2000 * Math.random() - 1000
    sphere.position.z = 2000 * Math.random() - 1000
    spheres.add(sphere)
  }
  scene.add(spheres)
}

const init = ({
  container,
  howMany,
  diameter,
  maxConnectDistance,
  maxConnectLines,
  lineWidth,
}) => {
  scene = new Scene()
  scene.fog = new FogExp2(0x000000, 0.0006)

  sphereMaterial = new MeshBasicMaterial({ color: new Color('purple') })
  spheres = new Group()

  lineMaterial = new MeshLineMaterial({
    lineWidth,
    color: new Color('purple'),
  })

  addSpheres(howMany, diameter)

  for (let i = 0; i < spheres.children.length; i++) {
    const obj = spheres.children[i]
    const near = getNearbyObjectsFor(obj, spheres, maxConnectDistance)

    if (near.length == 0) continue

    let lines = Math.floor(maxConnectLines * Math.random())
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

  camera = new PerspectiveCamera(55, container.offsetWidth / container.offsetHeight, 2, 3000)
  camera.position.z = 1000

  renderer = new WebGLRenderer({
    canvas: container,
    preserveDrawingBuffer: true,
    alpha: true,
    antialias: true,
  })
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.setClearColor(0x000000, 0)
}


const render = () => {
  //optional: moving around mouse changes the camera animation
  if (animations.y) {
    camera.position.y += movementY
    if (camera.position.y > MAX_Y_LIMIT || camera.position.y < -MAX_Y_LIMIT) {
      movementY = -movementY
    }
  }
  if (animations.x) {
    camera.position.x += movementX
    if (camera.position.x > MAX_X_LIMIT || camera.position.x < -MAX_X_LIMIT) {
      movementX = -movementX
    }
  }
  camera.lookAt( scene.position )
  if (animations.color) {
    const time = Date.now() * 0.00005
    const h = ( 360 * ( 1.0 + time ) % 360 ) / 360
    sphereMaterial.color.setHSL( h, 0.5, 0.5 )
    lineMaterial.uniforms.color.value = setHSL(h, 0.5, 0.5)
  }

  renderer.render(scene, camera)
}

const animate = () => {
  myReq = window.requestAnimationFrame(animate)
  render()
}

export default class extends Component {

  componentDidMount() {
    const {
      howMany = SPHERES,
      diameter = SPHERE_DIAMETER,
      maxConnectDistance = MAX_CONNECT_DISTANCE,
      maxConnectLines = MAX_CONNECT_LINES,
      lineWidth = LINE_WIDTH,
      animateColor = false,
      animateX = false,
      animateY = false,
      moveX = 0.5,
      moveY = 0.5
    } = this.props
    animations = {
      color: animateColor,
      x: animateX,
      y: animateY
    }
    movementX = moveX
    movementY = moveY
    init({
      container: this.container,
      howMany,
      diameter,
      maxConnectDistance,
      maxConnectLines,
      lineWidth,
    })
    animate()
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(myReq)
  }

  render() {
    return <canvas
      ref={c => this.container = c}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  }
}
