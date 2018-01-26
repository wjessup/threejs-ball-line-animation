import React, {Component} from 'react'
import {render} from 'react-dom'

import ThreejsBallLineAnimation from '../../src'

class Demo extends Component {

  render() {
    return <div>
      <h1>Threejs ball line animation Demo</h1>
      <div
        style={{
          border: '1px dashed #000',
          width: '50%',
          height: '500px',
          padding: '1em',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            background: '#000',
            height: '100%'
          }}
        >
          <ThreejsBallLineAnimation
            animateColor
            animateX
          />
        </div>
      </div>
    <h2>Custom attributes</h2>
    <ul>
      <li>numSpheres: number of spheres to draw (default: 100)</li>
      <li>diameter: sphere diameter (default: 40)</li>
      <li>maxConnectDistance: if distances between spheres is less than this value a line will get drawn (defaul: 400)</li>
      <li>maxConnectLines: maximum number of lines from each sphere (default: 4)</li>
      <li>lineWidth: width of lines connecting spheres (default: 8)</li>
      <li>animateColor: whether or not the colors should change (default: false)</li>
      <li>animateX: animate over the x-axis (default: false)</li>
      <li>animateY: animate over the y-axis (default: false)</li>
      <li>moveX: speed at which animation over x-axis changes (default: 0.5)</li>
      <li>moveY: speed at which animation over y-axis changes (default: 0.5)</li>
      <li>sphereColor: initial color for spheres (default: #800080 - purple)</li>
      <li>lineolor: initial color for lines between spheres (default: #800080 - purple)</li>
    </ul>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
