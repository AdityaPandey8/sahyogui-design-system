import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users
} from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
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
}

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
    volunteers: 2
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
    volunteers: 1
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
    volunteers: 3
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
    volunteers: 0
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
    volunteers: 5
  }
];

const issueIcons = {
  medical: Heart,
  food: Utensils,
  shelter: Home,
  security: Shield,
  general: AlertTriangle
};

const priorityColors = {
  high: 'bg-destructive text-destructive-foreground',
  medium: 'bg-warning text-warning-foreground',
  low: 'bg-success text-success-foreground'
};

const statusColors = {
  active: 'bg-destructive/10 text-destructive border-destructive/20',
  assigned: 'bg-warning/10 text-warning border-warning/20',
  resolved: 'bg-success/10 text-success border-success/20'
};

// Custom marker component
function CustomMarker({ issue }: { issue: Issue }) {
  const IconComponent = issueIcons[issue.type];

  const customIcon = new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${
          issue.priority === 'high' ? '#ef4444' :
          issue.priority === 'medium' ? '#f59e0b' : '#10b981'
        }" stroke="white" stroke-width="3"/>
        <circle cx="16" cy="16" r="8" fill="white"/>
        <text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="${
          issue.priority === 'high' ? '#ef4444' :
          issue.priority === 'medium' ? '#f59e0b' : '#10b981'
        }">${issue.volunteers}</text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <Marker position={issue.location} icon={customIcon}>
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent className="h-4 w-4" />
            <h3 className="font-semibold text-sm">{issue.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">{issue.description}</p>
          <div className="flex gap-2 mb-2">
            <Badge variant="outline" className={`text-xs ${priorityColors[issue.priority]}`}>
              {issue.priority.toUpperCase()}
            </Badge>
            <Badge variant="outline" className={`text-xs ${statusColors[issue.status]}`}>
              {issue.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {Math.floor((Date.now() - issue.timestamp.getTime()) / (1000 * 60))} min ago
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Users className="h-3 w-3" />
            {issue.volunteers} volunteer{issue.volunteers !== 1 ? 's' : ''} assigned
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// Map controller component
function MapController({ center }: { center: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 11);
  }, [center, map]);

  return null;
}

export function MapPreviewSection() {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [filter, setFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delhi center coordinates
  const center: LatLngTuple = [28.6139, 77.2090];

  const filteredIssues = filter === 'all'
    ? issues
    : issues.filter(issue => issue.type === filter || issue.status === filter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIssues(prev => prev.map(issue => ({
        ...issue,
        volunteers: Math.floor(Math.random() * 6),
        status: Math.random() > 0.7 ? 'resolved' : issue.status
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  const stats = {
    total: issues.length,
    active: issues.filter(i => i.status === 'active').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    volunteers: issues.reduce((sum, i) => sum + i.volunteers, 0)
  };

  return (
    <section className="border-t bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Live Crisis Response Map
          </h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Real-time visualization of community issues and volunteer responses across the region.
            Click on markers to view details and track response progress.
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
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
                    <Heart className="h-4 w-4 text-success" />
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={filter} onValueChange={setFilter}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="all">All Issues</TabsTrigger>
                    <TabsTrigger value="active">Active Only</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <div className="space-y-2">
                      {Object.entries(issueIcons).map(([type, Icon]) => (
                        <Button
                          key={type}
                          variant={filter === type ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setFilter(type)}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="active" className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing only active crisis issues that need immediate attention.
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh Data'}
              </Button>
              <Button className="w-full">
                Report New Issue
              </Button>
            </div>
          </div>

          {/* Map */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-[300px] sm:h-[400px] lg:h-[600px] relative">
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
                    <CustomMarker key={issue.id} issue={issue} />
                  ))}
                </MapContainer>

                {/* Map Legend */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-lg border max-w-[140px] sm:max-w-none">
                  <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2">Priority</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-destructive"></div>
                      <span className="text-xs">High</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-warning"></div>
                      <span className="text-xs">Medium</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-success"></div>
                      <span className="text-xs">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
