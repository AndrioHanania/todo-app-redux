

import { eventBusService } from "../services/event-bus.service.js"

const { useState, useEffect, useRef } = React

export function UserMsg() {

    const [msg, setMsg] = useState(null)
    const timeoutIdRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBusService.on('show-user-msg', (msg) => {
            console.log('Got msg', msg)
            setMsg(msg)
            // window.scrollTo({top: 0, behavior: 'smooth'});
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
                timeoutIdRef.current = null
            }
            timeoutIdRef.current = setTimeout(closeMsg, 3000)
        })
        return unsubscribe
    }, [])

    function closeMsg() {
        setMsg(null)
    }

    if (!msg) return null

    return (
        <section className={"user-msg " + msg.type}>
            <p>{msg.txt}</p>
        </section>
    )
}
