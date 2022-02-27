import React, { useLayoutEffect, useEffect, useRef, useReducer, useState } from 'react'
import ReactDOM from 'react-dom'
import { v4 as uuidv4 } from 'uuid'

const Anchors = {}
const Portals = {}

export const Anchor = (props) => {
  const { id, __renderPolicy = (content) => content, ...anchorProps } = props
  const [isAnchorRegistered, setIsAnchorRegistered] = useState(false)
  const [, forceUpdate] = useReducer(() => ({}), {})
  const { current: anchorUUID } = useRef(uuidv4())
  const ref = useRef(null)
  const anchor = useRef({ anchorUUID, forceUpdate, allowedPortalsUUID: [] }) // allowedPortalsUUID - порталы, которые нужно отрендерить в Anchor, после применения к списку Portals __renderPolicy

  anchor.current.props = anchorProps

  useEffect(() => {
    const portals = Portals[id] || []
    anchor.current.allowedPortalsUUID = __renderPolicy(portals).map((portal) => portal.portalUUID)
    anchor.current.container = ref.current

    if (Anchors[id]) {
      Anchors[id].push(anchor.current)
    } else {
      Anchors[id] = [anchor.current]
    }

    setIsAnchorRegistered(true)

    return () => {
      Anchors[id] = Anchors[id].filter((anchor) => anchor.anchorUUID !== anchorUUID)

      if (!Anchors[id].length) {
        delete Anchors[id]
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (isAnchorRegistered && Portals[id]) {
      const portals = Portals[id] || []
      anchor.current.allowedPortalsUUID = __renderPolicy(portals).map((portal) => portal.portalUUID)

      Portals[id].forEach((portal) => portal.forceUpdate())
    }
  })

  return React.createElement('div', { ref })
}

export const Portal = (props) => {
  const { render: Component, id, __meta } = props
  const { current: portalUUID } = useRef(uuidv4())
  const [, forceUpdate] = useReducer(() => ({}), {})
  const [isPortalRegistered, setIsPortalRegistered] = useState(false)

  // прежде, чем что-либо рендерить все компоненты Anchor и Portal должны быть зарегистрированы
  useLayoutEffect(() => {
    const portal = { portalUUID, forceUpdate, __meta }

    if (Portals[id]) {
      Portals[id].push(portal)
    } else {
      Portals[id] = [portal]
    }

    // запускаем Anchors чтобы они применили свои __renderPolicy, до того как мы порталируем в них своё содержимое
    if (Anchors[id]) {
      Anchors[id].forEach((Anchor) => Anchor.forceUpdate())
    }

    setIsPortalRegistered(true)

    return () => {
      Portals[id] = Portals[id].filter((portal) => portal.portalUUID !== portalUUID)

      if (!Portals[id].length) {
        delete Portals[id]
      }
    }
  }, [])

  // если портал не зарегистрирован, то ничего не рендерим
  if (!isPortalRegistered) {
    return null
  }

  // если нет соответствующего Anchor, то ничего не рендерим
  if (!Anchors[id]) {
    return null
  }

  return Anchors[id].map((Anchor) => {
    const { container, props, allowedPortalsUUID } = Anchor

    return allowedPortalsUUID.includes(portalUUID) ? ReactDOM.createPortal(Component(props), container) : null
  })
}
