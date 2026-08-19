import { RefObject, useEffect } from "react";

/**
 * Closes a popover when a pointer press lands outside it.
 *
 * Every skin carried its own copy of this effect, and the two skins with both a
 * speed and a volume popover folded both into a single effect that had to be
 * edited in lockstep. One call per popover instead.
 *
 * No-ops while `isOpen` is false, so no listener is attached for a closed popover.
 */
const useOutsideClick = (
    ref: RefObject<HTMLElement | null>,
    isOpen: boolean,
    onClose: () => void
) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [ref, isOpen, onClose]);
};

export default useOutsideClick;
