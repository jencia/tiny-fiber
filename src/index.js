import React from './react'
import ReactDOM from './react-dom'

const jsx = (
    <div id="a1">
        <div id="b1">
            <div id="c1" />
            <div id="c2" />
        </div>
        <div id="b2" />
    </div>
)

ReactDOM.render(jsx, document.getElementById('root'))
