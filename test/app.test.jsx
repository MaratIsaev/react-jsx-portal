import {Anchor, Portal} from '../src'
import React, {useState, useEffect} from 'react'

const items = [
    {
        name: 'Russia',
    },
    {
        name: 'France',
    },
    {
        name: 'Germany',
    },
    {
        name: 'Norway',
    },
    {
        name: 'Great Britain',
    }
]

const Details = (props) => {
    const { name, onClose, portalCount, appCount } = props
    const [count, setCount] = useState(0)

    useEffect(() => () => {
        onClose()
    }, [])

    return (
        <div className={`details ${name}`}>
            <button className="closeDetails" onClick={onClose}>Close</button>
            <h1>Name: {name}</h1>
            <div className={`appCounter ${name}`}>{appCount}</div>
            <div className={`cellCounter ${name}`}>{portalCount}</div>
            <div className={`detailsCounter ${name}`}>{count}</div>
            <button onClick={() => setCount(count + 1)} className={`detailsCountButton ${name}`}>counter</button>
        </div>
    )
}

const Cell = (props) => {
    const { name } = props
    const [isDetailsShown, setIsDetailsShown] = useState(false)
    const [count, setCount] = useState(0)

    return (
        <>
            <div className={`cell ${name}`} onClick={() => setIsDetailsShown(!isDetailsShown)}>{name}</div>
            <button className={`cellCountButton ${name}`} onClick={() => setCount(count + 1)}>counter</button>
            {isDetailsShown && <Portal id="details" render={({ appCount }) => (<Details name={name} appCount={appCount} portalCount={count} onClose={() => setIsDetailsShown(false)} />)} />}
        </>
    )
}

const showLastRenderPolicy = (content) => {
    const { length } = content

    if (length) {
        return [content[length - 1]]
    }

    return content
}

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="container">
            <button className="appCountButton" onClick={() => setCount(count + 1)}>counter</button>
            <div className="list">{items.map(({ name }) => <Cell name={name} key={name} />)}</div>
            <div className="detailsAnchor"><Anchor appCount={count} __renderPolicy={showLastRenderPolicy} id="details"/></div>
        </div>
    )
}

export default App
