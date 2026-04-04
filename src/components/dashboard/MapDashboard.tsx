import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  AlertTriangle,
  Heart,
  Home,
  Utensils,
  Shield,
  Filter,
  RefreshCw,
  Clock,
  Users,
  Eye,
  CheckCircle,
  X,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Issue {
  id: string;
  type: 'medical' | 'food' | 'shelter' | 'security' | 'general';
  title: string;
  description: string;
  location: LatLngTuple;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'assigned' | 'resolved';
  timestamp: Date;
  volunteers: number;
  reporter?: string;
  assignedTo?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface MapDashboardProps {
  userRole: 'admin' | 'ngo' | 'volunteer' | 'public';
  userLocation?: LatLngTuple;
  issues: Issue[];
  onIssueClick?: (issue: Issue) => void;
  onReportIssue?: () => void;
  className?: string;
}

// Mock data for demonstration
const mockIssues: Issue[] = [
  {
    id: '1',
    type: 'medical',
    title: 'Medical Emergency',
    description: 'Elderly person needs immediate medical attention',
    location: [28.6139, 77.2090], // Delhi coordinates
    priority: 'high',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    volunteers: 2,
    reporter: 'John Doe',
    urgency: 'high'
  },
  {
    id: '2',
    type: 'food',
    title: 'Food Distribution Needed',
    description: 'Family of 5 requires food supplies',
    location: [28.7041, 77.1025], // North Delhi
    priority: 'medium',
    status: 'assigned',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    volunteers: 1,
    reporter: 'Jane Smith',
    assignedTo: 'CareLine NGO',
    urgency: 'medium'
  },
  {
    id: '3',
    type: 'shelter',
    title: 'Temporary Shelter Required',
    description: 'Flood-affected family needs accommodation',
    location: [28.5355, 77.3910], // South Delhi
    priority: 'high',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    volunteers: 3,
    reporter: 'Mike Johnson',
    urgency: 'critical'
  },
  {
    id: '4',
    type: 'security',
    title: 'Security Concern',
    description: 'Area needs security monitoring',
    location: [28.6692, 77.4538], // East Delhi
    priority: 'medium',
    status: 'resolved',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    volunteers: 0,
    reporter: 'Sarah Wilson',
    urgency: 'low'
  },
  {
    id: '5',
    type: 'general',
    title: 'General Assistance',
    description: 'Multiple families need various support',
    location: [28.6139, 77.2090], // Central Delhi
    priority: 'low',
    status: 'active',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    volunteers: 5,
    reporter: 'Community Center',
    urgency: 'medium'
  }
];

const issueIcons = {
  medical: { icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-100' },
  food: { icon: Utensils, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  shelter: { icon: Home, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  security: { icon: Shield, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  general: { icon: MapPin, color: 'text-gray-500', bgColor: 'bg-gray-100' }
};

const priorityColors = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-green-600 bg-green-100'
};

const statusColors = {
  active: 'text-blue-600 bg-blue-100',
  assigned: 'text-purple-600 bg-purple-100',
  resolved: 'text-green-600 bg-green-100'
};

const urgencyColors = {
  critical: 'text-red-700 bg-red-200 border-red-300',
  high: 'text-red-600 bg-red-100 border-red-200',
  medium: 'text-yellow-600 bg-yellow-100 border-yellow-200',
  low: 'text-green-600 bg-green-100 border-green-200'
};

// Custom marker component
function CustomMarker({ issue, onClick }: { issue: Issue; onClick?: (issue: Issue) => void }) {
  const iconConfig = issueIcons[issue.type];
  const IconComponent = iconConfig.icon;

  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="white" stroke="${issue.urgency === 'critical' ? '#dc2626' : issue.priority === 'high' ? '#ea580c' : issue.priority === 'medium' ? '#ca8a04' : '#16a34a'}" stroke-width="3"/>
        <circle cx="16" cy="16" r="10" fill="${issue.urgency === 'critical' ? '#dc2626' : issue.priority === 'high' ? '#ea580c' : issue.priority === 'medium' ? '#ca8a04' : '#16a34a'}"/>
        <path d="M16 8 L20 16 L16 20 L12 16 Z" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <Marker position={issue.location} icon={customIcon} eventHandlers={{ click: () => onClick?.(issue) }}>
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className={`h-4 w-4 ${iconConfig.color}`} />
            <h3 className="font-semibold text-sm">{issue.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{issue.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            <Badge variant="outline" className={`text-xs ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </Badge>
            <Badge variant="outline" className={`text-xs ${statusColors[issue.status]}`}>
              {issue.status}
            </Badge>
            <Badge variant="outline" className={`text-xs ${urgencyColors[issue.urgency]}`}>
              {issue.urgency}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Reported: {issue.timestamp.toLocaleString()}</p>
            {issue.reporter && <p>By: {issue.reporter}</p>}
            {issue.assignedTo && <p>Assigned to: {issue.assignedTo}</p>}
            <p>Volunteers: {issue.volunteers}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Map controller for centering
function MapController({ center }: { center: LatLngTuple }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export function MapDashboard({
  userRole,
  userLocation = [28.6139, 77.2090],
  issues = mockIssues,
  onIssueClick,
  onReportIssue,
  className
}: MapDashboardProps) {
  const [center, setCenter] = useState<LatLngTuple>(userLocation);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Filter issues based on current filters
  const filteredIssues = issues.filter(issue => {
    if (filterType !== 'all' && issue.type !== filterType) return false;
    if (filterStatus !== 'all' && issue.status !== filterStatus) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    return true;
  });

  // Calculate stats
  const stats = {
    total: issues.length,
    active: issues.filter(i => i.status === 'active').length,
    assigned: issues.filter(i => i.status === 'assigned').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    onIssueClick?.(issue);
  };

  const getRoleSpecificActions = () => {
    switch (userRole) {
      case 'admin':
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              System View
            </Button>
          </div>
        );
      case 'ngo':
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              My Assignments
            </Button>
          </div>
        );
      case 'volunteer':
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setCenter(userLocation)}>
              <Navigation className="h-4 w-4 mr-2" />
              My Location
            </Button>
            <Button size="sm" variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Available Tasks
            </Button>
          </div>
        );
      case 'public':
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={onReportIssue}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCenter(userLocation)}>
              <Navigation className="h-4 w-4 mr-2" />
              My Area
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Crisis Map</h2>
          <p className="text-muted-foreground">
            {userRole === 'admin' && 'Monitor all crisis situations and response activities'}
            {userRole === 'ngo' && 'View issues in your operational area and coordinate responses'}
            {userRole === 'volunteer' && 'Find nearby issues and navigate to assignment locations'}
            {userRole === 'public' && 'View community issues and report new emergencies'}
          </p>
        </div>
        {getRoleSpecificActions()}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.assigned}</p>
                <p className="text-xs text-muted-foreground">Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Issue Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="h-[400px] sm:h-[500px] lg:h-[600px] relative">
            <MapContainer
              center={center}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController center={center} />
              {filteredIssues.map((issue) => (
                <CustomMarker
                  key={issue.id}
                  issue={issue}
                  onClick={handleIssueClick}
                />
              ))}
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border max-w-[140px] sm:max-w-none">
              <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">High Priority</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">Medium Priority</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Low Priority</span>
                </div>
              </div>
            </div>

            {/* Issue Details Panel (when issue is selected) */}
            {selectedIssue && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">{selectedIssue.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedIssue(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{selectedIssue.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className={`text-xs ${priorityColors[selectedIssue.priority]}`}>
                    {selectedIssue.priority}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${statusColors[selectedIssue.status]}`}>
                    {selectedIssue.status}
                  </Badge>
                  <Badge variant="outline" className={`text-xs ${urgencyColors[selectedIssue.urgency]}`}>
                    {selectedIssue.urgency}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Reported: {selectedIssue.timestamp.toLocaleString()}</p>
                  {selectedIssue.reporter && <p>By: {selectedIssue.reporter}</p>}
                  {selectedIssue.assignedTo && <p>Assigned to: {selectedIssue.assignedTo}</p>}
                  <p>Volunteers: {selectedIssue.volunteers}</p>
                </div>
                {userRole === 'volunteer' && selectedIssue.status === 'active' && (
                  <Button size="sm" className="w-full mt-3">
                    Accept Task
                  </Button>
                )}
                {userRole === 'ngo' && selectedIssue.status === 'active' && (
                  <Button size="sm" className="w-full mt-3">
                    Assign Volunteers
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}