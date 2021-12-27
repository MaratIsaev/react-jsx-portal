import React, {useLayoutEffect, useEffect, useRef, useState, useCallback} from "react";
import ReactDOM from "react-dom";

const DID_MOUNT_CUSTOM_EVENT = 'didMountCustomEvent'
const DID_UNMOUNT_CUSTOM_EVENT = 'didUnmountCustomEvent'
const ANCHOR_PROPS_DID_UPDATE_EVENT = 'anchorPropsDidUpdateEvent'
const PORTAL_MOUNTED_AND_NEEDS_ANCHOR_PROPS_EVENT = 'portalMountedAndNeedsAnchorPropsEvent'

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
        storeAnchors[id] = 0
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
        storePortals[id] = 0
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
    const { render, id } = props
    const elem = useRef(requireElem(id))
    const [mounted, setMounted] = useState(storeAnchors[id])
    const [anchorProps, setAnchorProps] = useState()

    useLayoutEffect(() => {
        const handleMount = () => setMounted(true)
        const handleUnmount = () => {
            setMounted(false)
            setAnchorProps()
        }
        const handleAnchorPropsUpdate = (e) => setAnchorProps(e.detail)

        elem.current.addEventListener(DID_MOUNT_CUSTOM_EVENT, handleMount)
        elem.current.addEventListener(DID_UNMOUNT_CUSTOM_EVENT, handleUnmount)
        elem.current.addEventListener(ANCHOR_PROPS_DID_UPDATE_EVENT, handleAnchorPropsUpdate)

        const portalMounetAndNeedsAnchor = new CustomEvent(PORTAL_MOUNTED_AND_NEEDS_ANCHOR_PROPS_EVENT)

        elem.current.dispatchEvent(portalMounetAndNeedsAnchor)

        registerPortal(id)

        return () => {
            elem.current.removeEventListener(DID_MOUNT_CUSTOM_EVENT, handleMount)
            elem.current.removeEventListener(DID_UNMOUNT_CUSTOM_EVENT, handleUnmount)
            elem.current.removeEventListener(ANCHOR_PROPS_DID_UPDATE_EVENT, handleAnchorPropsUpdate)

            unregisterPortal(id)

            releaseElem(id)
        }
    }, [])

    return mounted && anchorProps ? ReactDOM.createPortal(render(anchorProps), elem.current) : null
}

export const Anchor = (props) => {
    const { id } = props
    const ref = useRef(null)
    const elem = useRef(requireElem(id))
    const refProps = useRef(props)
    refProps.current = props

    const sendAnchorPropsToPortal = useCallback(() => {
        const anchorPropsDidUpdateEvent = new CustomEvent(ANCHOR_PROPS_DID_UPDATE_EVENT, { detail: refProps.current })

        elem.current.dispatchEvent(anchorPropsDidUpdateEvent)
    }, [])

    useEffect(() => {
        sendAnchorPropsToPortal()
    }, [props, sendAnchorPropsToPortal])

    useEffect(() => {
        elem.current.addEventListener(PORTAL_MOUNTED_AND_NEEDS_ANCHOR_PROPS_EVENT, sendAnchorPropsToPortal)

        ref.current.appendChild(elem.current)

        const customDidMountEvent = new CustomEvent(DID_MOUNT_CUSTOM_EVENT)

        elem.current.dispatchEvent(customDidMountEvent)

        registerAnchor(id)

        return () => {
            elem.current.removeEventListener(PORTAL_MOUNTED_AND_NEEDS_ANCHOR_PROPS_EVENT, sendAnchorPropsToPortal)

            const customDidUnmountEvent = new CustomEvent(DID_UNMOUNT_CUSTOM_EVENT)

            elem.current.dispatchEvent(customDidUnmountEvent)

            unregisterAnchor(id)

            releaseElem(id)
        }
    }, [])

    return React.createElement('div', { ref })
}