import { h } from 'preact'
import { connect } from 'preact-redux'

const css = (strings, ...values) => String.raw(strings, ...values)

const Progress = () => (
  <div
    style={{
      height: 8,
      width: 320,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: '#dee2e6',
    }}
  >
    <div
      style={{
        height: 8,
        width: 40,
        borderRadius: 5,
        backgroundColor: '#1c7ed6',
        animation: 'infinite-progress 2s infinite',
      }}
    />
    <style>
      {css`
        @keyframes infinite-progress {
          from {
            transform: translateX(-40px);
          }
          to {
            transform: translateX(320px);
          }
        }
      `}
    </style>
  </div>
)

const Package = () => (
  <span role="img" aria-label="Package Emoji">
    📦
  </span>
)

const InstallProgress = ({ installProgress }) => (
  <div
    style={{
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: '#495057',
    }}
  >
    <div>
      <div style={{ height: 26, marginBottom: 16 }}>
        <Package /> Installing {installProgress.dependency || 'dependencies'}
      </div>

      <Progress />

      <div style={{ height: 26, marginTop: 16 }}>{installProgress.step}</div>
    </div>
  </div>
)

const mapStateToProps = ({ installProgress }) => ({
  installProgress,
})

export default connect(mapStateToProps)(InstallProgress)
