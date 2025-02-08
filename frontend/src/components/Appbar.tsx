import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";

export const Appbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-md px-10 py-4">
            <div className="flex-1">
                <Link to={'/blogs'} className="btn btn-ghost text-xl font-bold">
                    Medium
                </Link>
            </div>
            <div className="flex-none">
                <Link to={`/publish`}>
                    <button className="btn btn-success mr-4">New</button>
                </Link>
                <Avatar size={"big"} name="Rishi" />
            </div>
        </div>
    );
};
