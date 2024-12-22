
const { useEffect, useRef } = React

export function useEffectUpdate(cb, dep) {

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        cb()
    }, dep)
}