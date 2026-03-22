export type IssueStatus = "Pending" | "Verified" | "In Progress" | "Solved";
export type Urgency = "High" | "Medium" | "Low";

export interface Issue {
  id: string;
  title: string;
  urgency: Urgency;
  status: IssueStatus;
  location: string;
}

export interface NGO {
  id: string;
  name: string;
  focusArea: string;
  activeIssues: number;
  description: string;
}

export interface Volunteer {
  id: string;
  name: string;
  skills: string[];
  available: boolean;
}

export const issues: Issue[] = [
  { id: "ISS-001", title: "Flooded road near Sector 14", urgency: "High", status: "Pending", location: "Gurugram, Haryana" },
  { id: "ISS-002", title: "Collapsed wall at community center", urgency: "High", status: "Verified", location: "Pune, Maharashtra" },
  { id: "ISS-003", title: "Water supply disruption", urgency: "Medium", status: "In Progress", location: "Jaipur, Rajasthan" },
  { id: "ISS-004", title: "Food shortage in relief camp", urgency: "High", status: "In Progress", location: "Patna, Bihar" },
  { id: "ISS-005", title: "Power outage in 3 wards", urgency: "Medium", status: "Pending", location: "Chennai, Tamil Nadu" },
  { id: "ISS-006", title: "Medical supplies running low", urgency: "High", status: "Verified", location: "Bhopal, Madhya Pradesh" },
  { id: "ISS-007", title: "Road debris blocking evacuation", urgency: "Medium", status: "Solved", location: "Dehradun, Uttarakhand" },
  { id: "ISS-008", title: "Shelter tents damaged by wind", urgency: "Low", status: "Pending", location: "Lucknow, Uttar Pradesh" },
  { id: "ISS-009", title: "Communication tower down", urgency: "Medium", status: "Verified", location: "Ranchi, Jharkhand" },
  { id: "ISS-010", title: "Stray animal rescue needed", urgency: "Low", status: "Solved", location: "Ahmedabad, Gujarat" },
];

export const ngos: NGO[] = [
  { id: "NGO-001", name: "HelpBridge Foundation", focusArea: "Disaster Relief", activeIssues: 4, description: "Rapid response disaster relief and rehabilitation across India." },
  { id: "NGO-002", name: "GreenHands Trust", focusArea: "Environment & Water", activeIssues: 2, description: "Sustainable water supply and environmental restoration projects." },
  { id: "NGO-003", name: "CareLine Initiative", focusArea: "Healthcare", activeIssues: 3, description: "Emergency medical aid and healthcare access for underserved communities." },
];

export const volunteers: Volunteer[] = [
  { id: "VOL-001", name: "Arjun Mehta", skills: ["First Aid", "Logistics"], available: true },
  { id: "VOL-002", name: "Priya Sharma", skills: ["Medical", "Counseling"], available: true },
  { id: "VOL-003", name: "Ravi Kumar", skills: ["Driving", "Supply Chain"], available: false },
  { id: "VOL-004", name: "Neha Gupta", skills: ["Teaching", "Communication"], available: true },
  { id: "VOL-005", name: "Sanjay Patel", skills: ["Construction", "Electrical"], available: true },
  { id: "VOL-006", name: "Ananya Reddy", skills: ["Data Entry", "Coordination"], available: false },
  { id: "VOL-007", name: "Vikram Singh", skills: ["Search & Rescue", "Navigation"], available: true },
  { id: "VOL-008", name: "Fatima Khan", skills: ["Translation", "First Aid"], available: true },
  { id: "VOL-009", name: "Deepak Joshi", skills: ["Photography", "Documentation"], available: false },
  { id: "VOL-010", name: "Lakshmi Iyer", skills: ["Cooking", "Shelter Mgmt"], available: true },
];
