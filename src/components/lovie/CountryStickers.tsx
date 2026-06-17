// Inline-SVG country-sticker components for Lovie. Source is identical to
// /public/lovie/country-*.svg but rendered inline so the browser treats
// them as DOM vector graphics rather than rasterizable images. That fixes
// the soft/pixelated edges seen when used via <img src="*.svg"> (the
// drop-shadow filter rasterizes when an SVG is referenced as an image).

type StickerProps = React.SVGProps<SVGSVGElement>

export function CountryItaly(props: StickerProps) {
  return (
    <svg viewBox="0 0 508 584" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_d_1545_80)">
        <path d="M460.992 357.043C462.391 387.681 451.394 418.779 427.998 442.175L333.916 536.257C289.765 580.408 218.182 580.408 174.031 536.257C173.779 536.005 173.528 535.752 173.278 535.498L79.9462 442.165C56.5624 418.781 45.5642 387.703 46.9501 357.08V238.94H460.992V357.043Z" fill="black" />
        <mask id="mask0_1545_80" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="46" y="140" width="416" height="322">
          <path fillRule="evenodd" clipRule="evenodd" d="M79.9459 174.021C35.7949 218.172 35.7948 289.755 79.9459 333.906L173.291 427.251C173.536 427.501 173.783 427.75 174.031 427.998C218.182 472.149 289.765 472.149 333.916 427.998L427.998 333.916C472.149 289.765 472.149 218.182 427.998 174.031C383.847 129.88 312.264 129.88 268.113 174.031L253.977 188.167L239.831 174.021C195.68 129.87 124.097 129.87 79.9459 174.021Z" fill="#FF6000" />
        </mask>
        <g mask="url(#mask0_1545_80)">
          <rect x="47.4983" y="128.924" width="137.648" height="333.457" fill="#008C45" />
          <rect x="185.146" y="128.924" width="138.617" height="333.457" fill="#F4F9FF" />
          <rect x="323.764" y="128.924" width="137.648" height="333.457" fill="#DA291C" />
        </g>
      </g>
      <defs>
        <filter id="filter0_d_1545_80" x="33.1337" y="127.208" width="441.678" height="455.862" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="6.85" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1545_80" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1545_80" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

export function CountryPortugal(props: StickerProps) {
  return (
    <svg viewBox="0 0 508 593" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_d_1545_66)">
        <path d="M460.992 366.596C462.391 397.234 451.394 428.333 427.998 451.729L333.916 545.81C289.765 589.961 218.182 589.961 174.031 545.81C173.791 545.569 173.552 545.329 173.314 545.087L79.9462 451.719C56.5622 428.335 45.5641 397.256 46.9501 366.633V248.493H460.992V366.596Z" fill="black" />
        <mask id="mask0_1545_66" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="46" y="140" width="416" height="322">
          <path fillRule="evenodd" clipRule="evenodd" d="M79.9458 174.021C35.7947 218.172 35.7947 289.755 79.9457 333.906L173.307 427.267C173.547 427.511 173.788 427.755 174.031 427.998C218.182 472.149 289.765 472.149 333.916 427.998L427.998 333.916C472.149 289.765 472.149 218.182 427.998 174.031C383.847 129.88 312.264 129.88 268.113 174.031L253.977 188.167L239.831 174.021C195.68 129.87 124.097 129.87 79.9458 174.021Z" fill="#FF6000" />
        </mask>
        <g mask="url(#mask0_1545_66)">
          <rect x="47.4983" y="140.556" width="162.851" height="323.764" fill="#008C45" />
          <rect x="210.35" y="140.556" width="251.062" height="323.764" fill="#DA291C" />
        </g>
      </g>
      <defs>
        <filter id="filter0_d_1545_66" x="33.1337" y="127.208" width="441.678" height="465.415" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="6.85" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1545_66" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1545_66" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}

export function CountrySpain(props: StickerProps) {
  return (
    <svg viewBox="0 0 508 593" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_d_1545_95)">
        <path d="M460.992 366.596C462.391 397.234 451.394 428.333 427.998 451.729L333.916 545.811C289.765 589.961 218.182 589.961 174.031 545.811C173.793 545.572 173.556 545.333 173.32 545.094L79.9462 451.719C56.5622 428.335 45.564 397.256 46.9501 366.633V248.493H460.992V366.596Z" fill="black" />
        <mask id="mask0_1545_95" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="46" y="140" width="416" height="322">
          <path fillRule="evenodd" clipRule="evenodd" d="M79.9458 174.021C35.7948 218.172 35.7947 289.755 79.9458 333.906L173.302 427.262C173.543 427.508 173.786 427.753 174.031 427.998C218.182 472.149 289.765 472.149 333.916 427.998L427.998 333.916C472.149 289.765 472.149 218.182 427.998 174.031C383.847 129.88 312.264 129.88 268.113 174.031L253.977 188.167L239.831 174.021C195.68 129.87 124.097 129.87 79.9458 174.021Z" fill="#FF6000" />
        </mask>
        <g mask="url(#mask0_1545_95)">
          <rect x="47.4983" y="141.525" width="413.913" height="76.9228" fill="#DA291C" />
          <rect x="47.4983" y="384.489" width="413.913" height="76.9228" fill="#DA291C" />
          <rect x="47.4983" y="218.448" width="413.913" height="166.041" fill="#FCD335" />
        </g>
      </g>
      <defs>
        <filter id="filter0_d_1545_95" x="33.1337" y="127.825" width="441.678" height="464.798" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="6.85" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1545_95" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1545_95" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
