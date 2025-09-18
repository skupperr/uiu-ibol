'use client'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from "@/context/AuthContext";
import { logOut } from "@/lib/auth";
import CSSTransition from 'react-transition-group/CSSTransition'; // for fade animation
import './popover.css'; // create this CSS file for fade animations

const UserPopover = ({ user }: { user: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { backendUser } = useAuth();

    // Close popover on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative">
            {/* Avatar */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full mt-2 w-10 h-10 overflow-hidden mr-4"
            >
                <Image
                    src={user.img_link || "/images/default-avatar.png"}
                    alt="User"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                />
            </button>

            {/* Popover with fade animation */}
            <CSSTransition
                in={isOpen}
                timeout={200}
                classNames="fade"
                unmountOnExit
                nodeRef={popoverRef}
            >
                <div
                    ref={popoverRef}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 ring-1 ring-black ring-opacity-5 p-4"
                    style={{ backgroundColor: "var(--color-1)" }}
                >
                    {/* User info */}
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src={user.img_link || "/images/default-avatar.png"}
                            alt="User"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold text-[--color-5]">{user.name}</span>
                            <span className="text-sm text-[--color-2] truncate">{user.email}</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/profile"
                            className="text-center py-2 px-3 rounded-lg bg-[--color-heading] text-white hover:opacity-80 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Manage Account
                        </Link>
                        {backendUser?.account_type === 'admin' && (
                            <Link
                                href="/users"
                                className="text-center py-2 px-3 rounded-lg bg-[--color-heading] text-white hover:opacity-80 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Manage Users
                            </Link>
                        )}

                        <button
                            onClick={() => {
                                logOut();
                                setIsOpen(false);
                            }}
                            className="text-center py-2 px-3 rounded-lg bg-red-500 text-white hover:bg-red-400 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default UserPopover;
