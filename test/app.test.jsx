import React, { useState } from 'react'
import { Anchor, Portal } from '../src'

const Counter = (props) => {
  const { count, setCount, onClose } = props

  return (
    <div id="counter">
      <div id="count">{count}</div>
      <button id="increase" onClick={() => setCount(count + 1)}>
        increase
      </button>
      <button id="decrease" onClick={() => setCount(count - 1)}>
        decrease
      </button>
      <button id="close" onClick={onClose}>
        close
      </button>
    </div>
  )
}

export const App = (props) => {
  const { initCount, anchorFirst, id, anchorVisible, portalVisible } = props
  const [isAnchorVisible, setIsAnchorVisible] = useState(anchorVisible)
  const [isPortalVisible, setIsPortalVisible] = useState(portalVisible)
  const [count, setCount] = useState(initCount)
  const handlePortalClose = () => setIsAnchorVisible(false)

  return (
    <div>
      <div>Counter</div>
      <button id="openAnchor" onClick={() => setIsAnchorVisible(true)}>
        openAnchor
      </button>
      <button id="openPortal" onClick={() => setIsPortalVisible(true)}>
        openPortal
      </button>
      <button id="closePortal" onClick={() => setIsPortalVisible(false)}>
        closePortal
      </button>
      {anchorFirst ? (
        <>
          {isAnchorVisible && <Anchor id={id} count={count} setCount={setCount} onClose={handlePortalClose} />}
          {isPortalVisible && (
            <Portal
              id={id}
              render={({ count, setCount, handlePortalClose }) => (
                <Counter count={count} setCount={setCount} onClose={handlePortalClose} />
              )}
            />
          )}
        </>
      ) : (
        <>
          {isPortalVisible && (
            <Portal
              id={id}
              render={({ count, setCount, handlePortalClose }) => (
                <Counter count={count} setCount={setCount} onClose={handlePortalClose} />
              )}
            />
          )}
          {isAnchorVisible && <Anchor id={id} count={count} setCount={setCount} onClose={handlePortalClose} />}
        </>
      )}
    </div>
  )
}
