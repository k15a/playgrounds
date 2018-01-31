import React from 'react'
import styled from 'styled-components'
import { render } from 'react-dom'

const Heading = styled.h1`
  color: rebeccapurple;
`

const App = () => <Heading>Hello World</Heading>

render(<App />, document.getElementById('root'))
