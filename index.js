import React, {useLayoutEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";

const DID_MOUNT_CUSTOM_EVENT = 'didMountCustomEvent'

const storeElems = {}

const storeAnchors = {}

const storePortals = {}

const requireElem = (id) => {
    if (!storeElems[id]) {
        const div = document.createElement('div')

        div.dataset.id = id

        storeElems[id] = div
    }

    return storeElems[id]
}

const releaseElem = (id) => {
    if (!storeAnchors[id] && !storePortals[id]) {
        delete storeElems[id]
    }
}

const registerAnchor = (id) => {
    if (!storeAnchors[id]) {
        storeAnchors[id] = 1
    }

    storeAnchors[id] += 1
}

const unregisterAnchor = (id) => {
    if (storeAnchors[id]) {
        storeAnchors[id] -= 1
    }

    if (storeAnchors[id] === 0) {
        delete storeAnchors[id]
    }
}

const registerPortal = (id) => {
    if (!storePortals[id]) {
        storePortals[id] = 1
    }

    storePortals[id] += 1
}

const unregisterPortal = (id) => {
    if (storePortals[id]) {
        storePortals[id] -= 1
    }

    if (storePortals[id] === 0) {
        delete storePortals[id]
    }
}

export const Portal = (props) => {
    const { children, id } = props
    const elem = useRef(requireElem(id))
    const [mounted, setMounted] = useState(storeAnchors[id])

    useLayoutEffect(() => {
        const handleMount = () => setMounted(true)

        elem.current.addEventListener(DID_MOUNT_CUSTOM_EVENT, handleMount)

        registerPortal(id)

        return () => {
            elem.current.removeEventListener(DID_MOUNT_CUSTOM_EVENT, handleMount)

            unregisterPortal(id)

            releaseElem(id)
        }
    }, [])

    return mounted ? ReactDOM.createPortal(children, elem.current) : null
}

export const Anchor = (props) => {
    const { id, ...restProps } = props
    const ref = useRef(null)
    const elem = useRef(requireElem(id))

    useLayoutEffect(() => {
        ref.current.appendChild(elem.current)

        const customDidMountEvent = new CustomEvent(DID_MOUNT_CUSTOM_EVENT)

        elem.current.dispatchEvent(customDidMountEvent)

        registerAnchor(id)

        return () => {
            unregisterAnchor(id)

            releaseElem(id)
        }
    }, [])

    return React.createElement('div', { ref, ...restProps })
}