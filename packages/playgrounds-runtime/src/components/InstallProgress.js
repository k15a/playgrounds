// Packages
import { h } from 'preact'
import { connect } from 'preact-redux'
import colors from 'open-color'

// Files
import Overlay from './Overlay'

const css = (strings, ...values) => String.raw(strings, ...values)

const Progress = () => (
  <div
    style={{
      height: 8,
      width: 320,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: colors.gray[3],
    }}
  >
    <div
      style={{
        height: 8,
        width: 40,
        borderRadius: 5,
        backgroundColor: colors.blue[7],
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
  <Overlay>
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <div
          style={{
            height: 26,
            marginBottom: 16,
          }}
        >
          <Package /> Installing {installProgress.dependency || 'dependencies'}
        </div>

        <Progress />

        <div
          style={{
            height: 26,
            marginTop: 16,
          }}
        >
          {installProgress.step}
        </div>
      </div>
    </div>
  </Overlay>
)

const mapStateToProps = ({ installProgress }) => ({
  installProgress,
})

export default connect(mapStateToProps)(InstallProgress)
