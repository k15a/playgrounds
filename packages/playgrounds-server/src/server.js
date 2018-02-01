// Native
const path = require('path')

// Packages
const express = require('express')
const parse5 = require('parse5')
const fs = require('fs-extra')
const mime = require('mime')
const getPort = require('get-port')
const history = require('connect-history-api-fallback')

// Files
const WebpackMiddleware = require('./WebpackMiddleware')
const PackageInstaller = require('./PackageInstaller')

async function server({ projectDir, sourceDir }) {
  const installer = new PackageInstaller(projectDir)
  const app = express()
  const port = await getPort({
    port: 1337,
  })

  app.use(WebpackMiddleware({ projectDir, sourceDir, installer }))

  app.get('/__playgrounds__/runtime.js', (req, res) => {
    return res.sendFile(require.resolve('@playgrounds/runtime'))
  })

  app.get('/__playgrounds__/install-progress', (req, res) => {
    res.set('Content-Type', 'text/event-stream')
    res.set('Cache-Control', 'no-cache')
    res.set('Connection', 'keep-alive')

    res.write('\n')

    const unsubscribe = installer.watch(message => {
      const payload = JSON.stringify(message)
      res.write(`data: ${payload}\n\n`)
    })

    const heartbeat = setInterval(() => {
      res.write('data: ❤️\n\n')
    }, 10000)

    req.on('close', () => {
      unsubscribe()
      clearInterval(heartbeat)
    })
  })

  app.use(history())

  app.get('*.html', async (req, res, next) => {
    const filePath = path.join(sourceDir, req.path)

    if (await fileExists(filePath)) {
      const file = await fs.readFile(filePath, 'utf-8')
      const doc = processDoc(parse5.parse(file))
      const html = parse5.serialize(doc)

      res.set('Content-Type', mime.getType(req.path))
      res.set('Content-Length', html.length)
      return res.send(html)
    }

    return next()
  })

  app.use(express.static(sourceDir))

  app.listen(port)

  return port
}

async function fileExists(filePath) {
  if (await fs.exists(filePath)) {
    const stats = await fs.lstat(filePath)
    return stats.isFile()
  }

  return false
}

function mapNodes(node, mapper) {
  const { childNodes, ...newNode } = mapper(node)

  if (childNodes) {
    return {
      ...newNode,
      childNodes: childNodes.map(currentNode => mapNodes(currentNode, mapper)),
    }
  }

  return newNode
}

function processDoc(doc) {
  return mapNodes(doc, node => {
    if (node.nodeName === 'body') {
      return {
        ...node,
        childNodes: [
          {
            nodeName: 'script',
            tagName: 'script',
            attrs: [
              {
                name: 'src',
                value: '/__playgrounds__/runtime.js',
              },
            ],
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            childNodes: [],
          },
          ...node.childNodes,
        ],
      }
    }

    if (node.nodeName === 'link') {
      const isStylesheet = node.attrs.find(
        attr => attr.name === 'rel' && attr.value === 'stylesheet',
      )
      const source = node.attrs.find(attr => attr.name === 'href')

      if (isStylesheet && source) {
        return {
          ...node,
          nodeName: 'script',
          tagName: 'script',
          attrs: [
            ...node.attrs.filter(
              attr => attr.name !== 'rel' && attr.name !== 'href',
            ),
            {
              name: 'src',
              value: source.value,
            },
          ],
        }
      }
    }

    return node
  })
}

module.exports = server
