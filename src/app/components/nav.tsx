"use client";
import clsx from "clsx";
import Link from "next/link";

import { usePathname } from "next/navigation";

const Links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  // { href: '/login', label: 'Sign in' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav>
      <ul className="flex space-x-8">
        {Links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={clsx(
                "text-white text-lg",
                path === link.href && "font-bold",
                link.href === "/login" &&
                  "border border-gray-300 rounded-lg px-3 py-1 hover:bg-gray-100"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
