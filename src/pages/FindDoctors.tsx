import { useEffect } from "react";
import { DoctorsList } from "@/components/home/DoctorsList";

export default function FindDoctors() {
  useEffect(() => {
    document.title = "Find Doctors in Pune | ArogyaAI+";
  }, []);

  return (
    <div className="container max-w-7xl py-8 px-4 md:px-6">
      <DoctorsList />
    </div>
  );
} 