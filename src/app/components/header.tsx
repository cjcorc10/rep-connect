import Link from "next/link";
import Nav from "./nav/nav";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-8 h-12 mt-1">
      <h1 className="display-d2">
        <Link href="/">
          {" "}
          <Image
            src="/images/people.svg"
            alt="Repconnect logo"
            width={40}
            height={20}
            className="inline-block mr-2"
          />
          <span className="hidden sm:inline"> 
          Repconnect
          </span>
        </Link>
      </h1>
      <Nav />
    </header>
  );
}
