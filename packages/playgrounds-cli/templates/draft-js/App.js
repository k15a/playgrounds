import React, { Component } from 'react'
import { Editor, EditorState } from 'draft-js'
import { render } from 'react-dom'

class App extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  }

  onChange = editorState => {
    this.setState({
      editorState,
    })
  }

  render() {
    return (
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
    )
  }
}

render(<App />, document.getElementById('root'))
