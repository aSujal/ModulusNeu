import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Group } from "@/types";
import GroupSidebar from "./GroupSidebar";

interface GroupLayoutProps {
    group: Group;
    children: React.ReactNode;
}

const GroupLayout = ({ group, children }: GroupLayoutProps) => {
    return (
        <ResizablePanelGroup direction="horizontal" autoSaveId={"workspace-layout"}>
            <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-[#090a0a]">
                <GroupSidebar group={group} />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-[#0d0f0f]" />
            <ResizablePanel defaultSize={60} minSize={40} >
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
export default GroupLayout;
