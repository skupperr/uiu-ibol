import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../lib/firebase";
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
import { makeRequest } from "@/utils/api";

function DeleteResearchButton({ id, type, onDeleted }: { id: number; type: "research-focus" | "ongoing-projects"; onDeleted: () => void }) {
    // const { makeRequest } = useApi();

    const handleDelete = async () => {
        try {
            const res = await makeRequest(`delete-research/${id}`, { method: "DELETE" });
            if (res.status === "success") {
                if (res.deleted_img_links && res.deleted_img_links.length > 0) {
                    for (const link of res.deleted_img_links) {
                        try {
                            const fileRef = ref(storage, decodeURIComponent(new URL(link).pathname.split("/o/")[1].split("?")[0]));
                            await deleteObject(fileRef);
                            console.log("Firebase image deleted:", link);
                        } catch (err) {
                            console.warn("Error deleting image from Firebase:", err);
                        }
                    }
                }
                onDeleted(); // refresh list
            }
        } catch (err) {
            console.error("Error deleting research:", err);
        }
    };


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="rounded-2xl px-4 py-2 mb-4 shadow-md bg-red-500 text-white hover:opacity-90 transition  text-sm ml-2">Delete</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the news item.
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
export default DeleteResearchButton