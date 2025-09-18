"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { makeRequest } from "@/utils/api";
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";
import DeleteResearchButton from '@/components/ui/deleteResearchButton'
import { useAuth } from "@/context/AuthContext";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Small carousel component
function ProjectImages({ images }: { images: { id?: number; img_link: string }[] | string[] }) {
    const normalized = (images as any[]).map(i => typeof i === "string" ? { img_link: i } : i);
    const [index, setIndex] = useState(0);
    const total = normalized.length;
    if (total === 0) return null;

    const prev = () => setIndex((i) => (i - 1 + total) % total);
    const next = () => setIndex((i) => (i + 1) % total);

    return (
        <div className="w-full sm:w-full md:w-[70%] lg:w-[50%] relative flex justify-center items-center">
            <img
                src={normalized[index].img_link}
                alt={`image-${index}`}
                className="w-full h-auto rounded-md border-2 border-[--color-8]"
            />
            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:opacity-90"
                        aria-label="Previous image"
                    >
                        ◀
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:opacity-90"
                        aria-label="Next image"
                    >
                        ▶
                    </button>
                </>
            )}
        </div>
    );

}

const Research = () => {
    const { backendUser } = useAuth();
    const [items, setItems] = useState<{ "research-focus": any[]; "ongoing-projects": any[] }>({
        "research-focus": [],
        "ongoing-projects": [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formType, setFormType] = useState<"research-focus" | "ongoing-projects" | null>("research-focus");
    const [currentId, setCurrentId] = useState<number | null>(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        images: [] as File[],
        existingImages: [] as { id?: number; img_link: string }[],
    });
    const [previewList, setPreviewList] = useState<string[]>([]);
    const [markedToRemove, setMarkedToRemove] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchAllItems();
    }, []);

    const fetchAllItems = async () => {
        setIsLoading(true);
        try {
            const res = await makeRequest("get-all-research-project");
            if (res.status === "success") {
                const researchFocus = res.data.filter((item: any) => item.type === "research-focus");
                const ongoingProjects = res.data.filter((item: any) => item.type === "ongoing-projects");
                setItems({ "research-focus": researchFocus, "ongoing-projects": ongoingProjects });
            } else {
                console.error("Failed to fetch research/projects");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    interface ResearchForm {
        title: string;
        description: string;
        images: File[];
        existingImages: { id?: number; img_link: string }[];
    }

    type ResearchType = "research-focus" | "ongoing-projects";

    interface HandleOpenProps {
        type: ResearchType;
    }

    const handleOpen = (type: ResearchType) => {
        setCurrentId(null);
        setFormType(type);
        setIsDialogOpen(true);
        setForm({ title: "", description: "", images: [], existingImages: [] });
        setPreviewList([]);
        setMarkedToRemove({});
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setFormType(null);
        setCurrentId(null); // <-- also clear on cancel
        setForm({ title: "", description: "", images: [], existingImages: [] });
        setPreviewList([]);
        setMarkedToRemove({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setForm(prev => ({ ...prev, images: files }));

        // revoke old previews
        previewList.forEach(url => URL.revokeObjectURL(url));
        setPreviewList(files.map(f => URL.createObjectURL(f)));
    };

    const handleSubmit = async () => {
        if (!form.title || !form.description) {
            toast.warning("Title and description are required", {
                position: "bottom-right",
            });
            return;
        }
        setIsSubmitting(true);

        let uploadedUrls: string[] = [];
        try {
            // upload new images
            for (const file of form.images) {
                const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
                const sRef = storageRef(storage, `uploads/${filename}`);
                const uploadTask = uploadBytesResumable(sRef, file);
                await new Promise<void>((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        () => { },
                        (err) => reject(err),
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            uploadedUrls.push(url);
                            resolve();
                        }
                    );
                });
            }

            const remove_images = Object.entries(markedToRemove)
                .filter(([, v]) => v)
                .map(([k]) => k);

            const payload: any = {
                title: form.title,
                description: form.description,
                type: formType,
            };
            if (uploadedUrls.length > 0) payload.image_urls = uploadedUrls;
            if (currentId && remove_images.length > 0) payload.remove_images = remove_images;

            let res;
            if (currentId) {
                res = await makeRequest(`update-research/${currentId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await makeRequest("create-research", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }, true);
            }

            if (res.status !== "success") {
                toast.error("An error has occurred: " + res.detail, {
                    position: "bottom-right",
                });
                throw new Error("Failed to save metadata");
            }

            // delete removed images from Firebase if backend confirms
            if (res.deleted_img_links && res.deleted_img_links.length > 0) {
                for (const link of res.deleted_img_links) {
                    try {
                        const path = decodeURIComponent(new URL(link).pathname.split("/o/")[1].split("?")[0]);
                        const fileRef = storageRef(storage, path);
                        await deleteObject(fileRef);
                    } catch (err) {
                        console.warn("Error deleting image from Firebase:", err);
                    }
                }
            }
            toast.success("Success", {
                position: "bottom-right",
            });

            fetchAllItems();
            setCurrentId(null);
            setIsDialogOpen(false);
            setPreviewList([]);
            setForm({ title: "", description: "", images: [], existingImages: [] });
            setMarkedToRemove({});
        } catch (err) {
            console.error(err);
            if (uploadedUrls.length > 0) {
                for (const url of uploadedUrls) {
                    try {
                        const path = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);
                        const fileRef = storageRef(storage, path);
                        await deleteObject(fileRef);
                    } catch { }
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: any) => {
        setCurrentId(item.id);
        setForm({
            title: item.title,
            description: item.description,
            images: [],
            existingImages: item.images && item.images.length
                ? item.images.map((img: any) => ({ id: img.id, img_link: img.img_link }))
                : (item.img_link ? [{ img_link: item.img_link }] : [])
        });
        setPreviewList([]);
        setMarkedToRemove({});
        setFormType(item.type);
        setIsDialogOpen(true);
    };

    return (
        <div className='flex w-full justify-center'>
            <ToastContainer />
            <div className='h-auto w-full max-w-[65em] pb-[60px] mx-[5vw]' id='Research'>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="my-6 sm:my-10 text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] tracking-[0.03em] font-[200] text-[--color-5]">
                        RESEARCH
                    </h3>

                    {backendUser?.account_type === 'admin' && (
                        <div className="flex flex-col sm:flex-row sm:mt-0 mt-4">
                            <button
                                onClick={() => handleOpen("research-focus")}
                                className="rounded-2xl h-10 mb-4 sm:mb-0 sm:mr-2 px-4 sm:px-6 py-2 shadow-md bg-[--color-heading] text-white text-sm sm:text-base hover:opacity-90 transition"
                            >
                                + Add Research Focus
                            </button>
                            <button
                                onClick={() => handleOpen("ongoing-projects")}
                                className="rounded-2xl h-10 mb-4 sm:mb-0 px-4 sm:px-6 py-2 shadow-md bg-[--color-heading] text-white text-sm sm:text-base hover:opacity-90 transition"
                            >
                                + Add Ongoing Project
                            </button>
                        </div>
                    )}
                </div>

                <Tabs defaultValue="research-focus" className="w-full">
                    <TabsList className='w-full justify-start'>
                        <TabsTrigger value="research-focus">Research Focus</TabsTrigger>
                        <TabsTrigger value="ongoing-projects">Ongoing Projects</TabsTrigger>
                    </TabsList>

                    {isLoading && (
                        <div className="m-30 mt-16 mb-16 inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <TailChase size="40" speed="1.75" color="black" />
                        </div>
                    )}

                    {(["research-focus", "ongoing-projects"] as const).map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            <div className='mt-8 flex flex-col gap-10'>
                                {items[tab].map((item) => (
                                    <div key={item.id} className='flex flex-col-reverse lg:flex-row-reverse w-full p-4 md:p-6 border-[1px] shadow-xl rounded-lg gap-5'>

                                        {/* Image container */}
                                        {(item.images && item.images.length > 0) ? (
                                            <ProjectImages images={item.images} />
                                        ) : item.img_link ? (
                                            <div className='w-full sm:w-full md:w-[70%] lg:w-[50%] overflow-hidden flex justify-center items-center'>
                                                <Image
                                                    src={item.img_link}
                                                    alt={item.title}
                                                    height={0}
                                                    width={0}
                                                    sizes='100vw'
                                                    className='w-full h-min object-cover rounded-md border-2 border-[--color-8]'
                                                />
                                            </div>
                                        ) : null}

                                        {/* Text container */}
                                        <div className={`w-full ${(item.img_link || (item.images && item.images.length > 0)) ? 'lg:w-[50%]' : ''} flex flex-col gap-2`}>
                                            <h3 className='text-xl font-bold text-[--color-5] mb-2'>{item.title}</h3>
                                            <div className='text-[--color-p]'>
                                                {item.description.split("\n").map((line: string, i: number) => (
                                                    <p key={i} className="text-justify mb-2">{line}</p>
                                                ))}
                                            </div>

                                            {backendUser?.account_type === 'admin' && (
                                                <div className='flex gap-2 mt-3'>
                                                    <button
                                                        className='rounded-2xl px-5 py-2 mb-4 shadow-md bg-blue-500 text-white hover:opacity-90 transition text-sm'
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <DeleteResearchButton id={item.id} type={tab} onDeleted={fetchAllItems} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {isDialogOpen && backendUser?.account_type === 'admin' && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-up">
                        <h2 className="text-xl font-semibold mb-4">
                            {formType === "research-focus" ? "Add Research Focus" : "Add Ongoing Project"}
                        </h2>

                        <input
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded mb-3"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full mb-4"
                            multiple
                        />

                        {/* Preview new uploads */}
                        {previewList.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Preview (new uploads):</p>
                                <div className="flex gap-2 overflow-x-auto">
                                    {previewList.map((src, idx) => (
                                        <img key={idx} src={src} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Existing images (edit) */}
                        {form.existingImages.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {form.existingImages.map((img) => (
                                        <div key={img.img_link} className="flex flex-col items-center">
                                            <img src={img.img_link} alt="Existing" className="w-32 h-20 object-cover rounded border mb-1" />
                                            <label className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={!!markedToRemove[img.img_link]}
                                                    onChange={(e) =>
                                                        setMarkedToRemove(prev => ({ ...prev, [img.img_link]: e.target.checked }))
                                                    }
                                                />
                                                Remove
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className={`px-4 py-2 border rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-4 py-2 bg-[--color-heading] text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes scale-up {
                            from { transform: scale(0.95); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        .animate-scale-up {
                            animation: scale-up 0.2s ease-out;
                        }
                    `}</style>
                </div>
            )}
        </div>
    )
}

export default Research;
