'use client'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { makeRequest } from "@/utils/api";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import DeleteProfileButton from './ui/deleteProfileButton';
import ChangeEmailForm from '@/app/auth/updateEmail';

const profile = () => {
    const router = useRouter();
    const { backendUser } = useAuth();
    const [editMode, setEditMode] = useState("no");
    const [isLoading, setIsLoading] = useState(true);

    // state
    const [form, setForm] = useState({
        name: backendUser?.name || "",
        email: backendUser?.email || "",
        profile_tag: backendUser?.profile_tag || "",
        linkedin: backendUser?.linkedin || "",
        github: backendUser?.github || "",
        scholar: backendUser?.google_scholar || "",
        researchgate: backendUser?.research_gate || "",
        image: null as File | null,
        existingImage: backendUser?.img_link || null,
    });

    const [preview, setPreview] = useState<string | null>(backendUser?.img_link || null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setForm((prev) => ({ ...prev, image: file }));

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (backendUser) {
            setForm({
                name: backendUser.name || "",
                email: backendUser.email || "",
                profile_tag: backendUser.profile_tag || "",
                linkedin: backendUser.linkedin || "",
                github: backendUser.github || "",
                scholar: backendUser.google_scholar || "",
                researchgate: backendUser.research_gate || "",
                image: null,
                existingImage: backendUser.img_link || null,
            });
            setPreview(backendUser.img_link || null);
            setIsLoading(false); // user loaded
        } else {
            router.replace("/auth");
        }
    }, [backendUser]);



    const handleSave = async () => {
        setIsSubmitting(true);

        try {
            let imageUrl: string | null = null;

            // Only upload if user selected a new file
            if (form.image) {
                const filename = `${Date.now()}-${form.image.name.replace(/\s+/g, "_")}`;
                const storageRef = ref(storage, `profile/${filename}`);
                const uploadTask = uploadBytesResumable(storageRef, form.image);

                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        () => { },
                        (err) => reject(err),
                        async () => {
                            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            }

            // Build payload dynamically
            const payload: Record<string, any> = {
                name: form.name,
                email: form.email,
                profile_tag: form.profile_tag,
                linkedin: form.linkedin,
                github: form.github,
                scholar: form.scholar,
                researchgate: form.researchgate,
            };

            // Only include image if changed
            if (imageUrl) {
                payload.img_link = imageUrl;
            }

            const res = await makeRequest("update-profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.status === 'success') {
                if (res.old_img_link) {
                    try {
                        const fileRef = ref(storage, decodeURIComponent(new URL(res.old_img_link).pathname.split("/o/")[1].split("?")[0]));
                        await deleteObject(fileRef);
                        console.log("Firebase image deleted successfully");
                    } catch (err) {
                        console.warn("Error deleting image from Firebase:", err);
                    }
                }
                toast.success("Profile updated successfully", {
                    position: "bottom-right",
                });
            }

            setEditMode("no");
        } catch (err: any) {
            console.error("Error updating profile:", err);
            toast.error(err.message, {
                position: "bottom-right",
            });
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className=" bg-[--color-3] flex justify-center items-start py-10 px-4">
            <ToastContainer aria-label="Notification" />
            {isLoading && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 flex flex-col gap-6">

                    <div className="m-30 mt-16 mb-16 inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <TailChase
                            size="40"
                            speed="1.75"
                            color="black"
                        />
                    </div>

                </div>)}

            {!isLoading && (
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">

                        <div
                            className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer group"
                            onClick={() => document.getElementById("fileInput")?.click()}
                        >
                            <Image
                                src={preview || "/images/default-avatar.png"}
                                alt="User Photo"
                                fill
                                className="rounded-full object-cover border-4 border-[--color-heading]"
                            />
                            {editMode === 'yes' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
                                    <p className="text-white text-sm">Change</p>
                                </div>
                            )}
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>



                        <div className="flex-1 flex flex-col gap-2 items-center">
                            {editMode === 'yes' ? (
                                <>
                                    <input
                                        type="text"
                                        placeholder='Name'
                                        name='name'
                                        value={form.name}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                    <input
                                        type="email"
                                        disabled={true}
                                        placeholder='Email'
                                        value={form.email}
                                        // onChange={(e) => setEmail(e.target.value)}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                    <input
                                        type="text"
                                        name='profile_tag'
                                        placeholder='Position (e.g. Assistant Professor, Lecturer)'
                                        value={form.profile_tag}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                </>
                            ) : (
                                <div className='my-10'>
                                    <h1 className="text-[--color-5] text-2xl md:text-3xl font-semibold">{form.name}</h1>
                                    <p className="text-[--color-6]">{form.email}</p>
                                    <p className="text-[--color-6]">{form.profile_tag}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="gap-4 md:gap-6 items-start">
                        {editMode === 'yes' && (
                            <>
                                <div className="flex gap-2 items-center w-full mb-4">
                                    <Image src="/images/linkedin.png" alt="LinkedIn" width={24} height={24} />
                                    <input
                                        type="url"
                                        name='linkedin'
                                        placeholder="LinkedIn URL"
                                        value={form.linkedin}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                </div>
                                <div className="flex gap-2 items-center w-full mb-4">
                                    <Image src="/images/github.png" alt="GitHub" width={24} height={24} />
                                    <input
                                        type="url"
                                        name='github'
                                        placeholder="GitHub URL"
                                        value={form.github}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                </div>
                                <div className="flex gap-2 items-center w-full mb-4">
                                    <Image src="/images/scholar.png" alt="Google Scholar" width={24} height={24} />
                                    <input
                                        type="url"
                                        name='scholar'
                                        placeholder="Google Scholar URL"
                                        value={form.scholar}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                </div>
                                <div className="flex gap-2 items-center w-full">
                                    <Image src="/images/researchgate.png" alt="ResearchGate" width={24} height={24} />
                                    <input
                                        type="url"
                                        name='researchgate'
                                        placeholder="ResearchGate URL"
                                        value={form.researchgate}
                                        onChange={handleChange}
                                        className="border p-2 rounded-lg focus:ring-2 focus:ring-[--color-heading] outline-none w-full"
                                    />
                                </div>
                            </>
                        )}

                        {editMode === 'no' && (
                            <div className="flex flex-wrap gap-4 mt-2 justify-between">
                                {form.linkedin && (
                                    <a
                                        href={form.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[--color-heading] hover:underline bg-[--color-9] px-3 py-1 rounded-lg shadow-sm"
                                    >
                                        <Image src="/images/linkedin.png" alt="LinkedIn" width={20} height={20} />
                                        LinkedIn
                                    </a>
                                )}
                                {form.github && (
                                    <a
                                        href={form.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[--color-heading] hover:underline bg-[--color-9] px-3 py-1 rounded-lg shadow-sm"
                                    >
                                        <Image src="/images/github.png" alt="GitHub" width={20} height={20} />
                                        GitHub
                                    </a>
                                )}
                                {form.scholar && (
                                    <a
                                        href={form.scholar}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[--color-heading] hover:underline bg-[--color-9] px-3 py-1 rounded-lg shadow-sm"
                                    >
                                        <Image src="/images/scholar.png" alt="Google Scholar" width={20} height={20} />
                                        Google Scholar
                                    </a>
                                )}
                                {form.researchgate && (
                                    <a
                                        href={form.researchgate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[--color-heading] hover:underline bg-[--color-9] px-3 py-1 rounded-lg shadow-sm"
                                    >
                                        <Image src="/images/researchgate.png" alt="ResearchGate" width={20} height={20} />
                                        ResearchGate
                                    </a>
                                )}
                            </div>
                        )}

                        {editMode === 'email' && (
                            <ChangeEmailForm />
                        )}

                    </div>

                    {/* Edit / Save Button */}
                    <div className="mt-4 flex justify-end">
                        {editMode === 'yes' && (
                            <div>
                                <button
                                    onClick={() => setEditMode("no")}
                                    disabled={isSubmitting}
                                    className="bg-[--color-heading] text-white px-4 py-2 rounded-xl hover:bg-[--color-4] transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className="bg-[--color-heading] text-white px-4 py-2 ml-4 rounded-xl hover:bg-[--color-4] transition disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button></div>
                        )}
                        {editMode === 'no' && (
                            <div className='flex gap-4'>
                                <button
                                    onClick={() => setEditMode('yes')}
                                    className="bg-[--color-heading] text-white px-4 py-2 rounded-xl hover:bg-[--color-4] transition"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setEditMode('email')}
                                    className="bg-orange-400 text-white px-4 py-2 rounded-xl hover:bg-orange-300 transition"
                                >
                                    Edit Email
                                </button>
                                <DeleteProfileButton />
                            </div>
                        )}
                        {editMode === 'email' && (
                            <button
                                onClick={() => setEditMode('no')}
                                className="bg-[--color-heading] text-white px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>)}
        </div>
    );
};

export default profile;
