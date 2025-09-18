import { useState } from "react";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "react-toastify";

export default function ChangeEmailForm() {
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.currentUser) {
            toast.error("You must be logged in.");
            return;
        }

        try {
            setLoading(true);

            // Re-authenticate
            const cred = EmailAuthProvider.credential(
                auth.currentUser.email || "",
                password
            );
            await reauthenticateWithCredential(auth.currentUser, cred);

            // Send verification link to new email
            await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

            toast.success(
                "Verification link sent to your new email. Confirm it to complete the change.",
                { position: "bottom-right" }
            );

            setNewEmail("");
            setPassword("");
        } catch (err: any) {
            toast.error(err.message || "Failed to update email.");
            console.error("Error updating email:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleChangeEmail} className="bg-white p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Change Email</h3>

            <input
                type="email"
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border w-full p-2 mb-2 rounded"
                required
            />

            <input
                type="password"
                placeholder="Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full p-2 mb-2 rounded"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-orange-400 mr-5 text-white px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-50"
            >
                {loading ? "Sending..." : "Update Email"}
            </button>
            
        </form>
        
    );
}
