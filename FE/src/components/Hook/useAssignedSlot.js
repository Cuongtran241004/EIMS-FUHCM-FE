import { useEffect, useState } from "react";
import { getAssignedSlot } from "../API/getAssignedSlot";

export const useAssignedSlot = (selectedSemester, reloadSlots) => {
    const [assignedSlotDetail, setAssignedSlotDetail] = useState([]);
    
    useEffect(() => {
        if (!selectedSemester) return;
    
        const fetch = async () => {
        try {
            const response = await getAssignedSlot(selectedSemester);
            setAssignedSlotDetail(response);
        } catch (e) {
            console.error("fetch Error: ", e.message);
        }
        };
    
        fetch();
    }, [selectedSemester, reloadSlots]);
    
    return { assignedSlotDetail };
    }