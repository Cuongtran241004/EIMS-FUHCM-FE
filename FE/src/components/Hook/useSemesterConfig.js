import { useState, useEffect } from "react";
import { getSemesterConfig } from "../API/getSemesterConfig";
import { ConfigType } from "../../configs/enum";

export function useSemesterConfig(semesterId) { 
  const [semesterConfig, setSemesterConfig] = useState(null);

  useEffect(() => {
    const fetchSemesterConfig = async () => {
      try {
        const response = await getSemesterConfig(semesterId);
        setSemesterConfig(response);
      } catch (e) {
        console.error("getSemesterConfig Error: ", e.message);
      }
    };
    fetchSemesterConfig();
  }, [semesterId]);

  const getConfigValue = (configType) => {
    if (!semesterConfig) return 'Not found';
    const config = semesterConfig.find(item => item.configType === configType);
    return config ? config.value : 'Not found';
  };

  return { semesterConfig, getConfigValue };
}