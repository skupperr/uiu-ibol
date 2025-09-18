"use client";
import { ScrollArea } from '@/components/ui/scroll-area'
import Image from 'next/image'
import React, { useEffect, useState } from "react";
import { makeRequest } from "@/utils/api";
import Link from 'next/link'
import DeletePublicationButton from '@/components/ui/deletePublicationButton'
// import { publications } from '@/data/publications'
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'
import { useAuth } from "@/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Publication {
    id: number;
    title: string;
    desc: string;
    link: string;
    publish_date: string;
    authors: string[];
}

interface YearGroup {
    year: string;
    papers: Publication[];
}

const Publications = () => {
    // const { makeRequest } = useApi();
    const { backendUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pubList, setPubList] = useState<YearGroup[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const [form, setForm] = useState({
        id: null as number | null,
        title: "",
        desc: "",
        link: "",
        publish_date: "",
        authors: [] as string[],
    });

    useEffect(() => {
        fetchPublications();
    }, []);


    const fetchPublications = async () => {
        setIsLoading(true);
        try {
            const res = await makeRequest("get-all-publications");
            if (res.status === "success") {
                setPubList(res.data);
            } else {
                setError("Failed to load publications.");
            }
        } catch (err) {
            console.error("Error fetching publications:", err);
            setError("Network or permission error.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle dynamic authors input
    const handleAuthorChange = (index: number, value: string) => {
        const newAuthors = [...form.authors];
        newAuthors[index] = value;
        setForm({ ...form, authors: newAuthors });
    };

    const addAuthorField = () => setForm({ ...form, authors: [...form.authors, ""] });
    const removeAuthorField = (index: number) => {
        const newAuthors = form.authors.filter((_, i) => i !== index);
        setForm({ ...form, authors: newAuthors });
    };

    // Open dialog for update
    const handleOpenUpdate = (pub: Publication) => {
        // Convert the date string to YYYY-MM-DD
        const dateObj = new Date(pub.publish_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
        const dd = String(dateObj.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        setForm({
            id: pub.id,
            title: pub.title,
            desc: pub.desc,
            link: pub.link,
            publish_date: formattedDate,
            authors: [...pub.authors],
        });
        setIsUpdateMode(true);
        setIsDialogOpen(true);
    };


    // Submit create/update
    const handleSubmit = async () => {
        try {
            if (!form.title || !form.desc || !form.publish_date ) {
                toast.warning("Please fill out all forms", {
                    position: "bottom-right",
                });
                return;
            }
            setIsLoading(true);
            const endpoint = isUpdateMode ? `update-publication/${form.id}` : "create-publication";
            const method = isUpdateMode ? "PUT" : "POST";

            const body = {
                title: form.title,
                abstract: form.desc,
                link: form.link,
                date: form.publish_date,
                authors: form.authors,
            };

            const res = await makeRequest(endpoint, {
                method,
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            });

            if (res.status === "success") {
                toast.success((isUpdateMode ? "Updated successfully." : "Created successfully."), {
                    position: "bottom-right",
                });
                fetchPublications();
                setIsDialogOpen(false);
                setIsUpdateMode(false);
                setForm({ id: null, title: "", desc: "", link: "", publish_date: "", authors: [] });
            } else {
                setError(isUpdateMode ? "Failed to update publication." : "Failed to create publication.");
                toast.error(isUpdateMode ? "Failed to update publication. " + res.detail : "Failed to create publication." + res.detail, {
                    position: "bottom-right",
                });
            }
        } catch (err) {
            console.error(isUpdateMode ? "Error updating publication:" : "Error creating publication:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete with confirmation
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this publication?")) return;
        try {
            await makeRequest(`delete-publication/${id}`, { method: "DELETE" });
            fetchPublications();
        } catch (err) {
            console.error("Error deleting publication:", err);
        }
    };


    // const papersForAllYears = publications
    return (
        <div className='flex w-full justify-center'>
            <ToastContainer/>
            <div className='h-auto w-full pb-[60px] mx-[5vw] max-w-[65em]'>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <h3 className="my-6 sm:my-10 text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] font-[200] tracking-[0.03em] text-[--color-5]">
                        PUBLICATIONS
                    </h3>

                    {/* Button */}
                    {backendUser?.account_type === 'admin' && (
                        <button
                            onClick={() => {
                                setIsDialogOpen(true);
                                setIsUpdateMode(false);
                                setForm({ id: null, title: "", desc: "", link: "", publish_date: "", authors: [""] });
                            }}
                            className="rounded-2xl h-10 mt-4 sm:mt-0 mb-4 sm:mb-0 px-4 sm:px-6 py-2 shadow-md bg-[--color-heading] text-white text-sm sm:text-base hover:opacity-90 transition"
                        >
                            + Add Publications
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

                    <div className='flex flex-col gap-10'>
                        {/* year */}
                        {
                            pubList.map((papersPerYear) => (
                                <div className='flex pr-2 ' key={papersPerYear.year}>
                                    <div className='flex flex-col mr-2 sm:mr-0 min-w-[40px] sm:min-w-[70px] lg:min-w-[100px] justify-center items-center'>
                                        <p className='text-[--color-5] text-xs sm:text-sm'>{papersPerYear.year}</p>
                                        <div className='w-[1px] h-full bg-[--color-8] mt-3'></div>
                                    </div>
                                    <div className='flex flex-col gap-5 '>
                                        {
                                            papersPerYear.papers.map((paper) => (
                                                <div className=' border-2 rounded-lg p-3 shadow-sm bg-[--color-9]' key={paper.link}>
                                                    {/* <h4 className='text-base sm:text-lg lg:text-xl text-[--color-5]'>
                                                    {paper.title}
                                                </h4> */}
                                                    <Link target='_blank' href={paper.link} className='mt-2 text-[18px] tracking-[0.05em] font-bold text-[--color-heading] cursor-pointer hover:underline'>{paper.title}</Link>

                                                    <div key={paper.title} className='flex flex-wrap gap-3 sm:gap-5 sm:gap-y-3 py-3'>
                                                        {
                                                            paper.authors.map((author) => (
                                                                <div key={author} className='bg-[--color-8] w-fit py-0.5 px-2 sm:px-5 rounded-full'>
                                                                    <p className='text-[--color-5] text-xs'>{author}</p>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    <p className='text-[--color-5] text-xs sm:text-sm'>{paper.desc + " ..."}</p>
                                                    <div className='flex justify-between items-center pt-5'>
                                                        <p className='text-[--color-6] text-xs sm:text-sm'>{paper.publish_date}</p>
                                                        <div className='flex gap-1 items-center cursor-pointer'>
                                                            <Link target='_blank' href={paper.link} className='text-[--color-heading] text-xs sm:text-sm'>READ MORE</Link>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                                                stroke="currentColor" className="h-3 w-3 sm:h-4 sm:w-4 stroke-[--color-heading]">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                            </svg>

                                                            {backendUser?.account_type === 'admin' && (
                                                                <div>
                                                                    <button
                                                                        onClick={() => handleOpenUpdate(paper)}
                                                                        className="rounded-2xl px-4 py-1 shadow-md bg-blue-500 text-white hover:opacity-90 transition text-sm"
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    {/* Delete with confirmation */}
                                                                    <DeletePublicationButton id={paper.id} onDeleted={fetchPublications} /></div>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>

                                </div>
                            ))
                        }


                    </div>

                </div>

                <div>
                    <p className='mt-5'>For more of the latest publications, please visit the Google Scholar profile link: </p>
                    <Link className='text-blue-400 underline' target='_blank' href={'https://scholar.google.com/citations?user=31mWMiEAAAAJ&hl=en'}>https://scholar.google.com/citations?user=31mWMiEAAAAJ&hl=en</Link>
                </div>

                {/* Dialog for Create/Update */}
                {isDialogOpen && backendUser?.account_type === 'admin' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 animate-fade-in">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-scale-up transition-transform">
                            <h2 className="text-xl font-semibold mb-4">
                                {isUpdateMode ? "Update Publication" : "Create Publication"}
                            </h2>

                            <input
                                name="title"
                                placeholder="Title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />
                            <textarea
                                name="desc"
                                placeholder="Abstract"
                                value={form.desc}
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
                                name="publish_date"
                                type="date"
                                value={form.publish_date}
                                onChange={handleChange}
                                className="w-full border p-2 rounded mb-3"
                            />

                            <div className="mb-3">
                                <label className="font-semibold">Authors</label>
                                {form.authors.map((author, idx) => (
                                    <div key={idx} className="flex gap-2 mb-1">
                                        <input
                                            value={author}
                                            onChange={(e) => handleAuthorChange(idx, e.target.value)}
                                            className="flex-1 border p-2 rounded"
                                            placeholder={`Author ${idx + 1}`}
                                        />
                                        <button
                                            onClick={() => removeAuthorField(idx)}
                                            className="text-red-500 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addAuthorField}
                                    className="text-blue-500 underline text-sm mt-1"
                                >
                                    + Add Author
                                </button>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsDialogOpen(false)}
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

export default Publications