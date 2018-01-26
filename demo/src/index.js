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
          <ThreejsBallLineAnimation animateColor animateX />
        </div>
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
