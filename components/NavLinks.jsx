import Link from "next/link"

const links = [
  { href:'/chat', label:'chat' },
  { href:'/tours', label:'tours' },
  { href:'/tours/new-tour', label:'new tour' },
  { href:'/profile', label:'profile' },
  { href: '/portfolio', label: 'portfolio' },
  { href: '/prices', label: 'prices'}
]

const NavLinks = () => {
  return (
    <ul className='menu text-base-content flex flex-grow w-full'>
      {links.map((link) => (
        <li key={link.href} className='mb-4'>
          <Link href={link.href}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default NavLinks
