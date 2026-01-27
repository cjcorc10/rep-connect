"use client";
import StreetForm from "../streetForm";
import RefineContainer from "./container/refineContainer";
import styles from './refine.module.scss';
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X} from "lucide-react";

type RefineProps = {
    refineReps: (street: string, zip: string) => Promise<boolean>;
    multipleDistricts: boolean;
}

export default function Refine({ refineReps, multipleDistricts }: RefineProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [refined, setRefined] = useState<boolean | null>(null);


    useEffect(() => {
        if (refined === true && multipleDistricts || refined === false) {
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setRefined(null);
            }, 3000);
            return () => clearTimeout(timer);
            console.log('timer', timer);
        }
    }, [refined, multipleDistricts]);

    const handleRefine = async (street: string, zip: string): Promise<boolean> => {
        const result = await refineReps(street, zip);
        setRefined(result);
        return result;
    };

    return (
        <div className={styles.main}>
            <RefineContainer>

                <AnimatePresence mode="popLayout">
                {!isOpen ? (
                    <motion.div key="popup" className={styles.contentWrapper}>
                        <motion.p
                        style={{position: 'relative'}}
                        exit={{y: -80, opacity: 0}}
                        className="text-lg"
                        >Multiple districts were returned from your ZIP code. To refine results, click refine.</motion.p>
                        <motion.button layoutId="refine-wrapper" className={styles.button} onClick={() => setIsOpen(true)}>
                            <motion.p layoutId="refine-text">refine</motion.p>
                        </motion.button>
                    </motion.div>
                ) : (
                    <div>
                        <AnimatePresence mode="popLayout" initial={false}>
                        {!multipleDistricts && refined ? (
                            <motion.div key="reps-refined" initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 40, opacity: 0, filter: 'blur(7px)'}} transition={{ease: 'easeOut'}} className={styles.status}>
                                <p>Reps refined</p>
                                <div className="flex justify-center items-center bg-black rounded-full p-2">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>
                        ) : showError ? (
                            <motion.div key="unsuccessful" initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 40, opacity: 0, filter: 'blur(7px)'}} transition={{ease: 'easeOut'}} className={styles.status}>
                                <p>Unsuccessful, please try again</p>
                                <motion.div initial={{scale: 0.75}} animate={{scale: 1}} className="flex justify-center items-center bg-black rounded-full p-2">
                                    <X className="w-7 h-7 text-white" />
                                </motion.div>
                                <p></p>
                            </motion.div>
                        ) : (
                            <motion.div key="street-form"
                            initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}}
                            exit={{filter: 'blur(7px)', opacity: 0}}
                            className={styles.contentWrapper}>
                            {/* <motion.p className="text-lg" initial={{opacity: 0, y: -30}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} transition={{delay: 0.3, duration: 0.3}}>Enter your street name.</motion.p> */}

                                <StreetForm refine={handleRefine}  />
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                )}
                </AnimatePresence>
            </RefineContainer>
        </div>
    );
}

