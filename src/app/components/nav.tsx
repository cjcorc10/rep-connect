'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { usePathname } from 'next/navigation';

const Links = [
  { href: '/', label: 'Home' },
  // { href: '/about', label: 'About' },
  // { href: '/login', label: 'Sign in' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="h-full">
      <ul className="flex  space-x-8 h-full ">
        {Links.map((link) => (
          <li
            key={link.href}
            className={clsx(
              'text-lg hover:text-black relative flex items-center transition font-bold',
              {
                'text-black': path == link.href,
                'text-gray-800/70': path != link.href,
              }
            )}
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
