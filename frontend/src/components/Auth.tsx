import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "1medium-common";
import axios from "axios";
import { BACKEND_URL } from "./../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function sendRequest() {
        setLoading(true);
        setError("");
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
                {
                    email: postInputs.username,
                    password: postInputs.password
                }
            );
            const jwt = response.data.jwt;
            localStorage.setItem("token", "Bearer " + jwt);
            navigate("/blogs");
        } catch  {
            setError("Error while signing up. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex justify-center items-center bg-base-200">
            <div className="card w-96 bg-base-100 shadow-xl p-6">
                <div className="text-3xl font-bold text-center mb-4">
                    {type === "signup" ? "Create an Account" : "Sign in"}
                </div>
                <div className="text-sm text-center text-gray-500 mb-4">
                    {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="pl-2 text-primary" to={type === "signin" ? "/signup" : "/signin"}>
                        {type === "signin" ? "Sign up" : "Sign in"}
                    </Link>
                </div>
                {error && <div className="alert alert-error text-sm mb-4">{error}</div>}
                <div className="space-y-4">
                    {type === "signup" && (
                        <LabelledInput label="Name" placeholder="John Doe..." onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })} />
                    )}
                    <LabelledInput label="Email" placeholder="john@gmail.com" onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })} />
                    <LabelledInput label="Password" type="password" placeholder="••••••" onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })} />
                    <button onClick={sendRequest} type="button" className={`btn btn-primary w-full ${loading ? "loading" : ""}`}>{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return (
        <div>
            <label className="label">
                <span className="label-text font-semibold">{label}</span>
            </label>
            <input onChange={onChange} type={type || "text"} className="input input-primary w-full" placeholder={placeholder} required />
        </div>
    );
}
