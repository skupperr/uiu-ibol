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

function DeletePublicationButton({ id, onDeleted }: { id: number; onDeleted: () => void }) {
    // const { makeRequest } = useApi();
    const handleDelete = async () => {
        try {
            await makeRequest(`delete-publication/${id}`, { method: "DELETE" });
            onDeleted(); // refresh list
        } catch (err) {
            console.error("Error deleting news:", err);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="rounded-2xl px-4 py-1 shadow-md bg-red-500 text-white hover:opacity-90 transition  text-sm ml-2">Delete</button>
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
export default DeletePublicationButton