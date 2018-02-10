// Packages
import { h, render, Component } from 'preact'
import { Provider } from 'preact-redux'

// Files
import store from '../store'

export default class Iframe extends Component {
  componentDidMount() {
    this.renderChild()
  }

  componentDidUpdate() {
    this.renderChild()
  }

  renderChild = () => {
    const [child] = this.props.children
    render(
      <Provider store={store}>{child}</Provider>,
      this.iframe.contentDocument.body,
    )
  }

  render() {
    return (
      <iframe
        {...this.props}
        title={this.props.title}
        ref={node => (this.iframe = node)}
      />
    )
  }
}
