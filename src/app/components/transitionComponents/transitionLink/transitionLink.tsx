import { usePageTransition } from "@/app/store/usePageTransition";
import Link from "next/link";
import { useRouter } from "next/navigation";
export const TransitionLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { triggerPageTransition } = usePageTransition();

  return (
    <Link
      href={href}
      onClick={() => triggerPageTransition(() => router.push(href))}
    >
      {children}
    </Link>
  );
};
