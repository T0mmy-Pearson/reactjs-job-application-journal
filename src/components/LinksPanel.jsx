import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LinksPanel({ user }) {
    const [links, setLinks] = useState([]);
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    // Load this user's links
    useEffect(() => {
        async function loadLinks() {
            if (!user) {
                setLinks([]);
                return;
            }
            const snap = await getDoc(doc(db, "links", user.uid));
            setLinks(snap.exists() ? (snap.data().links || []) : []);
        }
        loadLinks();
    }, [user]);

    async function persist(newLinks) {
        setLinks(newLinks);
        if (user) {
            await setDoc(doc(db, "links", user.uid), { links: newLinks });
        }
    }

    // Prepend https:// when the user omits a scheme (e.g. "linkedin.com/in/me"),
    // but leave existing schemes (http:, https:, mailto:, tel:, …) untouched.
    function normalizeUrl(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return "";
        if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
        if (trimmed.startsWith("//")) return `https:${trimmed}`;
        return `https://${trimmed}`;
    }

    function handleAdd(e) {
        e.preventDefault();
        const trimmedName = name.trim();
        const normalizedUrl = normalizeUrl(url);
        if (!trimmedName || !normalizedUrl) return;
        persist([...links, { id: Date.now().toString(), name: trimmedName, url: normalizedUrl }]);
        setName("");
        setUrl("");
        setShowForm(false);
    }

    function handleDelete(id) {
        persist(links.filter(link => link.id !== id));
    }

    async function handleCopy(link) {
        try {
            await navigator.clipboard.writeText(link.url);
            setCopiedId(link.id);
            setTimeout(() => setCopiedId(null), 1500);
        } catch {
            // Clipboard unavailable (e.g. insecure context) — open as a fallback
            window.open(link.url, "_blank", "noopener,noreferrer");
        }
    }

    return (
        <div className="linksPanel">
            <div className="linksHeader">
                <h2><i className="fa-solid fa-link"></i> Links</h2>
                <button
                    type="button"
                    className="linksAddToggle"
                    onClick={() => setShowForm(s => !s)}
                    title={showForm ? "Cancel" : "Add link"}
                    aria-label={showForm ? "Cancel" : "Add link"}
                >
                    <i className={`fa-solid ${showForm ? "fa-minus" : "fa-plus"}`}></i>
                </button>
            </div>

            {showForm && (
                <form className="linksForm" onSubmit={handleAdd}>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Name (e.g. LinkedIn)"
                    />
                    <input
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://…"
                    />
                    <button type="submit" className="linksSubmit">Add link</button>
                </form>
            )}

            {links.length === 0 ? (
                <p className="linksEmpty">No links yet. Add your profiles to copy them in one click.</p>
            ) : (
                <ul className="linksList">
                    {links.map(link => (
                        <li key={link.id} className="linkItem">
                            <button
                                type="button"
                                className="linkChip"
                                onClick={() => handleCopy(link)}
                                title={`Copy ${link.url}`}
                            >
                                <i className="fa-solid fa-link"></i>
                                <span className="linkName">{link.name}</span>
                                <span className="linkCopyHint">
                                    {copiedId === link.id ? "Copied!" : "Copy"}
                                </span>
                            </button>
                            <button
                                type="button"
                                className="linkDelete"
                                onClick={() => handleDelete(link.id)}
                                title="Remove link"
                                aria-label="Remove link"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
