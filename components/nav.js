import React from 'react'
import Link from 'next/link'

/*
const links = [
  { href: 'https://zeit.co/now', label: 'ZEIT' },
  { href: 'https://github.com/zeit/next.js', label: 'GitHub' },
].map(link => ({
  ...link,
  key: `nav-link-${link.href}-${link.label}`,
}))

<react:>
{links.map(({ key, href, label }) => (
<li key={key}>
<a href={href}>{label}</a>
</li>
))}
*/


const Nav = () => (
  <nav className="components-nav">
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
    </ul>
    <style jsx>{`
    `}</style>
  </nav>
)

export default Nav;
