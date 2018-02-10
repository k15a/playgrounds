// Packages
import { h } from 'preact'
import { connect } from 'preact-redux'
import colors from 'open-color'

// Files
import AnsiCodeBlock from './AnsiCodeBlock'
import Overlay from './Overlay'

const CompileError = ({ compileError }) => {
  const [filename] = compileError.match(/\.(\/[^/\n ]+)+\.[^/\n\s]+/) || []
  const [, lineNumber, columnNumber] =
    compileError.match(/\((\d+):(\d+)\)/) || []

  const openEditor = () =>
    fetch(
      `/__playgrounds__/open-editor?filename=${filename}&lineNumber=${lineNumber}&columnNumber=${columnNumber}`,
    )

  const codeBlock = (
    <AnsiCodeBlock
      code={compileError}
      style={{
        backgroundColor: colors.red[0],
      }}
    />
  )

  return (
    <Overlay>
      <div
        style={{
          height: '100%',
          width: 'calc(100% - 64px)',
          maxWidth: 960,
          margin: '16px auto',
        }}
      >
        <h1
          style={{
            color: colors.red[6],
            fontSize: 24,
            fontWeight: 'normal',
          }}
        >
          Failed to compile
        </h1>

        {filename ? (
          <button
            type="button"
            onClick={openEditor}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              width: '100%',
              textAlign: 'left',
              cursor: 'pointer',
              outline: 'none',
              fontSize: '1em',
              userSelect: 'text',
            }}
          >
            {codeBlock}
          </button>
        ) : (
          codeBlock
        )}
      </div>
    </Overlay>
  )
}

const CompileErrors = ({ compileErrors }) => (
  <CompileError compileError={compileErrors[0].replace(/^ @ .*$/gm, '')} />
)

const mapStateToProps = ({ compileErrors }) => ({
  compileErrors,
})

export default connect(mapStateToProps)(CompileErrors)
