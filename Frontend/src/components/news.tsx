"use client";

import { useEffect, useState } from "react";
import { makeRequest } from "@/utils/api";
import Link from 'next/link'
import React from 'react'
// import { NewsList } from '@/data/news'
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import DeleteNewsButton from '@/components/ui/deleteNewsButton'
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const News = () => {
    // const { makeRequest } = useApi();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const { backendUser } = useAuth();


    type NewsItem = {
        id: number;
        type: string;
        link: string;
        title: string;
        by: string;
        date: string;
        desc: string;
        linkHeading: string;
    };

    const [NewsList, setNewsList] = useState<NewsItem[]>([]);

    const [form, setForm] = useState({
        id: null, // 👈 store ID for updates
        type: "",
        title: "",
        description: "",
        link_title: "",
        link: "",
        authors: "",
    });


    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await makeRequest("get-all-news");
            if (res.status === "success") {
                setNewsList(res.data)
            } else {
                setError("Failed to load News.");
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error("Error fetching meals:", err.message);
            } else {
                console.error("Error fetching meals:", err);
            }
            setError("Permission denied or network error.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOpenUpdate = (news: any) => {
        setForm({
            id: news.id,
            type: news.type,
            title: news.title,
            description: news.desc,
            link_title: news.linkHeading || "",
            link: news.link,
            authors: news.by,
        });
        setIsUpdateMode(true);
        setIsDialogOpen(true);
    };


    const handleSubmit = async () => {
        try {
            if (!form.title || !form.description){
                        toast.warning("Type and Title are required" , {
                                                position: "bottom-right",
                                            });
                        return;
                    } 
            setIsLoading(true);

            const endpoint = isUpdateMode ? `update-news/${form.id}` : "create-news";
            const method = isUpdateMode ? "PUT" : "POST";

            const res = await makeRequest(endpoint, {
                method,
                body: JSON.stringify(form),
            }, true);


            if (res.status === "success") {
                fetchNews();
                setIsDialogOpen(false);
                setForm({
                    id: null,
                    type: "",
                    title: "",
                    description: "",
                    link_title: "",
                    link: "",
                    authors: "",
                });
                toast.success(isUpdateMode ? "News updated successfully" : "News created successfully.", {
                    position: "bottom-right",
                });
                setIsUpdateMode(false); // reset mode
            } else {
                setError(isUpdateMode ? "Failed to update news."  + res.detail  : "Failed to create news."  + res.detail );
                toast.error(isUpdateMode ? "Failed to update news." + res.detail : "Failed to create news."  + res.detail , {
                    position: "bottom-right",
                });
            }
        } catch (err) {
            console.error(isUpdateMode ? "Error updating news:" : "Error creating news:", err);
            toast.error(isUpdateMode ? "Error updating news:" : "Error creating news:", {
                    position: "bottom-right",
                });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className='flex w-full justify-center'>
            <ToastContainer />
            <div className='h-auto w-full max-w-[65em] mx-[5vw] pb-[60px]'>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="my-6 sm:my-10 text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] tracking-[0.03em] font-[200] text-[--color-5]">
                        NEWS
                    </h3>

                    {backendUser?.account_type === 'admin' && (
                        <button
                            onClick={() => setIsDialogOpen(true)}
                            className="rounded-2xl mt-4 sm:mt-0 mb-4 sm:mb-0 h-10 px-4 sm:px-6 py-2 shadow-md bg-[--color-heading] text-white text-sm sm:text-base hover:opacity-90 transition"
                        >
                            + Add News
                        </button>
                    )}


                </div>




                {/* Dialog */}
                {isDialogOpen && backendUser?.account_type === 'admin' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-up transition-transform">
                            <h2 className="text-xl font-semibold mb-4">
                                {isUpdateMode ? "Update News" : "Create News"}
                            </h2>

                            <input
                                name="type"
                                placeholder="Type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />
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
                                name="link_title"
                                placeholder="Link Title"
                                value={form.link_title}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />
                            <input
                                name="link"
                                placeholder="Link"
                                value={form.link}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />
                            <input
                                name="authors"
                                placeholder="Authors"
                                value={form.authors}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setIsDialogOpen(false);
                                        setIsUpdateMode(false);
                                        setForm({
                                            id: null,
                                            type: "",
                                            title: "",
                                            description: "",
                                            link_title: "",
                                            link: "",
                                            authors: "",
                                        });
                                    }}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-[--color-heading] text-white rounded hover:opacity-90"
                                >
                                    {isUpdateMode ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {isLoading && (
                        <div className="m-30 mt-16 mb-16 col-span-full inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                            <TailChase
                                size="40"
                                speed="1.75"
                                color="black"
                            />
                        </div>
                    )}
                    {
                        NewsList?.map((news) => (
                            <div key={news.id} className='p-5 border-[1px] border-[--color-2] overflow-hidden w-full'>
                                {/* <p className='font-[600] text-[--color-5] tracking-[0.05em] transition-all text-[14px]'>AWARD | NEWS | STUDY</p> */}
                                <div className="flex justify-between">
                                    <p className='font-[600] text-[--color-5] tracking-[0.05em] transition-all text-[14px]'>{news.type}</p>

                                    {backendUser?.account_type === 'admin' && (
                                        <div>
                                            <button
                                                onClick={() => handleOpenUpdate(news)}
                                                className="rounded-2xl px-4 py-2 mb-4 shadow-md bg-blue-500 text-white hover:opacity-90 transition text-sm"
                                            >
                                                Edit
                                            </button>

                                            {/* Delete with confirmation */}
                                            <DeleteNewsButton id={news.id} onDeleted={fetchNews} />

                                        </div>
                                    )}

                                </div>

                                <Link target='_blank' href={news.link} className='mt-2 text-[18px] md:text-[20px] tracking-[0.05em] font-bold text-[--color-heading] cursor-pointer hover:underline'>{news.title}</Link>
                                <p className=' mt-2 italic text-[--color-5] tracking-[0.05em] transition-all text-[14px]'>
                                    By <span className='text-[--color-heading] underline'>{news.by}</span> | {news.date}
                                </p>
                                <p className=' mt-4 text-[--color-p] tracking-[0.05em] transition-all text-[14px]'>
                                    {news.desc}
                                </p>
                                {
                                    news.linkHeading ? (<p className=' mt-4 text-[--color-p] tracking-[0.05em] transition-all text-[14px]'>
                                        {news.linkHeading}
                                    </p>) : ''
                                }
                                <Link target='_blank' className=' text-blue-400 underline break-all' href={news.link}>{news.link}</Link>
                            </div>
                        ))
                    }
                </div>

            </div>
            {/* Animations */}
            <style jsx>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scale-up { from { transform: scale(0.95) } to { transform: scale(1) } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-up { animation: scale-up 0.2s ease-out; }
      `}</style>
        </div>
    )
}

export default News