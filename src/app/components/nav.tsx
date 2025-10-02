import Link from 'next/link';

const Links = [
  { href: '/', label: 'Home' },
  // { href: '/about', label: 'About' },
  // { href: '/login', label: 'Sign in' },
];

export default function Nav() {
  // const path = usePathname();
  return (
    <nav className="h-full">
      <ul className="flex  space-x-8 h-full ">
        {Links.map((link) => (
          <li
            key={link.href}
            className={
              'text-lg hover:text-black relative flex items-center transition font-bold'
            }
          >
            <Link href={link.href}>{link.label}</Link>
            {/* {path == link.href && (
              <motion.div
                layoutId="active-link-id"
                className="w-full h-1 bg-accent absolute bottom-[-3] rounded-full"
              ></motion.div>
            )} */}
          </li>
        ))}
      </ul>
    </nav>
  );
}
