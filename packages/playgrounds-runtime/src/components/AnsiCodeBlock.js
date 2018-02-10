// Packages
import { h } from 'preact'
import Anser from 'anser'
import colors from 'open-color'

const colorMap = {
  'ansi-bright-black': colors.gray[9],
  'ansi-black': colors.gray[9],
  'ansi-bright-red': colors.red[7],
  'ansi-red': colors.red[7],
  'ansi-bright-green': colors.green[7],
  'ansi-green': colors.green[7],
  'ansi-bright-yellow': colors.yellow[7],
  'ansi-yellow': colors.yellow[7],
  'ansi-bright-blue': colors.blue[7],
  'ansi-blue': colors.blue[7],
  'ansi-bright-magenta': colors.pink[7],
  'ansi-magenta': colors.pink[7],
  'ansi-bright-cyan': colors.cyan[7],
  'ansi-cyan': colors.cyan[7],
  'ansi-bright-white': colors.gray[9],
  'ansi-white': colors.gray[9],
}

const AnsiCodeBlock = ({ style, code }) => {
  const tokens = Anser.ansiToJson(code, {
    use_classes: true,
  })

  return (
    <pre
      style={{
        margin: 0,
        padding: 16,
        overflow: 'scroll',
        borderRadius: 2,
        ...style,
      }}
    >
      {tokens.map(token => (
        // eslint-disable-next-line
        <span
          style={{
            color: colorMap[token.fg] || colors.gray[9],
          }}
        >
          {token.content}
        </span>
      ))}
    </pre>
  )
}

export default AnsiCodeBlock
