import { h, render, Component } from 'preact'

export default class Iframe extends Component {
  componentDidMount() {
    this.renderChild()
  }

  componentDidUpdate() {
    this.renderChild()
  }

  renderChild = () => {
    const [child] = this.props.children
    render(child, this.iframe.contentDocument.body)
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
