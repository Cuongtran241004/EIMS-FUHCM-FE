import { useState, useEffect } from 'react';
import { availableSlots } from '../../components/API/availableSlots';
import { message } from 'antd';

export const useFetchAvailableSlots = (semesterId) => {
  const [availableSlotsData, setAvailableSlotsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!semesterId) return;

    const fetchAvailableSlots = async () => {
      try {
        const response = await availableSlots(semesterId);
        const arrayFromObject = Object.values(response || {});
        setAvailableSlotsData(arrayFromObject[1]);
      } catch (e) {
        console.error('Error fetching available slots:', e.message);
        setError(e.message || 'Error fetching available slots.');
        message.error(e.message || 'Error fetching available slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [semesterId]);

  return { availableSlotsData, loading, error };
};
