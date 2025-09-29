'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import { makeRequest } from "@/utils/api";
import Link from 'next/link'
import { useAuth } from "@/context/AuthContext";
import { TailChase } from 'ldrs/react'
import 'ldrs/react/TailChase.css'

const People = () => {
    const [roles, setRoles] = useState<{
        id: number;
        role: string;
        peoples: {
            id: number;
            name: string;
            email: string;
            photo: string;
            position: string;
            linkedin: string;
            github: string;
            google_scholar: string;
            research_gate: string;
        }[];
    }[]>([])
    const { backendUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedRoleIndex, setSelectedRoleIndex] = useState<number | null>(null)
    const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false)
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [newRoleName, setNewRoleName] = useState('')

    useEffect(() => {
        setIsLoading(true)
        const fetchRoles = async () => {
            try {
                const data = await makeRequest("roles");
                
                if (data.status === "success") {
                    setRoles(
                        data.roles.map((r: any) => ({
                            id: r.id,
                            role: r.role_name,
                            peoples: r.peoples || [], // now backend provides this
                        }))
                    );
                }
            } catch (err) {
                console.error("Failed to fetch roles", err);
            }
            finally {
                setIsLoading(false)
            }
        };

        fetchRoles();
    }, []);



    const addRole = async () => {
        if (!newRoleName.trim()) return;

        try {
            const data = await makeRequest("roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_name: newRoleName.trim() }),
            });

            if (data.status === "success") {
                setRoles((prev) => [
                    ...prev,
                    { id: data.id, role: data.role_name, peoples: [] },
                ]);
                setNewRoleName("");
                setIsAddRoleDialogOpen(false);
            }
        } catch (err) {
            console.error("Failed to add role", err);
        }
        finally {
            setIsAddRoleDialogOpen(false)
        }
    };

    const removeRole = async (index: number) => {
        const roleId = roles[index].id;

        try {
            await makeRequest(`roles/${roleId}`, {
                method: "DELETE",
            });

            setRoles((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Failed to remove role", err);
        }
    };



    const moveRoleUp = async (index: number) => {
        if (index === 0) return;

        setRoles((prev) => {
            const newRoles = [...prev];
            [newRoles[index - 1], newRoles[index]] = [
                newRoles[index],
                newRoles[index - 1],
            ];

            // persist new order
            makeRequest("roles/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    newRoles.map((r, i) => ({ id: r.id, position: i + 1 }))
                ),
            });

            return newRoles;
        });
    };

    const moveRoleDown = async (index: number) => {
        if (index === roles.length - 1) return;

        setRoles((prev) => {
            const newRoles = [...prev];
            [newRoles[index + 1], newRoles[index]] = [
                newRoles[index],
                newRoles[index + 1],
            ];

            makeRequest("roles/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    newRoles.map((r, i) => ({ id: r.id, position: i + 1 }))
                ),
            });

            return newRoles;
        });
    };

    // Open assign dialog
    const openAssignDialog = async (roleIndex: number) => {
        setSelectedRoleIndex(roleIndex);
        setIsAssignDialogOpen(true);

        try {
            const data = await makeRequest("users/unassigned", { method: "GET" });
            if (data.status === "success") {
                
                setAvailableUsers(data.users);
            }
        } catch (err) {
            console.error("Failed to fetch unassigned users", err);
        }
    };


    const assignUserToRole = async (userUid: string, roleIndex: number | null) => {
        if (roleIndex === null) return;

        try {
            const role = roles[roleIndex];
            await makeRequest("roles/assign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role_id: role.id, user_id: userUid }),
            });

            // Find user in available list
            const user = availableUsers.find((u) => u.uid === userUid);
            if (!user) return;

            // Update roles
            setRoles((prev) => {
                const newRoles = [...prev];
                // prevent accidental duplicates
                if (!newRoles[roleIndex].peoples.some((p) => p.id === user.uid)) {
                    newRoles[roleIndex].peoples.push({
                        id: user.uid,
                        name: user.name,
                        email: user.email,
                        position: user.position,
                        photo: user.img_link || "/images/default-avatar.png",
                        linkedin: user.linkedin || "",
                        github: user.github || "",
                        google_scholar: user.google_scholar || "",
                        research_gate: user.research_gate || "",
                    });
                }
                return newRoles;
            });

            // ✅ Fix: use uid instead of id
            setAvailableUsers((prev) => prev.filter((u) => u.uid !== userUid));
            setIsAssignDialogOpen(false);
        } catch (err) {
            console.error("Failed to assign user", err);
        }
    };




    const removeUserFromRole = async (roleIndex: number, userId: number) => {
        const roleId = roles[roleIndex].id;

        try {
            await makeRequest(`roles/${roleId}/unassign/${userId}`, {
                method: "DELETE",
            });

            setRoles((prev) => {
                const newRoles = [...prev];
                newRoles[roleIndex].peoples = newRoles[roleIndex].peoples.filter(
                    (p) => p.id !== userId
                );
                return newRoles;
            });
        } catch (err) {
            console.error("Failed to unassign user", err);
        }
    };




    return (
        <div className="flex w-full justify-center py-10 px-4">

            <div className="w-full max-w-[65em]">
                
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[30px] md:text-[35px] lg:text-[40px] font-[200] tracking-[0.03em] text-[--color-5]">PEOPLE</h3>
                    {backendUser?.account_type === 'admin' && (
                        <button
                            className="px-4 py-2 bg-[--color-heading] text-white rounded-md hover:bg-[--color-4] transition"
                            onClick={() => setIsAddRoleDialogOpen(true)}
                        >
                            Add Role
                        </button>
                    )}

                </div>

                {isLoading && (
                    <div className="m-30 mt-16 mb-16  inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                        <TailChase
                            size="40"
                            speed="1.75"
                            color="black"
                        />
                    </div>
                )}

                {roles.map((role, i) => (
                    <div key={i} className="mb-8 pb-6">
                        {/* Role Header & Controls */}
                        <div
                            className={`flex items-center mb-4 border-t-2 border-b-2 border-gray-200 py-2 ${backendUser?.account_type === "admin"
                                ? "justify-between"
                                : "justify-center"
                                }`}
                        >
                            <h3 className="text-[20px] md:text-[24px] font-[600] text-[--color-5]">{role.role}</h3>

                            {backendUser?.account_type === 'admin' && (
                                <div className="flex gap-2">
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-400 transition"
                                        onClick={() => removeRole(i)}
                                    >
                                        Remove
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-200 transition"
                                        onClick={() => moveRoleUp(i)}
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-200 transition"
                                        onClick={() => moveRoleDown(i)}
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-[--color-heading] text-white rounded-md hover:bg-[--color-4] transition"
                                        onClick={() => {
                                            setSelectedRoleIndex(i)
                                            setIsAssignDialogOpen(true)
                                            openAssignDialog(i)
                                        }}
                                    >
                                        Assign Users
                                    </button>
                                </div>
                            )}

                        </div>

                        {/* Assigned Users */}
                        <ScrollArea className="h-fit py-4 px-2 rounded-xl">
                            <div className="flex gap-x-44 gap-y-6 flex-wrap justify-center">
                                {role.peoples.map((people) => (
                                    <div key={people.id} className="flex flex-col items-center relative">
                                        {/* <div className="w-[150px] h-[150px] rounded-full overflow-hidden border-[2px] border-[--color-3]">
                                            <Image src={people.photo} alt={people.name} width={150} height={150} className="w-full h-full object-cover" />
                                        </div> */}
                                        <h3 className="text-xl font-[600] text-[--color-p] mt-3">{people.name}</h3>
                                        <h4 className="text-base text-[--color-5] opacity-80">{people.position}</h4>
                                        {backendUser?.account_type === 'admin' && (
                                            <button
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-400"
                                                onClick={() => removeUserFromRole(i, people.id)}
                                            >
                                                ×
                                            </button>
                                        )}

                                        <div className="flex gap-3 py-2">
                                            {people.google_scholar && (
                                                <Link target="_blank" href={people.google_scholar}>
                                                    <Image
                                                        src="/images/scholar.png"
                                                        alt="Google Scholar"
                                                        width={24}
                                                        height={24}
                                                        className="w-6 h-auto"
                                                    />
                                                </Link>
                                            )}
                                            {people.research_gate && (
                                                <Link target="_blank" href={people.research_gate}>
                                                    <Image
                                                        src="/images/researchgate.png"
                                                        alt="Research_gate"
                                                        width={24}
                                                        height={24}
                                                        className="w-6 h-auto"
                                                    />
                                                </Link>
                                            )}
                                            {people.github && (
                                                <Link target="_blank" href={people.github}>
                                                    <Image
                                                        src="/images/github.png"
                                                        alt="GitHub"
                                                        width={24}
                                                        height={24}
                                                        className="w-6 h-auto"
                                                    />
                                                </Link>
                                            )}
                                            {people.linkedin && (
                                                <Link target="_blank" href={people.linkedin}>
                                                    <Image
                                                        src="/images/linkedin.png"
                                                        alt="LinkedIn"
                                                        width={24}
                                                        height={24}
                                                        className="w-6 h-auto"
                                                    />
                                                </Link>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                ))}

                {/* Manual Assign Users Dialog */}
                {isAssignDialogOpen && selectedRoleIndex !== null && backendUser?.account_type === 'admin' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-[28rem]">
                            <h3 className="text-lg font-semibold mb-4">Assign User</h3>

                            {availableUsers.length > 0 ? (
                                <ul className="space-y-3">
                                    {availableUsers.map((user) => (
                                        <li
                                            key={user.uid}
                                            className="flex items-center justify-between border rounded-lg p-2 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.img_link || "/images/default-avatar.png"}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover border"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-800">{user.name}</span>
                                                    <span className="text-sm text-gray-500">{user.email}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => assignUserToRole(user.uid, selectedRoleIndex)}
                                                className="px-3 py-1 text-sm bg-[--color-heading] text-white rounded-lg hover:opacity-80"
                                            >
                                                Assign
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    All users are already assigned
                                </p>
                            )}

                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => setIsAssignDialogOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                {/* Manual Add Role Dialog */}
                {isAddRoleDialogOpen && backendUser?.account_type === 'admin' && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        onClick={() => setIsAddRoleDialogOpen(false)}
                    >
                        <div
                            className="bg-white rounded-xl w-full max-w-sm p-6 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsAddRoleDialogOpen(false)}
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-semibold mb-4">Add Role</h2>
                            <input
                                type="text"
                                placeholder="Role Name"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="w-full border p-2 rounded-lg mb-4 focus:ring-2 focus:ring-[--color-heading] outline-none"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-200 transition"
                                    onClick={() => setIsAddRoleDialogOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-[--color-heading] text-white rounded-md hover:bg-[--color-4] transition"
                                    onClick={addRole}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default People


