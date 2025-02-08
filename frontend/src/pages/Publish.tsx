import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <Appbar />
            <div className="flex justify-center w-full pt-8">
                <div className="max-w-screen-lg w-full">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="input input-info w-full"
                        placeholder="Title"
                    />
                    <TextEditor onChange={(e) => setDescription(e.target.value)} />
                    <button
                        onClick={async () => {
                            const response = await axios.post(
                                `${BACKEND_URL}/api/v1/blog`,
                                { title, content: description },
                                { headers: { Authorization: localStorage.getItem("token") } }
                            );
                            navigate(`/blog/${response.data.id}`);
                        }}
                        type="submit"
                        className="btn btn-primary mt-4"
                    >
                        Publish post
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div className="mt-2">
            <div className="w-full mb-4">
                <div className="border input-info rounded-lg p-2 bg-white">
                    <textarea
                        onChange={onChange}
                        id="editor"
                        rows={8}
                        className="textarea w-full text-sm text-gray-800 focus:outline-none"
                        placeholder="Write an article..."
                        required
                    />
                </div>
            </div>
        </div>
    );
}
