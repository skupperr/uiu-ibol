"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setGetToken, makeRequest } from "@/utils/api";

type BackendUser = {
    uid: string;
    email: string;
    account_type: string;
    name: string;
    profile_tag: string;
    img_link: string;
    linkedin: string;
    github: string;
    research_gate: string;
    google_scholar: string;
};

type AuthContextType = {
    user: User | null;
    backendUser: BackendUser | null;
    loading: boolean;
    getToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    backendUser: null,
    loading: true,
    getToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
    const [loading, setLoading] = useState(true);

    const getToken = async () => {
        if (user) return await user.getIdToken();
        return null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Set global token getter to always return the current Firebase token
                setGetToken(async () => await firebaseUser.getIdToken());

                try {
                    const token = await firebaseUser.getIdToken();
                    const res = await makeRequest("get-profile", {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (res.status === "success") {
                        const profile = res.user;
                        // 🔑 If Firebase email is different from MySQL email → update MySQL
                    if (firebaseUser.email && firebaseUser.email !== profile.email) {
                        await makeRequest("update-profile-email", {
                            method: "PUT",
                            body: JSON.stringify({ email: firebaseUser.email }),
                            headers: { Authorization: `Bearer ${token}` },
                        });
                    }
                        setBackendUser(res.user);
                    }

                    
                } catch (err) {
                    console.error("Error fetching backend profile:", err);
                }
            } else {
                setBackendUser(null);
                setGetToken(async () => null); // no user
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    return (
        <AuthContext.Provider value={{ user, backendUser, loading, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
