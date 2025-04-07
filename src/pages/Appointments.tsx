import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  MapPin, 
  Phone, 
  Plus, 
  X, 
  Check, 
  ChevronRight, 
  Search,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

// Sample appointment data
const upcomingAppointments = [
  {
    id: 1,
    doctorName: "Dr. Anil Sharma",
    specialty: "Cardiologist",
    hospital: "Pune Heart Institute",
    address: "Koregaon Park, Pune",
    date: "2025-04-10",
    time: "10:00 AM",
    status: "confirmed",
    type: "in-person",
    notes: "Annual checkup",
    doctorImage: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    doctorName: "Dr. Priya Patel",
    specialty: "Pediatrician",
    hospital: "Children's Care Hospital",
    address: "Viman Nagar, Pune",
    date: "2025-04-15",
    time: "11:30 AM",
    status: "confirmed",
    type: "video",
    notes: "Follow-up consultation",
    doctorImage: "https://randomuser.me/api/portraits/women/2.jpg",
  }
];

const pastAppointments = [
  {
    id: 3,
    doctorName: "Dr. Rajesh Kumar",
    specialty: "Orthopedic",
    hospital: "Pune Bone & Joint Center",
    address: "Kothrud, Pune",
    date: "2025-03-25",
    time: "09:00 AM",
    status: "completed",
    type: "in-person",
    notes: "Knee pain consultation",
    doctorImage: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    doctorName: "Dr. Meera Desai",
    specialty: "Gynecologist",
    hospital: "Motherhood Hospital",
    address: "Shivaji Nagar, Pune",
    date: "2025-03-15",
    time: "03:30 PM",
    status: "completed",
    type: "in-person",
    notes: "Regular checkup",
    doctorImage: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: 5,
    doctorName: "Dr. Sunil Verma",
    specialty: "Dermatologist",
    hospital: "Skin & Aesthetic Clinic",
    address: "Baner, Pune",
    date: "2025-02-28",
    time: "02:00 PM",
    status: "cancelled",
    type: "video",
    notes: "Skin rash consultation",
    doctorImage: "https://randomuser.me/api/portraits/men/5.jpg",
  }
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
];

const specialties = [
  "Cardiology",
  "Dermatology",
  "Gynecology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Urology"
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [specialty, setSpecialty] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Appointments | ArogyaAI+";
  }, []);

  const handleBookAppointment = () => {
    if (!date || !specialty || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields to book an appointment.",
      });
      return;
    }

    // In a real app, this would call an API to create the appointment
    toast({
      title: "Appointment Booked",
      description: `Your ${appointmentType} appointment has been scheduled for ${format(date, "PP")} at ${selectedTime}.`,
    });

    // Reset form and close dialog
    setDate(new Date());
    setSpecialty("");
    setAppointmentType("in-person");
    setSelectedTime("");
    setNotes("");
    setIsBookingOpen(false);
  };

  const handleCancelAppointment = (id: number) => {
    // In a real app, this would call an API to cancel the appointment
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const renderAppointmentCard = (appointment: any, isPast = false) => (
    <Card key={appointment.id} className="mb-4">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className={`md:w-1/4 p-4 ${appointment.status === "cancelled" ? "bg-red-50" : "bg-secondary/30"}`}>
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img 
                  src={appointment.doctorImage} 
                  alt={appointment.doctorName}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h4 className="font-medium text-sm">{appointment.doctorName}</h4>
                <p className="text-xs text-primary">{appointment.specialty}</p>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div className="flex items-start">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1.5 mt-0.5" />
                <span className="text-muted-foreground text-xs">{appointment.hospital}, {appointment.address}</span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-4">
            <div className="flex items-center mb-3">
              <Badge 
                className={
                  appointment.status === "confirmed" 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : appointment.status === "completed" 
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {appointment.status === "confirmed" 
                  ? "Confirmed" 
                  : appointment.status === "completed" 
                    ? "Completed"
                    : "Cancelled"
                }
              </Badge>
              <Badge 
                variant="outline" 
                className={appointment.type === "video" ? "ml-2 bg-purple-50 text-purple-700 border-purple-200" : "ml-2"}
              >
                {appointment.type === "video" ? "Video Consultation" : "In-person Visit"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Date: {new Date(appointment.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <span>Time: {appointment.time}</span>
              </div>
              {appointment.notes && (
                <div className="text-sm mt-2">
                  <span className="font-medium">Notes: </span>
                  <span className="text-muted-foreground">{appointment.notes}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/4 p-4 flex flex-col justify-center border-t md:border-t-0 md:border-l">
            {!isPast && appointment.status !== "cancelled" ? (
              <>
                <Button variant="outline" size="sm" className="mb-2">
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleCancelAppointment(appointment.id)}
                >
                  Cancel
                </Button>
              </>
            ) : appointment.status === "completed" ? (
              <>
                <Button variant="outline" size="sm" className="mb-2">
                  View Records
                </Button>
                <Button variant="outline" size="sm">
                  Book Follow-up
                </Button>
              </>
            ) : (
              <span className="text-sm text-muted-foreground text-center">
                This appointment was cancelled
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">
            Manage your healthcare appointments and schedule new visits
          </p>
        </div>
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                To book an appointment, first select a doctor from our Find Doctors page, then complete your booking details.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="p-4 border rounded-md bg-yellow-50 mb-2">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  Important: Doctor Selection Required
                </p>
                <p className="text-sm text-yellow-700 mb-3">
                  Please select a doctor from our directory first. You can browse doctors by specialty, location, and availability.
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/find-doctors'}>
                  Find & Select a Doctor
                </Button>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Specialty Required</label>
                <Select onValueChange={setSpecialty} value={specialty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <Select onValueChange={setAppointmentType} value={appointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-person Visit</SelectItem>
                    <SelectItem value="video">Video Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Time Slot</label>
                <Select onValueChange={setSelectedTime} value={selectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Additional Notes (Optional)</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your symptoms or reason for visit"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBookAppointment}>
                Book Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="mb-4">
            <div className="bg-card rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search appointments by doctor or location" 
                    className="pl-9"
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="in-person">In-person</SelectItem>
                    <SelectItem value="video">Video Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appointment => renderAppointmentCard(appointment))
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any scheduled appointments. Book a new appointment to get started.
                  </p>
                  <Button 
                    onClick={() => setIsBookingOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Book Appointment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="past">
          <div className="mb-4">
            <div className="bg-card rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search past appointments" 
                    className="pl-9"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {pastAppointments.length > 0 ? (
              pastAppointments.map(appointment => renderAppointmentCard(appointment, true))
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium mb-2">No past appointments</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any past appointment records in our system.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 