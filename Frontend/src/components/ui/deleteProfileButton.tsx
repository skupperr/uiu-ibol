"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { deleteUser } from "firebase/auth";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../lib/firebase";
import { makeRequest } from "@/utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeleteProfileButton() {
    const { user } = useAuth();

    const handleDelete = async () => {
        if (!user) return;

        try {
            // 1️⃣ Delete backend record first (valid token still exists)
            const res = await makeRequest("delete-account", { method: "DELETE" });

            if (res.status !== "success") {
                toast.error("Failed to delete account.");
                return;
            }

            // 2️⃣ Delete Firebase account
            await deleteUser(user);
            if (res.old_img_link) {
                try {
                    const fileRef = ref(storage, decodeURIComponent(new URL(res.old_img_link).pathname.split("/o/")[1].split("?")[0]));
                    await deleteObject(fileRef);
                    console.log("Firebase image deleted successfully");
                } catch (err) {
                    console.warn("Error deleting image from Firebase:", err);
                }
            }

            toast.success("Account deleted successfully.");

            // Optional: redirect
            window.location.href = "/";
        } catch (err: any) {
            console.error("Error deleting account:", err);
            toast.error(err.message || "Failed to delete account.");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition">
                    Delete Account
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. Your account and all associated data will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteProfileButton;
