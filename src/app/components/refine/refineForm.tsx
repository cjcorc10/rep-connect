import { useRef } from "react";
import styles from "./refine.module.scss";
import * as z from "zod";
import { motion } from "framer-motion";
import clsx from "clsx";

export const REFINE_FORM_ID = "refine-street-form";

const Address = z.object({
  street: z.string().trim().min(1),
});

export const RefineForm = ({
  setPhase,
  handleRefine,
}: {
  setPhase: (phase: "loading" | "success" | "failure") => void;
  handleRefine: (street: string) => Promise<boolean>;
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const input = new FormData(e.currentTarget);

    const parsedData = Address.safeParse({
      street: input.get("street"),
    });
    if (!parsedData.success) {
      return;
    }

    setPhase("loading");
    const success = await handleRefine(parsedData.data.street);
    if (success) {
      setPhase("success");
    } else {
      setPhase("failure");
    }
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    formRef.current?.requestSubmit();
  };

  return (
    <div className={clsx(styles.formContainer)}>
      <form ref={formRef} id={REFINE_FORM_ID} onSubmit={handleSubmit}>
        <motion.textarea
          key="refine-input"
          name="street"
          placeholder="Enter your street address"
          rows={1}
          className={styles.formInput}
          onKeyDown={handleTextareaKeyDown}
        />
      </form>
    </div>
  );
};
