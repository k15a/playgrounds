// Packages
import { h } from 'preact'
import colors from 'open-color'

// Files
import Iframe from './Iframe'

const Overlay = ({ children }) => (
  <Iframe
    title="Playgrounds Overlay"
    style={{
      position: 'absolute',
      zIndex: 2147483647,
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
      border: 'none',
      backgroundColor: colors.white,
    }}
  >
    <div
      style={{
        fontFamily: `-apple-system, BlinkMacSystemFont, ".SFNSText-Regular",
            "San Francisco", "Segoe UI", "Roboto", "Oxygen-Sans", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
            "Helvetica Neue", sans-serif`,
        color: colors.gray[9],
      }}
    >
      {children}
    </div>
  </Iframe>
)

export default Overlay
