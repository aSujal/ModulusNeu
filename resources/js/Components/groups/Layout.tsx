import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Group } from "@/types";
import { Loader } from "lucide-react";
import GroupSidebar from "./GroupSidebar";

interface GroupLayoutProps {
    group: Group;
    children: React.ReactNode;
}

const GroupLayout = ({ group, children }: GroupLayoutProps) => {
    return (
        <ResizablePanelGroup direction="horizontal" autoSaveId={"workspace-layout"}>
            <ResizablePanel defaultSize={20} minSize={11} className="bg-[#0e0c0c]">
                <GroupSidebar group={group} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80} minSize={20}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
export default GroupLayout;