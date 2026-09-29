export function Arrow({ diagonal = false, ...props }) {
  return (
    <svg
      viewBox='0 0 24 24'
      width='20'
      height='20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.6'
      aria-hidden='true'
      {...props}
    >
      {diagonal ? (
        <path d='M6 18 18 6M6 6h12v12' />
      ) : (
        <path d='M4 12h15m-6-6 6 6-6 6' />
      )}
    </svg>
  )
}
export function SearchIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      width='19'
      height='19'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      aria-hidden='true'
    >
      <circle cx='10.5' cy='10.5' r='6.5' />
      <path d='m16 16 5 5' />
    </svg>
  )
}
