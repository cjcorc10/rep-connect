"use client";
import StreetForm from "../streetForm";
import RefineContainer from "./container/refineContainer";
import styles from './refine.module.scss';
import { useState, useEffect } from "react";

type RefineProps = {
    refineReps: (street: string, zip: string) => Promise<boolean>;
    multipleDistricts: boolean;
}

export default function Refine({ refineReps, multipleDistricts }: RefineProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [refined, setRefined] = useState<boolean | null>(null);

    // Handle error state: show error if refinement happened but multipleDistricts is still true,
    // or if refinement didn't happen at all
    useEffect(() => {
        if (refined === true && multipleDistricts) {
            // Refinement happened (reps changed) but still multiple districts
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setRefined(null);
            }, 3000);
            return () => clearTimeout(timer);
        } else if (refined === false) {
            // No refinement happened
            setShowError(true);
            const timer = setTimeout(() => {
                setShowError(false);
                setRefined(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [refined, multipleDistricts]);

    const handleRefine = async (street: string, zip: string): Promise<boolean> => {
        const result = await refineReps(street, zip);
        setRefined(result);
        return result;
    };

    return (
        <RefineContainer>
            <div className={styles.main}>
                {!isOpen ? (
                    // State 1: Initial state - show refine button
                    <>
                        <p>Multiple districts were returned from your ZIP code. To refine results, click refine.</p>
                        <button onClick={() => setIsOpen(true)}>refine</button>
                    </>
                ) : (
                    <>
                        {!multipleDistricts && refined ? (
                            // State 3: Success - multipleDistricts is now false after refinement
                            <p>Reps refined</p>
                        ) : showError ? (
                            // State 4: Error - show error message briefly
                            <p>Unsuccessful, please try again</p>
                        ) : (
                            // State 2: Form state - show form to enter street address
                            <>
                                <p>Enter your street address to refine results.</p>
                                <StreetForm refine={handleRefine} />
                            </>
                        )}
                    </>
                )}
            </div>
        </RefineContainer>
    );
}