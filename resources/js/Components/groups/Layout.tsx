
import { Group } from "@/types";
import { Loader } from "lucide-react";
import GroupSidebar from "./GroupSidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";

interface GroupLayoutProps {
    group: Group;
    children: React.ReactNode;
}

const GroupLayout = ({ group, children }: GroupLayoutProps) => {
    return (
        <ResizablePanelGroup direction="horizontal" autoSaveId={"workspace-layout"}>
            <ResizablePanel defaultSize={40} minSize={20} className="bg-[#0e0c0c]">
                <GroupSidebar group={group} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={40}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
export default GroupLayout;