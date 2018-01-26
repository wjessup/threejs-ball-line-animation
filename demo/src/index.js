import React, {Component} from 'react'
import {render} from 'react-dom'

import Example from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>threejs-ball-line-animation Demo</h1>
        <div style={{
            border: '1px dashed #000',
            width: '50%',
            height: '500px',
            padding: '1em',
            boxSizing: 'border-box',
          }}
        >
          <Example/>
        </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
