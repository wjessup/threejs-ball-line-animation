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
const DEFAULT_COLOR = '#800080'
const DEFAULT_MOVEMENT = 0.5

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
  movement = {
    x: DEFAULT_MOVEMENT,
    y: DEFAULT_MOVEMENT,
  }

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
  sphereColor,
  lineColor,
}) => {
  scene = new Scene()
  scene.fog = new FogExp2(0x000000, 0.0006)

  sphereMaterial = new MeshBasicMaterial({ color: new Color(sphereColor) })
  spheres = new Group()

  lineMaterial = new MeshLineMaterial({
    lineWidth,
    color: new Color(lineColor),
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
  if (animations.y) {
    camera.position.y += movement.y
    if (camera.position.y > MAX_Y_LIMIT || camera.position.y < -MAX_Y_LIMIT) {
      movement.y = -movement.y
    }
  }
  if (animations.x) {
    camera.position.x += movement.x
    if (camera.position.x > MAX_X_LIMIT || camera.position.x < -MAX_X_LIMIT) {
      movement.x = -movement.x
    }
  }
  camera.lookAt(scene.position)
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
      moveX = DEFAULT_MOVEMENT,
      moveY = DEFAULT_MOVEMENT,
      sphereColor = DEFAULT_COLOR,
      lineColor = DEFAULT_COLOR,
    } = this.props
    animations = {
      color: animateColor,
      x: animateX,
      y: animateY,
    }
    movement = {
      x: moveX,
      y: moveY,
    }
    init({
      container: this.container,
      howMany,
      diameter,
      maxConnectDistance,
      maxConnectLines,
      lineWidth,
      sphereColor,
      lineColor,
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
