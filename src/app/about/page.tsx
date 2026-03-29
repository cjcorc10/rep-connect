import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | RepConnect",
  description:
    "Learn how RepConnect helps you find and contact your federal representatives with source-based information.",
};

export default function Page() {
  return <AboutClient />;
}

