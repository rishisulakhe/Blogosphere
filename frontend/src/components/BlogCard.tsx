import { Link } from "react-router-dom";
interface BlogCardProps {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardProps) => {
    return (
        <Link to={`/blog/${id}`} className="block">
            <div className="card w-full max-w-screen-md bg-base-100 shadow-md p-4 cursor-pointer hover:shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Avatar name={authorName} />
                    <span className="text-sm text-gray-600">{authorName}</span>
                    <Circle />
                    <span className="text-sm text-gray-500">{publishedDate}</span>
                </div>
                <h2 className="card-title text-lg font-bold">{title}</h2>
                <p className="text-gray-700 text-sm">{content.slice(0, 100) + "..."}</p>
                <div className="text-gray-500 text-xs mt-2">{`${Math.ceil(content.length / 100)} minute(s) read`}</div>
            </div>
        </Link>
    );
};

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-gray-500"></div>;
}

export function Avatar({ name, size = "small" }: { name: string; size?: "small" | "big" }) {
    return (
        <div className={`avatar ${size === "small" ? "w-8 h-8" : "w-12 h-12"}`}>
            <div className="bg-neutral text-white flex items-center justify-center rounded-full w-full h-full">
                <span className={size === "small" ? "text-sm justify-center" : "text-lg justify-center font-bold"}>{name[0]}</span>
            </div>
        </div>
    );
}

