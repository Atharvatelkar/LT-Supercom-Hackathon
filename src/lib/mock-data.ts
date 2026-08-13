export type Role = "candidate" | "employer" | "college" | "admin";

export const candidate = {
  name: "Aarav Mehta",
  title: "Backend Developer",
  location: "Bengaluru, India",
  experience: "3.5 years",
  profileCompletion: 78,
  careerReadiness: 72,
  interviewReadiness: 64,
};

export const skills = [
  { name: "Java", level: "Advanced", score: 88, verified: true, group: "Technical" },
  { name: "Spring Boot", level: "Advanced", score: 85, verified: true, group: "Technical" },
  { name: "SQL", level: "Advanced", score: 81, verified: true, group: "Technical" },
  { name: "React", level: "Intermediate", score: 62, verified: false, group: "Technical" },
  { name: "Docker", level: "Beginner", score: 34, verified: false, group: "Technical" },
  { name: "Kubernetes", level: "Beginner", score: 22, verified: false, group: "Technical" },
  { name: "Communication", level: "Advanced", score: 84, verified: true, group: "Soft" },
  { name: "Problem Solving", level: "Advanced", score: 79, verified: true, group: "Soft" },
  { name: "Ownership", level: "Intermediate", score: 68, verified: false, group: "Soft" },
];

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  match: number;
  mode: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Contract" | "Internship";
  industry: string;
  posted: string;
  matched: string[];
  missing: string[];
};

export const jobs: Job[] = [
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    company: "Northwind Systems",
    location: "Bengaluru",
    experience: "3-6 yrs",
    salary: "₹18-26 LPA",
    match: 82,
    mode: "Hybrid",
    type: "Full-time",
    industry: "Product",
    posted: "2 days ago",
    matched: ["Java", "Spring Boot", "SQL"],
    missing: ["Kubernetes"],
  },
  {
    id: "platform-engineer",
    title: "Platform Engineer",
    company: "Arclight Cloud",
    location: "Pune",
    experience: "4-7 yrs",
    salary: "₹22-30 LPA",
    match: 74,
    mode: "Remote",
    type: "Full-time",
    industry: "Cloud",
    posted: "5 days ago",
    matched: ["Java", "SQL"],
    missing: ["Docker", "Terraform"],
  },
  {
    id: "java-microservices",
    title: "Java Microservices Developer",
    company: "Vertex Financial",
    location: "Hyderabad",
    experience: "3-5 yrs",
    salary: "₹16-22 LPA",
    match: 88,
    mode: "On-site",
    type: "Full-time",
    industry: "BFSI",
    posted: "Today",
    matched: ["Java", "Spring Boot", "SQL", "REST"],
    missing: ["Kafka"],
  },
  {
    id: "fullstack-engineer",
    title: "Full Stack Engineer",
    company: "Lumen Health",
    location: "Remote",
    experience: "2-5 yrs",
    salary: "₹14-20 LPA",
    match: 69,
    mode: "Remote",
    type: "Full-time",
    industry: "Healthtech",
    posted: "1 week ago",
    matched: ["Java", "React"],
    missing: ["Node.js", "AWS"],
  },
  {
    id: "api-engineer",
    title: "API Integration Engineer",
    company: "Trellis Retail",
    location: "Chennai",
    experience: "3-6 yrs",
    salary: "₹15-21 LPA",
    match: 77,
    mode: "Hybrid",
    type: "Contract",
    industry: "Retail",
    posted: "3 days ago",
    matched: ["Java", "SQL"],
    missing: ["GraphQL"],
  },
  {
    id: "sre",
    title: "Site Reliability Engineer",
    company: "Northwind Systems",
    location: "Bengaluru",
    experience: "4-8 yrs",
    salary: "₹24-34 LPA",
    match: 58,
    mode: "Hybrid",
    type: "Full-time",
    industry: "Product",
    posted: "6 days ago",
    matched: ["Java"],
    missing: ["Kubernetes", "Prometheus", "Cloud"],
  },
];

export const applications = [
  { id: 1, role: "Backend Engineer", company: "Northwind Systems", stage: "Interview", applied: "12 Jul", updated: "2 days ago" },
  { id: 2, role: "Java Microservices Developer", company: "Vertex Financial", stage: "Shortlisted", applied: "09 Jul", updated: "4 days ago" },
  { id: 3, role: "API Integration Engineer", company: "Trellis Retail", stage: "Under Review", applied: "05 Jul", updated: "6 days ago" },
  { id: 4, role: "Platform Engineer", company: "Arclight Cloud", stage: "Applied", applied: "02 Jul", updated: "1 week ago" },
  { id: 5, role: "Full Stack Engineer", company: "Lumen Health", stage: "Rejected", applied: "24 Jun", updated: "2 weeks ago" },
  { id: 6, role: "Backend Developer", company: "Cobalt Labs", stage: "Selected", applied: "18 Jun", updated: "3 weeks ago" },
];

export const applicationStages = ["Applied", "Under Review", "Shortlisted", "Interview", "Offer"];

export const skillGap = {
  targetRole: "Backend Developer",
  strengths: ["Java", "Spring Boot", "SQL"],
  gaps: [
    { skill: "Docker", demand: 82, impact: "+6% match" },
    { skill: "Kubernetes", demand: 74, impact: "+9% match" },
    { skill: "Cloud (AWS)", demand: 88, impact: "+7% match" },
  ],
};

export const courses = [
  { title: "Docker Fundamentals", provider: "LT Learn", hours: 6, level: "Beginner", skill: "Docker" },
  { title: "Kubernetes Basics", provider: "LT Learn", hours: 9, level: "Beginner", skill: "Kubernetes" },
  { title: "Cloud Fundamentals on AWS", provider: "Arclight Academy", hours: 12, level: "Intermediate", skill: "Cloud" },
  { title: "Advanced Spring Boot Patterns", provider: "LT Learn", hours: 8, level: "Advanced", skill: "Spring Boot" },
  { title: "System Design for Backend Engineers", provider: "Vertex Institute", hours: 14, level: "Advanced", skill: "System Design" },
  { title: "SQL Performance Tuning", provider: "LT Learn", hours: 5, level: "Intermediate", skill: "SQL" },
];

export const trendingSkills = [
  { skill: "Kubernetes", growth: 42 },
  { skill: "Cloud Security", growth: 37 },
  { skill: "Go", growth: 29 },
  { skill: "Kafka", growth: 26 },
  { skill: "Terraform", growth: 24 },
  { skill: "LLM Ops", growth: 61 },
];

export const demandByRole = [
  { role: "Backend", openings: 1240 },
  { role: "Data", openings: 980 },
  { role: "Cloud", openings: 870 },
  { role: "Frontend", openings: 760 },
  { role: "QA", openings: 430 },
];

export const hiringTrend = [
  { month: "Feb", applications: 210, hires: 12 },
  { month: "Mar", applications: 260, hires: 15 },
  { month: "Apr", applications: 310, hires: 19 },
  { month: "May", applications: 288, hires: 17 },
  { month: "Jun", applications: 356, hires: 24 },
  { month: "Jul", applications: 402, hires: 28 },
];

export const employerCandidates = [
  { name: "Aarav Mehta", role: "Backend Developer", exp: "3.5 yrs", match: 92, location: "Bengaluru", skills: ["Java", "Spring Boot", "SQL"], stage: "Interview" },
  { name: "Diya Sharma", role: "Platform Engineer", exp: "5 yrs", match: 88, location: "Pune", skills: ["Kubernetes", "Go", "AWS"], stage: "Shortlisted" },
  { name: "Rohan Iyer", role: "Java Developer", exp: "2 yrs", match: 81, location: "Chennai", skills: ["Java", "SQL"], stage: "Screening" },
  { name: "Meera Nair", role: "SRE", exp: "6 yrs", match: 79, location: "Remote", skills: ["Terraform", "Prometheus"], stage: "Assessment" },
  { name: "Kabir Singh", role: "Backend Developer", exp: "4 yrs", match: 76, location: "Hyderabad", skills: ["Java", "Kafka"], stage: "Applied" },
  { name: "Ananya Rao", role: "Full Stack Engineer", exp: "3 yrs", match: 72, location: "Bengaluru", skills: ["React", "Node.js"], stage: "Offer" },
];

export const atsStages = ["Applied", "Screening", "Shortlisted", "Assessment", "Interview", "Offer", "Hired"];

export const employerJobs = [
  { title: "Backend Engineer", location: "Bengaluru", applicants: 148, shortlisted: 22, status: "Active" },
  { title: "Platform Engineer", location: "Pune", applicants: 96, shortlisted: 14, status: "Active" },
  { title: "QA Automation Lead", location: "Remote", applicants: 61, shortlisted: 8, status: "Paused" },
  { title: "Data Engineer", location: "Hyderabad", applicants: 112, shortlisted: 19, status: "Active" },
];

export const students = [
  { name: "Ishaan Kulkarni", branch: "CSE", year: "2026", score: 82, status: "Placed", company: "Northwind Systems" },
  { name: "Sara Thomas", branch: "IT", year: "2026", score: 78, status: "Interview", company: "Vertex Financial" },
  { name: "Nikhil Verma", branch: "ECE", year: "2026", score: 64, status: "Eligible", company: "—" },
  { name: "Priya Das", branch: "CSE", year: "2026", score: 91, status: "Placed", company: "Arclight Cloud" },
  { name: "Aman Gupta", branch: "MECH", year: "2026", score: 55, status: "Not Eligible", company: "—" },
  { name: "Tanvi Joshi", branch: "CSE", year: "2027", score: 73, status: "Assessment", company: "Trellis Retail" },
];

export const drives = [
  { company: "Northwind Systems", date: "12 Aug 2026", roles: 3, registered: 214, status: "Upcoming" },
  { company: "Vertex Financial", date: "28 Jul 2026", roles: 2, registered: 178, status: "Active" },
  { company: "Arclight Cloud", date: "14 Jun 2026", roles: 4, registered: 260, status: "Completed" },
  { company: "Trellis Retail", date: "20 Aug 2026", roles: 1, registered: 96, status: "Upcoming" },
];

export const hackathons = [
  { name: "BuildAI Campus Sprint", date: "22 Aug 2026", teams: 48, status: "Upcoming" },
  { name: "Cloud Native Challenge", date: "30 Jul 2026", teams: 36, status: "Active" },
  { name: "FinTech Hack 2026", date: "18 May 2026", teams: 52, status: "Past" },
];

export const placementTrend = [
  { year: "2022", rate: 62 },
  { year: "2023", rate: 68 },
  { year: "2024", rate: 74 },
  { year: "2025", rate: 79 },
  { year: "2026", rate: 83 },
];

export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export const verificationQueue = [
  { id: "v1", org: "Northwind Systems", type: "Employer", contact: "Rhea Kapoor", email: "rhea@northwind.io", phone: "+91 98200 11223", details: "IT Services · 1,200 employees · GSTIN 27AABCU9603R1ZX", submitted: "04 Aug 2026", status: "Pending" as VerificationStatus },
  { id: "v2", org: "Sristi Institute of Technology", type: "College", contact: "Dr. Anil Menon", email: "placements@sristi.edu", phone: "+91 98450 77123", details: "AICTE approved · 3,400 students · Bengaluru", submitted: "03 Aug 2026", status: "Pending" as VerificationStatus },
  { id: "v3", org: "Arclight Cloud", type: "Employer", contact: "Sameer Bhat", email: "sameer@arclight.dev", phone: "+91 99000 44112", details: "Cloud Infrastructure · 340 employees", submitted: "01 Aug 2026", status: "Approved" as VerificationStatus },
  { id: "v4", org: "Trellis Retail", type: "Employer", contact: "Kavya Menon", email: "kavya@trellis.com", phone: "+91 90000 32211", details: "Retail · 5,000 employees · Documents unclear", submitted: "28 Jul 2026", status: "Rejected" as VerificationStatus },
  { id: "v5", org: "Meridian College of Engineering", type: "College", contact: "Prof. Latha R", email: "tpo@meridian.ac.in", phone: "+91 94480 11009", details: "UGC recognised · 2,100 students · Chennai", submitted: "26 Jul 2026", status: "Approved" as VerificationStatus },
];

export const adminUsers = [
  { name: "Aarav Mehta", role: "Candidate", email: "aarav@mail.com", joined: "12 Jun 2026", status: "Active" },
  { name: "Rhea Kapoor", role: "Employer", email: "rhea@northwind.io", joined: "04 Aug 2026", status: "Pending" },
  { name: "Dr. Anil Menon", role: "College", email: "placements@sristi.edu", joined: "03 Aug 2026", status: "Pending" },
  { name: "Sameer Bhat", role: "Employer", email: "sameer@arclight.dev", joined: "01 Aug 2026", status: "Active" },
  { name: "Priya Das", role: "Candidate", email: "priya@mail.com", joined: "22 May 2026", status: "Active" },
];

export const advisorSuggestions = [
  "What roles fit my current skills?",
  "How do I get to Senior Backend Engineer?",
  "Which skill should I learn next?",
  "Review my resume for backend roles",
];

export const advisorThread = [
  {
    from: "ai" as const,
    text: "You are strong in Java and Spring Boot. Adding Docker and Kubernetes could improve your match with Backend Engineering roles by an estimated 9%.",
  },
  { from: "user" as const, text: "Which companies should I target first?" },
  {
    from: "ai" as const,
    text: "Vertex Financial (88% match) and Northwind Systems (82% match) both weight Java + Spring Boot heavily. Vertex has an open role posted today and your profile clears its screening rules.",
  },
];
