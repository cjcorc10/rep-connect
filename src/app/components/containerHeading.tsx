import { motion } from "framer-motion";

export default function ContainerHeading({
  children,
  isSenate,
}: {
  children?: React.ReactNode;
  isSenate: boolean;
}) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: 10}}
      animate={{ opacity: 1, y: 0}}
      transition={{ duration: 0.5, delay: 0.2  }}
    className="z-30">
      <h2 className="text-[2rem] font-bold text-gray-800">
        U.S. {isSenate ? "Senate" : "House of Representatives"}
      </h2>
      {children}
    </motion.header>
  );
}
