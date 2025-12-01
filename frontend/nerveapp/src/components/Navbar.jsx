import {Link} from "react-router";
import { PlusIcon, CircleUser } from "lucide-react";


const Navbar = () => {
    return (
        <header className= "bg-base-300 border-b border-base-content/10" >
            <div className="mx-auto max-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary font-mono tracking-tight">DoubleDog</h1>
                    <div className="flex times-center gap-4">
                        <Link to={"/create"} className="btn btn-primary">
                        <PlusIcon className="size-5" />
                        <span>Create post</span>
                        </Link>
                        <Link to ={"/user"} className="btn btn-outline">
                        <CircleUser className="size-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;