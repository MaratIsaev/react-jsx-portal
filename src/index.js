import React, { useLayoutEffect, useEffect, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'

const anchorsRenderFuncs = {}

const registerAnchorRenderFunc = (id, renderFunc) => {
  const renderFuncs = anchorsRenderFuncs[id] || []

  renderFuncs.push(renderFunc)

  anchorsRenderFuncs[id] = renderFuncs
}

const unregisterAnchorRenderFunc = (id, renderFunc) => {
  anchorsRenderFuncs[id] = anchorsRenderFuncs[id].filter((f) => f !== renderFunc)

  if (!anchorsRenderFuncs[id].length) {
    delete anchorsRenderFuncs[id]
  }
}

const portalsContent = {}

const updateAnchors = (id) => {
  if (anchorsRenderFuncs[id]) {
    anchorsRenderFuncs[id].forEach((render) => render(portalsContent[id]))
  }
}

const registerPortal = (id, Component, __meta) => {
  const idContent = portalsContent[id] || []

  idContent.push({ Component, key: uuidv4(), __meta })

  portalsContent[id] = idContent

  updateAnchors(id)
}

const unregisterPortal = (id, Component) => {
  portalsContent[id] = portalsContent[id].filter((c) => c.Component !== Component)

  if (!portalsContent[id].length) {
    delete portalsContent[id]
  }

  updateAnchors(id)
}

export const Portal = (props) => {
  const { render: Component, id, __meta } = props

  const compRef = useRef(Component)

  compRef.current = Component

  const comp = useCallback((...args) => compRef.current(...args), [])

  useLayoutEffect(() => {
    registerPortal(id, comp, __meta)

    return () => {
      unregisterPortal(id, comp)
    }
  }, [])

  useLayoutEffect(() => {
    updateAnchors(id)
  })

  return null
}

export const Anchor = (props) => {
  const { id, __renderPolicy = (content) => content } = props
  const ref = useRef(null)
  const refProps = useRef(props)
  refProps.current = props

  const render = useCallback((portalsContent = []) => {
    if (ref.current) {
      ReactDOM.render(<>{__renderPolicy(portalsContent).map(({ Component, key }) => <Component {...refProps.current} key={key} />)}</>, ref.current)
    }
  }, [])

  useEffect(() => {
    render(portalsContent[id])
  }, [props])

  useEffect(() => {
    registerAnchorRenderFunc(id, render)

    return () => {
      unregisterAnchorRenderFunc(id, render)
    }
  })

  return React.createElement('div', { ref })
}
