import { useEffect, useState } from "react";
import { cancellableSlotList } from "../API/cancellableSlotList";


export const useCancellableSlotList = (selectedSemester, reloadSlots) => {
    const [cancellableSlot, setCancellableSlot] = useState([]);
    
    useEffect(() => {
        if (!selectedSemester) return;
    
        const fetch = async () => {
        try {
            const response = await cancellableSlotList(selectedSemester);
            const examSlotDetailSet =
            response;
            setCancellableSlot(examSlotDetailSet);
        } catch (e) {
            console.error("fetch Error: ", e.message);
        }
        };
    
        fetch();
    }, [selectedSemester, reloadSlots]);
    
    return { cancellableSlot };
    }