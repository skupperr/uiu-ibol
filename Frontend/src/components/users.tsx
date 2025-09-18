'use client'

import { useAuth } from "@/context/AuthContext";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";
import { makeRequest } from "@/utils/api";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { Eye, EyeOff } from "lucide-react";


export default function Users() {
    const { backendUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setShowPassword(false);
        setErrorMessage("");
        setIsDialogOpen(false);
    };

    interface User {
        uid: string;
        name?: string;
        email?: string;
        account_type?: string;
        img_link?: string;
        linkedin?: string;
        github?: string;
        research_gate?: string;
        google_scholar?: string;
    }


    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        setIsLoading(true);
        fetchAllUsers()
        setIsLoading(false)
    }, []);

    const fetchAllUsers = async () =>{
        const data = await makeRequest("get-all-users");
        setUsers(data.users);
    }



    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            const res = await makeRequest("create-user", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            if (res.status === "success") {
                toast.success("User created successfully ✅\n" + "Provide the credentials to new user or tell them to reset the password through 'Forget password' while signing in", {
                    position: "bottom-right",
                    autoClose: 10000
                });
                resetForm();
                fetchAllUsers();
            } else {
                setErrorMessage(res.detail || "Failed to create user.");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (uid: string) => {
        try {
            setButtonDisabled(true)
            const res = await makeRequest(`delete-user/${uid}`, { method: "DELETE" });
            if (res.status !== "success") {
                toast.error("Failed to delete account.", {
                    position: "bottom-right",
                });
                return;
            }
            setUsers((prev) => prev.filter((u) => u.uid !== uid));

            if (res.old_img_link) {
                try {
                    const fileRef = ref(storage, decodeURIComponent(new URL(res.old_img_link).pathname.split("/o/")[1].split("?")[0]));
                    await deleteObject(fileRef);
                    console.log("Firebase image deleted successfully");
                } catch (err) {
                    console.warn("Error deleting image from Firebase:", err);
                }
            }

            toast.success("Account deleted successfully.", {
                    position: "bottom-right",
                });

        } catch (err) {
            console.error("Error deleting user:", err);
        } finally{
            setButtonDisabled(false)
        }
    };

    const handleToggle = async (uid: string) => {
        try {
            const res = await makeRequest(`toggle-account-type/${uid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });

            if (res.status === "success") {
                // Update local state after successful backend update
                setUsers((prev) =>
                    prev.map((u) =>
                        u.uid === uid
                            ? { ...u, account_type: u.account_type === "admin" ? "regular" : "admin" }
                            : u
                    )
                );
            }
        } catch (err) {
            console.error("Failed to toggle account type:", err);
        }
    };



    if (backendUser?.account_type !== "admin") {
        return <div className='flex w-full justify-center'>
            <h1>You do not have permission to manage users.</h1>;
        </div>
    }

    return (

        <div className='flex w-full justify-center'>
            <ToastContainer />
            <div className='h-auto w-full pb-[60px] mx-[5vw] max-w-[65em]'>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="my-6 sm:my-10 text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] font-[200] tracking-[0.03em] text-[--color-5]">
                        USERS
                    </h3>

                    {/* Button */}
                    {backendUser?.account_type === 'admin' && (
                        <button
                            onClick={() => {
                                setIsDialogOpen(true);

                            }}
                            className="rounded-2xl h-10 mt-4 sm:mt-0 mb-4 sm:mb-0 px-4 sm:px-6 py-2 shadow-md bg-[--color-heading] text-white text-sm sm:text-base hover:opacity-90 transition"
                        >
                            + Create User Account
                        </button>
                    )}

                </div>


                <div className=' md:p-3 py-3 border-2 sm:p-5 rounded-xl h-fit'>

                    {isLoading && (
                        <div className="m-30 mt-16 mb-16  inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <TailChase
                                size="40"
                                speed="1.75"
                                color="black"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-10">
                        {users?.map((user) => (
                            <div
                                key={user.uid}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border p-4 rounded-lg shadow-sm"
                            >
                                {/* Left: Photo + Name */}
                                <div className="flex items-center gap-4">
                                    <Image
                                        src={user.img_link || "/images/default-avatar.png"}
                                        alt={user.name || "User Avatar"}
                                        width={50}
                                        height={50}
                                        className="rounded-full object-cover border"
                                    />
                                    <span className="font-semibold text-lg">{user.name}</span>
                                </div>

                                {/* Middle: Social Links */}
                                <div className="flex gap-4 justify-center md:justify-start">
                                    {user.linkedin && (
                                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Image src="/images/linkedin.png" alt="LinkedIn" width={30} height={30} />
                                        </a>
                                    )}
                                    {user.github && (
                                        <a href={user.github} target="_blank" rel="noopener noreferrer">
                                            <Image src="/images/github.png" alt="GitHub" width={30} height={30} />
                                        </a>
                                    )}
                                    {user.google_scholar && (
                                        <a href={user.google_scholar} target="_blank" rel="noopener noreferrer">
                                            <Image src="/images/scholar.png" alt="Scholar" width={30} height={30} />
                                        </a>
                                    )}
                                    {user.research_gate && (
                                        <a href={user.research_gate} target="_blank" rel="noopener noreferrer">
                                            <Image src="/images/researchgate.png" alt="ResearchGate" width={30} height={30} />
                                        </a>
                                    )}
                                </div>

                                {/* Right: Actions */}
                                <div className="flex gap-3 justify-center md:justify-end">
                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => handleToggle(user.uid)}
                                        disabled={user.uid === backendUser.uid} // disable for current user
                                        className={`px-3 py-1 rounded-full text-sm font-medium 
            ${user.account_type === "admin"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-300 text-black"
                                            } ${user.uid === backendUser.uid ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        {user.account_type === "admin" ? "Admin" : "Regular"}
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(user.uid)}
                                        disabled={user.uid === backendUser.uid || buttonDisabled} // disable for current user
                                        className={`bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 
                                        ${user.uid === backendUser.uid ? "opacity-50 cursor-not-allowed hover:bg-red-500" : ""}`}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>



                </div>


                {/* Dialog for Create/Update */}
                {isDialogOpen && backendUser?.account_type === 'admin' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-up transition-transform">
                            <h2 className="text-xl font-semibold mb-4">
                                Create User
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border w-full p-3 mb-4 rounded-lg focus:ring-2 focus:ring-[--color-3] outline-none"
                                />

                                {/* Password */}
                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border w-full p-3 pr-10 rounded-lg focus:ring-2 focus:ring-[--color-3] outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errorMessage && (
                                    <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                                )}

                            </form>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsDialogOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-orange-400 text-white rounded hover:opacity-90"
                                >
                                    {loading ? "Processing..." : "Create Account"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Animations */}
            <style jsx>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-up { from { transform: scale(0.95) } to { transform: scale(1) } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-up { animation: scale-up 0.2s ease-out; }
      `}</style>
        </div>
    );
}
