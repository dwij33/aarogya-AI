import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Star, Filter, Phone, Award } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  location: string;
  availableToday: boolean;
  nextAvailable: string;
  experience: string;
  consultationFee: string;
  degrees: string;
  hospital?: string;
}

export function DoctorsList() {
  const [specialty, setSpecialty] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const { toast } = useToast();
  
  const doctors: Doctor[] = [
    // Pulmonologists
    {
      id: "1",
      name: "Dr. Amit Sharma",
      specialty: "Pulmonologist",
      rating: 4.9,
      location: "Koregaon Park, Pune",
      availableToday: true,
      nextAvailable: "Today, 4:30 PM",
      experience: "15 years",
      consultationFee: "₹800",
      degrees: "MBBS, MD (Pulmonary Medicine)",
      hospital: "Sahyadri Hospital"
    },
    {
      id: "2",
      name: "Dr. Aisha Khan",
      specialty: "Pulmonologist",
      rating: 4.8,
      location: "Camp, Pune",
      availableToday: true,
      nextAvailable: "Today, 5:15 PM",
      experience: "11 years",
      consultationFee: "₹850",
      degrees: "MBBS, MD (Respiratory Medicine)",
      hospital: "Jehangir Hospital"
    },
    {
      id: "3",
      name: "Dr. Vijay Patil",
      specialty: "Pulmonologist",
      rating: 4.7,
      location: "Shivaji Nagar, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 10:30 AM",
      experience: "14 years",
      consultationFee: "₹900",
      degrees: "MBBS, MD, DNB (Respiratory Medicine)",
      hospital: "Ruby Hall Clinic"
    },
    {
      id: "4",
      name: "Dr. Anita Deshmukh",
      specialty: "Pulmonologist",
      rating: 4.6,
      location: "Aundh, Pune",
      availableToday: true,
      nextAvailable: "Today, 7:00 PM",
      experience: "9 years",
      consultationFee: "₹750",
      degrees: "MBBS, MD (Pulmonary Medicine)",
      hospital: "Aundh Hospital"
    },
    {
      id: "5",
      name: "Dr. Rakesh Joshi",
      specialty: "Pulmonologist",
      rating: 4.9,
      location: "Kothrud, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 11:45 AM",
      experience: "18 years",
      consultationFee: "₹950",
      degrees: "MBBS, MD, DM (Pulmonology)",
      hospital: "Deenanath Mangeshkar Hospital"
    },
    
    // General Physicians
    {
      id: "6",
      name: "Dr. Priya Patel",
      specialty: "General Physician",
      rating: 4.7,
      location: "Aundh, Pune",
      availableToday: true,
      nextAvailable: "Today, 6:00 PM",
      experience: "10 years",
      consultationFee: "₹600",
      degrees: "MBBS, MD (Internal Medicine)"
    },
    {
      id: "7",
      name: "Dr. Suresh Joshi",
      specialty: "General Physician",
      rating: 4.6,
      location: "Kothrud, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 9:30 AM",
      experience: "20 years",
      consultationFee: "₹700",
      degrees: "MBBS, MD"
    },
    {
      id: "8",
      name: "Dr. Meera Kulkarni",
      specialty: "General Physician",
      rating: 4.8,
      location: "Viman Nagar, Pune",
      availableToday: true,
      nextAvailable: "Today, 5:30 PM",
      experience: "12 years",
      consultationFee: "₹650",
      degrees: "MBBS, MD (General Medicine)",
      hospital: "Columbia Asia Hospital"
    },
    {
      id: "9",
      name: "Dr. Anil Sharma",
      specialty: "General Physician",
      rating: 4.5,
      location: "Hadapsar, Pune",
      availableToday: true,
      nextAvailable: "Today, 7:15 PM",
      experience: "16 years",
      consultationFee: "₹550",
      degrees: "MBBS, DNB (Family Medicine)"
    },
    {
      id: "10",
      name: "Dr. Sunita Verma",
      specialty: "General Physician",
      rating: 4.9,
      location: "Koregaon Park, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 10:00 AM",
      experience: "22 years",
      consultationFee: "₹800",
      degrees: "MBBS, MD (Internal Medicine)",
      hospital: "KEM Hospital"
    },
    
    // ENT Specialists
    {
      id: "11",
      name: "Dr. Rajesh Kulkarni",
      specialty: "ENT Specialist",
      rating: 4.8,
      location: "Shivaji Nagar, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 11:00 AM",
      experience: "12 years",
      consultationFee: "₹900",
      degrees: "MBBS, MS (ENT)"
    },
    {
      id: "12",
      name: "Dr. Kavita Mehta",
      specialty: "ENT Specialist",
      rating: 4.7,
      location: "Camp, Pune",
      availableToday: true,
      nextAvailable: "Today, 4:45 PM",
      experience: "10 years",
      consultationFee: "₹850",
      degrees: "MBBS, MS (ENT)",
      hospital: "Poona Hospital"
    },
    {
      id: "13",
      name: "Dr. Sanjay Patel",
      specialty: "ENT Specialist",
      rating: 4.9,
      location: "Kothrud, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 2:30 PM",
      experience: "15 years",
      consultationFee: "₹950",
      degrees: "MBBS, MS, DNB (ENT)",
      hospital: "Deenanath Mangeshkar Hospital"
    },
    {
      id: "14",
      name: "Dr. Leela Sharma",
      specialty: "ENT Specialist",
      rating: 4.6,
      location: "Viman Nagar, Pune",
      availableToday: true,
      nextAvailable: "Today, 6:15 PM",
      experience: "8 years",
      consultationFee: "₹750",
      degrees: "MBBS, MS (ENT)"
    },
    {
      id: "15",
      name: "Dr. Pramod Chavan",
      specialty: "ENT Specialist",
      rating: 4.8,
      location: "Aundh, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 9:15 AM",
      experience: "17 years",
      consultationFee: "₹1000",
      degrees: "MBBS, MS, Fellowship (ENT)",
      hospital: "Aundh Hospital"
    },
    
    // Infectious Disease Specialists
    {
      id: "16",
      name: "Dr. Neha Singh",
      specialty: "Infectious Disease",
      rating: 4.9,
      location: "Viman Nagar, Pune",
      availableToday: true,
      nextAvailable: "Today, 7:30 PM",
      experience: "8 years",
      consultationFee: "₹900",
      degrees: "MBBS, MD, DNB (Infectious Diseases)",
      hospital: "Ruby Hall Clinic"
    },
    {
      id: "17",
      name: "Dr. Rahul Kapoor",
      specialty: "Infectious Disease",
      rating: 4.7,
      location: "Koregaon Park, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 12:30 PM",
      experience: "11 years",
      consultationFee: "₹950",
      degrees: "MBBS, MD (Microbiology), DM (Infectious Diseases)",
      hospital: "Jehangir Hospital"
    },
    {
      id: "18",
      name: "Dr. Sarita Nair",
      specialty: "Infectious Disease",
      rating: 4.8,
      location: "Camp, Pune",
      availableToday: true,
      nextAvailable: "Today, 5:45 PM",
      experience: "14 years",
      consultationFee: "₹1000",
      degrees: "MBBS, MD, Fellowship (Infectious Diseases)",
      hospital: "Noble Hospital"
    },
    {
      id: "19",
      name: "Dr. Ajay Mane",
      specialty: "Infectious Disease",
      rating: 4.6,
      location: "Shivaji Nagar, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 11:30 AM",
      experience: "9 years",
      consultationFee: "₹850",
      degrees: "MBBS, MD (Internal Medicine), ID Specialist",
      hospital: "Sahyadri Hospital"
    },
    {
      id: "20",
      name: "Dr. Preeti Gupta",
      specialty: "Infectious Disease",
      rating: 4.9,
      location: "Hadapsar, Pune",
      availableToday: true,
      nextAvailable: "Today, 7:00 PM",
      experience: "13 years",
      consultationFee: "₹900",
      degrees: "MBBS, MD, DM (Infectious Diseases)",
      hospital: "Inamdar Hospital"
    },
    
    // Pediatricians
    {
      id: "21",
      name: "Dr. Shweta Verma",
      specialty: "Pediatrician",
      rating: 4.9,
      location: "Aundh, Pune",
      availableToday: true,
      nextAvailable: "Today, 4:00 PM",
      experience: "12 years",
      consultationFee: "₹700",
      degrees: "MBBS, MD (Pediatrics)",
      hospital: "Aundh Hospital"
    },
    {
      id: "22",
      name: "Dr. Vivek Sinha",
      specialty: "Pediatrician",
      rating: 4.8,
      location: "Kothrud, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 10:15 AM",
      experience: "15 years",
      consultationFee: "₹800",
      degrees: "MBBS, DCH, MD (Pediatrics)",
      hospital: "Deenanath Mangeshkar Hospital"
    },
    {
      id: "23",
      name: "Dr. Anjali Gokhale",
      specialty: "Pediatrician",
      rating: 4.7,
      location: "Camp, Pune",
      availableToday: true,
      nextAvailable: "Today, 6:30 PM",
      experience: "11 years",
      consultationFee: "₹750",
      degrees: "MBBS, DNB (Pediatrics)",
      hospital: "KEM Hospital"
    },
    {
      id: "24",
      name: "Dr. Ravi Kumar",
      specialty: "Pediatrician",
      rating: 4.9,
      location: "Viman Nagar, Pune",
      availableToday: false,
      nextAvailable: "Tomorrow, 9:00 AM",
      experience: "17 years",
      consultationFee: "₹850",
      degrees: "MBBS, MD, Fellowship (Pediatric Pulmonology)",
      hospital: "Columbia Asia Hospital"
    },
    {
      id: "25",
      name: "Dr. Meenakshi Iyer",
      specialty: "Pediatrician",
      rating: 4.8,
      location: "Shivaji Nagar, Pune",
      availableToday: true,
      nextAvailable: "Today, 5:30 PM",
      experience: "14 years",
      consultationFee: "₹800",
      degrees: "MBBS, MD (Pediatrics)",
      hospital: "Sassoon Hospital"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = specialty === "all" || doctor.specialty === specialty;
    const matchesLocation = location === "all" || doctor.location.includes(location);
    return matchesSpecialty && matchesLocation;
  });

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  const handleBookAppointment = (doctorName: string) => {
    toast({
      title: "Doctor Selected",
      description: `You've selected ${doctorName}. Redirecting to appointments page.`,
    });
    
    // Allow time for the toast to be seen
    setTimeout(() => {
      window.location.href = '/appointments';
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recommended Doctors in Pune</h2>
          <div className="hidden sm:block">
            <p className="text-sm text-muted-foreground">Based on your symptom analysis: <span className="font-medium">Fever</span></p>
          </div>
        </div>
        <p className="text-muted-foreground">Find specialists for respiratory conditions including Common Cold, Pneumonia, and COVID-19</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium">Filter by:</span>
        </div>
        
        <div className="flex flex-1 gap-3 flex-wrap">
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Pulmonologist">Pulmonologist</SelectItem>
              <SelectItem value="General Physician">General Physician</SelectItem>
              <SelectItem value="ENT Specialist">ENT Specialist</SelectItem>
              <SelectItem value="Infectious Disease">Infectious Disease</SelectItem>
              <SelectItem value="Pediatrician">Pediatrician</SelectItem>
            </SelectContent>
          </Select>

          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Koregaon Park">Koregaon Park</SelectItem>
              <SelectItem value="Aundh">Aundh</SelectItem>
              <SelectItem value="Shivaji Nagar">Shivaji Nagar</SelectItem>
              <SelectItem value="Viman Nagar">Viman Nagar</SelectItem>
              <SelectItem value="Kothrud">Kothrud</SelectItem>
              <SelectItem value="Camp">Camp</SelectItem>
              <SelectItem value="Hadapsar">Hadapsar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden border shadow-sm">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div>
                    <CardTitle className="text-base">{doctor.name}</CardTitle>
                    <CardDescription className="mt-1">{doctor.specialty}</CardDescription>
                    <div className="mt-1">{renderRatingStars(doctor.rating)}</div>
                  </div>
                </div>
                {doctor.availableToday && (
                  <Badge className="bg-green-600">Available Today</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-muted-foreground" />
                  <span>{doctor.degrees}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  <span>{doctor.experience} experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>
                {doctor.hospital && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span>{doctor.hospital}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span>Next Available: {doctor.nextAvailable}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground" />
                  <span>Consultation Fee: {doctor.consultationFee}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`tel:+91${Math.floor(Math.random() * 10000000000)}`)}
                >
                  Call
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleBookAppointment(doctor.name)}
                >
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 