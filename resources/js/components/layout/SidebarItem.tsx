import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

interface SidebarButtonProps {
    icon?: React.ElementType;
    label?: string;
    className?: string;
    isActive?: boolean;
    children?: ReactNode;
    onClick: () => void;
}

const SidebarButton = ({
    icon: Icon,
    label,
    className,
    children,
    isActive,
    onClick,
}: SidebarButtonProps) => {
    return (
        <div className="group flex flex-col justify-center items-center gap-0.5 cursor-pointer">
            <Button
                variant={"transparent"}
                className={cn(
                    "size-9 p-2 group-hover:bg-primary/20",
                    isActive && "bg-accent/20",
                    className
                )}
                onClick={onClick}
            >
                {children && children}
                {Icon && (
                    <Icon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                )}
            </Button>
            {label && <span className="text-[11px] text-white">{label}</span>}
        </div>
    );
};

export default SidebarButton;
