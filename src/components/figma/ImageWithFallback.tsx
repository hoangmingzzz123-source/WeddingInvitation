import React, { useEffect, useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const DEFAULT_WEDDING_FALLBACK =
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [errorCount, setErrorCount] = useState(0)

  useEffect(() => {
    setErrorCount(0)
  }, [props.src, props.srcSet, props.fallbackSrc])

  const handleError = () => {
    setErrorCount((count) => count + 1)
  }

  const { src, srcSet, sizes, alt, style, className, fallbackSrc = DEFAULT_WEDDING_FALLBACK, ...rest } = props

  return errorCount > 1 ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Không thể tải ảnh" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img
      src={errorCount === 1 ? fallbackSrc : src}
      srcSet={errorCount === 0 ? srcSet : undefined}
      sizes={errorCount === 0 ? sizes : undefined}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={handleError}
    />
  )
}
