import { useEffect, useRef, useState } from 'react'

export default function CopyButton({
  getText,
  children,
  className,
  ariaLabel,
  successLabel = '已复制',
  errorLabel = '复制失败，请重试'
}) {
  const [status, setStatus] = useState('idle')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  async function copy() {
    clearTimeout(timer.current)
    setStatus('pending')
    try {
      const text = getText()
      if (!text || !navigator.clipboard)
        throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setStatus('success')
    } catch (_) {
      setStatus('error')
    }
    timer.current = setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <button
      type='button'
      className={className}
      onClick={copy}
      aria-label={ariaLabel}
      disabled={status === 'pending'}
    >
      <span aria-live='polite'>
        {status === 'success'
          ? successLabel
          : status === 'error'
            ? errorLabel
            : status === 'pending'
              ? '复制中…'
              : children}
      </span>
    </button>
  )
}
