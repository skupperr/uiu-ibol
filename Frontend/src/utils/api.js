let globalGetToken = null;

// Allow AuthContext to register getToken globally
export const setGetToken = (fn) => {
    globalGetToken = fn;
};

// Plain function (no hooks)
export const makeRequest = async (endpoint, options = {}, autoAttachToken = true) => {
    let token = null;

    if (autoAttachToken && globalGetToken) {
        token = await globalGetToken();
    }

    const defaultOptions = {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };

    const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {}),
        },
    });


    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return { status: "error", detail: errorData?.detail || "An error occurred" };
    }

    return response.json();
};
