"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface TypewriterProps {
    text: string | string[];  // Support both single string and array
    speed?: number;
    deleteSpeed?: number;
    waitTime?: number; // Renamed from pauseDuration to match usage
    className?: string;
    cursorClassName?: string; // Added to match usage
}

export function Typewriter({
    text,
    speed = 100,
    deleteSpeed = 50,
    waitTime = 2000,
    className = "",
    cursorClassName = "bg-current",
}: TypewriterProps) {
    const texts = Array.isArray(text) ? text : [text];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const targetText = texts[currentTextIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (currentText.length < targetText.length) {
                    setCurrentText(targetText.slice(0, currentText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), waitTime);
                }
            } else {
                // Deleting
                if (currentText.length > 0) {
                    setCurrentText(currentText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, isDeleting ? deleteSpeed : speed);

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, texts, speed, deleteSpeed, waitTime]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`inline-block w-[3px] h-[1em] ml-1 align-middle ${cursorClassName}`}
            />
        </span>
    );
}

// Wavy Text Component
export function WavyText({ text, className = "" }: { text: string; className?: string }) {
    return (
        <span className={className}>
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        delay: index * 0.05,
                        ease: "easeInOut",
                    }}
                    className="inline-block"
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

// Scatter Text Component
export function ScatterText({ text, className = "" }: { text: string; className?: string }) {
    const [isHovered, setIsHovered] = useState(false);

    const [randomValues, setRandomValues] = useState<{ x: number, y: number, rotate: number }[]>([]);

    useEffect(() => {
        setRandomValues(text.split("").map(() => ({
            x: Math.random() * 40 - 20,
            y: Math.random() * 40 - 20,
            rotate: Math.random() * 90 - 45,
        })));
    }, [text]);

    return (
        <span
            className={`cursor-pointer ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    animate={isHovered && randomValues[index] ? {
                        x: randomValues[index].x,
                        y: randomValues[index].y,
                        rotate: randomValues[index].rotate,
                        opacity: 0.5,
                    } : {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        opacity: 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                    }}
                    className="inline-block"
                    style={{ display: char === " " ? "inline" : "inline-block" }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

// Text Reveal Component
export function RevealText({ text, className = "" }: { text: string; className?: string }) {
    return (
        <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={className}
        >
            {text.split(" ").map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}
