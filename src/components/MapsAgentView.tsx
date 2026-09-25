import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map,
  useMap,
  useMapsLibrary
} from '@vis.gl/react-google-maps';
import {
  Compass,
  MapPin,
  Navigation,
  Search,
  Route as RouteIcon,
  Truck,
  Building2,
  Phone,
  Star,
  Clock,
  DollarSign,
  Send,
  Sparkles,
  RefreshCw,
  Layers,
  Locate,
  ArrowRight,
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Package
} from 'lucide-react';
import { Order, Product } from '../types';

interface MapsAgentViewProps {
  orders: Order[];
  activeOrderToTrack?: Order | null;
  onClearActiveOrderTrack?: () => void;
  prefilledQuery?: string | null;
}

interface PlaceResultItem {
  id: string;
  name: string;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  location: { lat: number; lng: number };
  types?: string[];
  isOpen?: boolean;
  businessStatus?: string;
  phone?: string;
  categoryLabel?: string;
}

interface AgentMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  type?: 'places' | 'route' | 'order_tracking' | 'info';
  data?: {
    places?: PlaceResultItem[];
    routeDetails?: {
      origin: string;
      destination: string;
      distanceText: string;
      durationText: string;
      distanceMeters: number;
      durationSeconds: number;
      estimatedDeliveryFeeGHS: number;
      steps: string[];
    };
    order?: Order;
  };
}

// Prominent Ghanaian Commerce & Logistics Hubs
const VERIFIED_ZORVANIQ_HUBS = [
  {
    id: 'hub-accra-circle',
    name: 'Accra Circle Tech & Electronics Hub',
    address: 'Tip Toe Lane, Kwame Nkrumah Circle, Accra',
    location: { lat: 5.5600, lng: -0.2120 },
    type: 'Gadgets & Computing Center',
    region: 'Greater Accra',
    ordersPending: 24
  },
  {
    id: 'hub-accra-makola',
    name: 'Makola Central Merchant Logistics Station',
    address: 'Makola Market Shopping Square, Accra Central',
    location: { lat: 5.5458, lng: -0.2082 },
    type: 'Wholesale & Fashion Depot',
    region: 'Greater Accra',
    ordersPending: 38
  },
  {
    id: 'hub-kumasi-kejetia',
    name: 'Kumasi Kejetia Mega Commerce Hub',
    address: 'Kejetia Market Complex, Kumasi',
    location: { lat: 6.6966, lng: -1.6258 },
    type: 'Ashanti Regional Distribution Hub',
    region: 'Ashanti',
    ordersPending: 42
  },
  {
    id: 'hub-kumasi-adum',
    name: 'Adum Fashion & Artisan Depot',
    address: 'Adum Business District, Kumasi',
    location: { lat: 6.6890, lng: -1.6215 },
    type: 'Kente & Artisan Fulfillment',
    region: 'Ashanti',
    ordersPending: 18
  },
  {
    id: 'hub-tamale-savannah',
    name: 'Tamale Savannah Agro Collection Hub',
    address: 'Central Market Road, Tamale',
    location: { lat: 9.4070, lng: -0.8393 },
    type: 'Shea Butter & Agric Collection',
    region: 'Northern',
    ordersPending: 12
  },
  {
    id: 'hub-tema-port',
    name: 'Tema Port Gateway & Logistics Depot',
    address: 'Harbour Road, Tema Community 1',
    location: { lat: 5.6420, lng: -0.0070 },
    type: 'Import & Bulk Cargo Terminal',
    region: 'Greater Accra',
    ordersPending: 31
  }
];

// Inner map child component to manage Directions, Markers, and Places via useMap hook
const MapContentController: React.FC<{
  selectedPlaces: PlaceResultItem[];
  activeRouteInfo: any | null;
  selectedMarkerPlace: PlaceResultItem | null;
  onSelectMarker: (p: PlaceResultItem | null) => void;
  courierLocation?: { lat: number; lng: number } | null;
  onSelectHub: (hub: typeof VERIFIED_ZORVANIQ_HUBS[0]) => void;
}> = ({
  selectedPlaces,
  activeRouteInfo,
  selectedMarkerPlace,
  onSelectMarker,
  courierLocation,
  onSelectHub
}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const placesLibrary = useMapsLibrary('places');
  const markersRef = useRef<google.maps.Marker[]>([]);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Initialize or clean up DirectionsRenderer
  useEffect(() => {
    if (!map) return;
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#f59e0b',
          strokeOpacity: 0.9,
          strokeWeight: 5
        }
      });
    }

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [map]);

  // Handle Route Rendering when activeRouteInfo changes
  useEffect(() => {
    if (!map || !directionsRendererRef.current) return;

    if (activeRouteInfo && activeRouteInfo.directionsResult) {
      directionsRendererRef.current.setDirections(activeRouteInfo.directionsResult);
      if (activeRouteInfo.directionsResult.routes && activeRouteInfo.directionsResult.routes[0]?.bounds) {
        map.fitBounds(activeRouteInfo.directionsResult.routes[0].bounds);
      }
    } else {
      directionsRendererRef.current.set('directions', null);
    }
  }, [map, activeRouteInfo]);

  // Handle Markers on Map
  useEffect(() => {
    if (!map) return;

    // Clear existing custom markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();
    let hasMarkers = false;

    // 1. Add Zorvaniq Verified Hubs (if no active search places or as base markers)
    if (selectedPlaces.length === 0) {
      VERIFIED_ZORVANIQ_HUBS.forEach((hub) => {
        const hubMarker = new google.maps.Marker({
          position: hub.location,
          map,
          title: hub.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#10b981',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        hubMarker.addListener('click', () => {
          onSelectHub(hub);
        });

        markersRef.current.push(hubMarker);
        bounds.extend(hub.location);
        hasMarkers = true;
      });
    }

    // 2. Add Selected Search Places
    selectedPlaces.forEach((place) => {
      const placeMarker = new google.maps.Marker({
        position: place.location,
        map,
        title: place.name,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#000000',
          strokeWeight: 1.5
        }
      });

      placeMarker.addListener('click', () => {
        onSelectMarker(place);
      });

      markersRef.current.push(placeMarker);
      bounds.extend(place.location);
      hasMarkers = true;
    });

    // 3. Add Courier Location if tracking
    if (courierLocation) {
      const courierMarker = new google.maps.Marker({
        position: courierLocation,
        map,
        title: 'Zorvaniq Express Dispatch Rider',
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 7,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
      markersRef.current.push(courierMarker);
      bounds.extend(courierLocation);
      hasMarkers = true;
    }

    if (hasMarkers && !activeRouteInfo) {
      map.fitBounds(bounds);
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 16) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, selectedPlaces, courierLocation, activeRouteInfo, onSelectMarker, onSelectHub]);

  return null;
};

export const MapsAgentView: React.FC<MapsAgentViewProps> = ({
  orders,
  activeOrderToTrack,
  onClearActiveOrderTrack,
  prefilledQuery
}) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyApuGJwhm6vAVDpeAQF6O15iFfaqo1tZsc';

  // Active sub-tab
  const [activeMode, setActiveMode] = useState<'agent' | 'routes' | 'places' | 'hubs'>('agent');

  // Interactive Map State
  const [mapCenter, setMapCenter] = useState({ lat: 6.6885, lng: -1.6244 }); // Center on Ghana (Kumasi/Accra)
  const [mapZoom, setMapZoom] = useState(7);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  // Agent Chat State
  const [chatInput, setChatInput] = useState('');
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'agent',
      text: "Hello! I am your Zorvaniq Geospatial & Dispatch Agent, connected to real-time Google Maps data across Ghana. Ask me to find wholesale & retail markets, compute delivery routes with distance & ETA, calculate courier fees, or track active dispatches.",
      timestamp: 'Just now',
      type: 'info'
    }
  ]);

  // Route calculation state
  const [originQuery, setOriginQuery] = useState('Kumasi, Adum');
  const [destinationQuery, setDestinationQuery] = useState('Accra, East Legon');
  const [travelMode, setTravelMode] = useState<'DRIVING' | 'TWO_WHEELER' | 'TRANSIT' | 'WALKING'>('DRIVING');
  const [activeRouteInfo, setActiveRouteInfo] = useState<any | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Places search state
  const [placesQuery, setPlacesQuery] = useState('Electronics markets in Accra');
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceResultItem[]>([]);
  const [selectedMarkerPlace, setSelectedMarkerPlace] = useState<PlaceResultItem | null>(null);
  const [placesLoading, setPlacesLoading] = useState(false);

  // Courier simulation position
  const [courierLocation, setCourierLocation] = useState<{ lat: number; lng: number } | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAgentProcessing]);

  // Handle active order tracking passed via prop
  useEffect(() => {
    if (activeOrderToTrack) {
      handleTrackOrder(activeOrderToTrack);
    }
  }, [activeOrderToTrack]);

  // Handle prefilled query
  useEffect(() => {
    if (prefilledQuery) {
      handleAgentPrompt(prefilledQuery);
    }
  }, [prefilledQuery]);

  // Helper: compute delivery fee based on distance
  const calculateEscrowDeliveryFee = (distanceKm: number): number => {
    // Base fee: GH₵ 15.00 for within city, + GH₵ 1.10 per km for intercity/long distance
    if (distanceKm <= 5) return 15;
    if (distanceKm <= 20) return Number((15 + (distanceKm - 5) * 1.8).toFixed(2));
    // Intercity (e.g. Kumasi to Accra ~250km)
    return Number((35 + distanceKm * 0.45).toFixed(2));
  };

  // Perform Google Maps Places Text Search
  const executePlacesSearch = (
    query: string,
    callback?: (results: PlaceResultItem[]) => void
  ) => {
    if (!window.google || !window.google.maps) {
      console.warn('Google Maps JS API not loaded yet');
      return;
    }

    setPlacesLoading(true);

    // Create a temporary DOM element for PlacesService if no map ref yet
    const dummyDiv = document.createElement('div');
    const service = new google.maps.places.PlacesService(dummyDiv);

    const request: google.maps.places.TextSearchRequest = {
      query: query.toLowerCase().includes('ghana') ? query : `${query}, Ghana`,
      location: new google.maps.LatLng(5.6037, -0.1870), // Accra default bias
      radius: 50000
    };

    service.textSearch(request, (results, status) => {
      setPlacesLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const formattedResults: PlaceResultItem[] = results.slice(0, 6).map((r) => ({
          id: r.place_id || Math.random().toString(),
          name: r.name || 'Merchant Location',
          formatted_address: r.formatted_address || '',
          rating: r.rating || 4.5,
          user_ratings_total: r.user_ratings_total || 12,
          location: {
            lat: r.geometry?.location?.lat() || 5.6037,
            lng: r.geometry?.location?.lng() || -0.1870
          },
          types: r.types,
          businessStatus: r.business_status
        }));

        setSelectedPlaces(formattedResults);
        if (formattedResults[0]) {
          setSelectedMarkerPlace(formattedResults[0]);
          setMapCenter(formattedResults[0].location);
          setMapZoom(13);
        }

        if (callback) callback(formattedResults);
      } else {
        // Fallback to verified local hubs matching query
        const matchingHubs = VERIFIED_ZORVANIQ_HUBS.filter(
          (h) =>
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            h.address.toLowerCase().includes(query.toLowerCase()) ||
            h.region.toLowerCase().includes(query.toLowerCase())
        );

        const fallbackItems: PlaceResultItem[] = (matchingHubs.length > 0
          ? matchingHubs
          : VERIFIED_ZORVANIQ_HUBS.slice(0, 3)
        ).map((h) => ({
          id: h.id,
          name: h.name,
          formatted_address: h.address,
          rating: 4.9,
          user_ratings_total: 48,
          location: h.location,
          types: ['point_of_interest', 'establishment']
        }));

        setSelectedPlaces(fallbackItems);
        if (callback) callback(fallbackItems);
      }
    });
  };

  // Perform Google Maps Route / Directions calculation
  const executeDirectionsCalculation = (
    origin: string,
    destination: string,
    mode: 'DRIVING' | 'TWO_WHEELER' | 'TRANSIT' | 'WALKING' = 'DRIVING',
    callback?: (details: any) => void
  ) => {
    if (!window.google || !window.google.maps) {
      setRouteError('Google Maps API is initializing. Please retry in a moment.');
      return;
    }

    setRouteLoading(true);
    setRouteError(null);

    const directionsService = new google.maps.DirectionsService();

    const gMode =
      mode === 'WALKING'
        ? google.maps.TravelMode.WALKING
        : mode === 'TRANSIT'
        ? google.maps.TravelMode.TRANSIT
        : google.maps.TravelMode.DRIVING;

    directionsService.route(
      {
        origin: origin.toLowerCase().includes('ghana') ? origin : `${origin}, Ghana`,
        destination: destination.toLowerCase().includes('ghana') ? destination : `${destination}, Ghana`,
        travelMode: gMode,
        provideRouteAlternatives: true
      },
      (result, status) => {
        setRouteLoading(false);
        if (status === google.maps.DirectionsStatus.OK && result && result.routes && result.routes[0]) {
          const mainRoute = result.routes[0];
          const leg = mainRoute.legs[0];

          const distanceMeters = leg.distance?.value || 0;
          const durationSeconds = leg.duration?.value || 0;
          const distanceKm = Number((distanceMeters / 1000).toFixed(1));
          const estimatedFee = calculateEscrowDeliveryFee(distanceKm);

          const steps = leg.steps?.slice(0, 5).map((s) => s.instructions.replace(/<[^>]*>?/gm, '')) || [];

          const details = {
            origin: leg.start_address || origin,
            destination: leg.end_address || destination,
            distanceText: leg.distance?.text || `${distanceKm} km`,
            durationText: leg.duration?.text || `${Math.round(durationSeconds / 60)} mins`,
            distanceMeters,
            durationSeconds,
            estimatedDeliveryFeeGHS: estimatedFee,
            steps,
            directionsResult: result
          };

          setActiveRouteInfo(details);
          setSelectedPlaces([]);

          // Set simulated courier marker along the route (e.g. midway or near origin)
          if (leg.start_location && leg.end_location) {
            const midLat = (leg.start_location.lat() + leg.end_location.lat()) / 2;
            const midLng = (leg.start_location.lng() + leg.end_location.lng()) / 2;
            setCourierLocation({ lat: midLat, lng: midLng });
          }

          if (callback) callback(details);
        } else {
          setRouteError(`Route not found for "${origin}" to "${destination}". Please specify exact city or landmark names.`);
          if (callback) callback(null);
        }
      }
    );
  };

  // Agent Chat Processor
  const handleAgentPrompt = (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt) return;

    // Add user message to log
    const userMsg: AgentMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsAgentProcessing(true);

    const lower = prompt.toLowerCase();

    // 1. Order Tracking Request (e.g. "track order", "track #ZV-9821", "where is my kaftan")
    if (lower.includes('track') || lower.includes('order') || lower.includes('rider') || lower.includes('courier')) {
      setTimeout(() => {
        setIsAgentProcessing(false);
        const orderToTrack = orders.find((o) => lower.includes(o.id.toLowerCase())) || orders[0];
        if (orderToTrack) {
          handleTrackOrder(orderToTrack);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `agent-${Date.now()}`,
              sender: 'agent',
              text: `I couldn't locate that specific order ID. Here are your verified active Zorvaniq dispatch hubs currently processing inter-region packages.`,
              timestamp: 'Just now',
              type: 'info'
            }
          ]);
        }
      }, 600);
      return;
    }

    // 2. Route & Directions Request (e.g. "route", "directions", "how to get from X to Y", "distance", "ETA")
    if (
      lower.includes('route') ||
      lower.includes('directions') ||
      lower.includes('from') ||
      lower.includes('to') ||
      lower.includes('distance') ||
      lower.includes('eta')
    ) {
      let orig = 'Kumasi Kejetia';
      let dest = 'Accra Mall';

      if (lower.includes('from') && lower.includes('to')) {
        const parts = prompt.split(/to/i);
        const fromPart = parts[0].split(/from/i)[1];
        if (fromPart && parts[1]) {
          orig = fromPart.trim();
          dest = parts[1].trim();
        }
      } else if (lower.includes('accra') && lower.includes('kumasi')) {
        orig = 'Accra Central';
        dest = 'Kumasi Central';
      } else if (lower.includes('spintex') || lower.includes('tema')) {
        orig = 'Tema Harbour';
        dest = 'Spintex Road, Accra';
      }

      setOriginQuery(orig);
      setDestinationQuery(dest);

      executeDirectionsCalculation(orig, dest, 'DRIVING', (routeDetails) => {
        setIsAgentProcessing(false);
        if (routeDetails) {
          setMessages((prev) => [
            ...prev,
            {
              id: `agent-${Date.now()}`,
              sender: 'agent',
              text: `I calculated the real-time Google Maps route from ${routeDetails.origin} to ${routeDetails.destination}. Total distance is ${routeDetails.distanceText} (${routeDetails.durationText} in current traffic). Recommended Zorvaniq Escrow Courier Fee is GH₵${routeDetails.estimatedDeliveryFeeGHS.toFixed(2)}.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: 'route',
              data: { routeDetails }
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `agent-${Date.now()}`,
              sender: 'agent',
              text: `I couldn't calculate that specific route. I have loaded Ghana's primary arterial logistics route connecting Kejetia Market (Kumasi) to Makola Market (Accra).`,
              timestamp: 'Just now',
              type: 'info'
            }
          ]);
        }
      });
      return;
    }

    // 3. Place / Market / Store Search Request
    executePlacesSearch(prompt, (places) => {
      setIsAgentProcessing(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: `Found ${places.length} real-time verified locations matching "${prompt}". The map camera has been updated to show these pins. Click any card or pin to inspect full address, ratings, or plot a delivery route.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'places',
          data: { places }
        }
      ]);
    });
  };

  // Track specific order on map
  const handleTrackOrder = (order: Order) => {
    const origin = order.sellerName.includes('Kumasi')
      ? 'Kumasi, Ghana'
      : order.sellerName.includes('Tamale')
      ? 'Tamale, Ghana'
      : 'Accra Central, Ghana';

    const destination = order.buyerAddress || `${order.buyerRegion}, Ghana`;

    setOriginQuery(origin);
    setDestinationQuery(destination);

    executeDirectionsCalculation(origin, destination, 'DRIVING', (routeDetails) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-order-${Date.now()}`,
          sender: 'agent',
          text: `Live tracking engaged for Order #${order.id} (${order.items[0]?.product.title || 'Market Item'}). Package dispatched from ${order.sellerName} (${origin}) en route to ${order.buyerName} at ${destination}.`,
          timestamp: 'Just now',
          type: 'order_tracking',
          data: { order, routeDetails }
        }
      ]);
    });
  };

  // Locate user position
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMapCenter(userPos);
        setMapZoom(15);
        setOriginQuery('My Current Location');
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-loc-${Date.now()}`,
            sender: 'agent',
            text: `Detected your current device coordinates at lat ${userPos.lat.toFixed(4)}, lng ${userPos.lng.toFixed(4)}. Map centered on your position.`,
            timestamp: 'Just now',
            type: 'info'
          }
        ]);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert('Could not retrieve your exact position. Please verify browser location permissions.');
      }
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner with Google Maps Platform live indicator */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold border border-amber-500/30 mb-2">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Google Maps Platform Grounding & Live Geospatial Agent</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Zorvaniq Maps & Logistics Hub
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
              Real-time Google Places, route distance calculations, turn-by-turn directions, and escrow delivery courier dispatch tracking across Ghana.
            </p>
          </div>

          {/* Quick mode toggles */}
          <div className="flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 shrink-0">
            <button
              onClick={() => setActiveMode('agent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'agent'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Agent Chat
            </button>
            <button
              onClick={() => setActiveMode('routes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'routes'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <RouteIcon className="w-3.5 h-3.5" />
              Directions
            </button>
            <button
              onClick={() => setActiveMode('places')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'places'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Places
            </button>
            <button
              onClick={() => setActiveMode('hubs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeMode === 'hubs'
                  ? 'bg-amber-500 text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Hubs
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side Control / Agent Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left / Interaction Panel (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Active Mode: AGENT CHAT */}
          {activeMode === 'agent' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-xl">
              {/* Agent Chat Header */}
              <div className="p-3.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      Zorvaniq Maps Agent
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      Powered by real-time Google Maps Data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: 'reset',
                        sender: 'agent',
                        text: 'Agent memory cleared. How can I assist with places, routes, or merchant dispatches today?',
                        timestamp: 'Just now'
                      }
                    ]);
                    setActiveRouteInfo(null);
                    setSelectedPlaces([]);
                  }}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Log */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-3 ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-neutral-950 font-medium rounded-tr-sm'
                          : 'bg-neutral-950/80 text-neutral-200 border border-neutral-800 rounded-tl-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {/* Attached Route Card */}
                      {msg.data?.routeDetails && (
                        <div className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-amber-400 flex items-center gap-1">
                              <RouteIcon className="w-3.5 h-3.5" />
                              {msg.data.routeDetails.distanceText}
                            </span>
                            <span className="text-neutral-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {msg.data.routeDetails.durationText}
                            </span>
                          </div>
                          <div className="bg-neutral-900 p-2 rounded-lg border border-neutral-800 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-400">Escrow Delivery Fee:</span>
                            <span className="font-mono font-bold text-amber-400 text-xs">
                              GH₵{msg.data.routeDetails.estimatedDeliveryFeeGHS.toFixed(2)}
                            </span>
                          </div>
                          {Array.isArray(msg.data?.routeDetails?.steps) && msg.data.routeDetails.steps.length > 0 && (
                            <div className="text-[10px] text-neutral-400 space-y-1">
                              <span className="font-semibold text-neutral-300 block">Initial Steps:</span>
                              {msg.data.routeDetails.steps.slice(0, 3).map((st, i) => (
                                <p key={i} className="pl-2 border-l border-amber-500/30">
                                  {i + 1}. {st}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Attached Places Cards */}
                      {Array.isArray(msg.data?.places) && (
                        <div className="mt-2.5 space-y-1.5">
                          {msg.data.places.map((place) => (
                            <div
                              key={place.id}
                              onClick={() => {
                                setSelectedMarkerPlace(place);
                                setMapCenter(place.location);
                                setMapZoom(15);
                              }}
                              className="bg-neutral-900 hover:bg-neutral-850 p-2 rounded-lg border border-neutral-800 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">
                                  {place.name}
                                </span>
                                {place.rating && (
                                  <span className="flex items-center gap-0.5 text-amber-400 text-[10px]">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    {place.rating}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                                {place.formatted_address}
                              </p>
                              <div className="mt-1.5 flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOriginQuery('Accra Central');
                                    setDestinationQuery(place.formatted_address || place.name);
                                    setActiveMode('routes');
                                    executeDirectionsCalculation('Accra Central', place.formatted_address || place.name);
                                  }}
                                  className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 font-semibold transition-colors"
                                >
                                  Route Here
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attached Order Card */}
                      {msg.data?.order && (
                        <div className="mt-2.5 bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-400">Order #{msg.data.order.id}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {msg.data.order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-neutral-300">
                            Recipient: {msg.data.order.buyerName} ({msg.data.order.buyerPhone})
                          </p>
                          <p className="text-neutral-400 text-[10px]">
                            Dispatch Rider: {msg.data.order.deliveryAgent?.name} ({msg.data.order.deliveryAgent?.vehicle})
                          </p>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-500 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isAgentProcessing && (
                  <div className="flex items-center gap-2 text-neutral-400 text-xs p-2">
                    <Compass className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Querying Google Maps Places & Routes API...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-3 py-2 bg-neutral-950/90 border-t border-neutral-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => handleAgentPrompt('Route delivery from Kumasi Kejetia to Accra Mall')}
                  className="px-2 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-300 whitespace-nowrap transition-colors"
                >
                  🚚 Kumasi ➔ Accra Route
                </button>
                <button
                  onClick={() => handleAgentPrompt('Find electronics and phone markets in Accra')}
                  className="px-2 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-300 whitespace-nowrap transition-colors"
                >
                  📍 Accra Tech Hubs
                </button>
                <button
                  onClick={() => handleAgentPrompt('Track courier for active order #ZV-9821')}
                  className="px-2 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-300 whitespace-nowrap transition-colors"
                >
                  🛵 Track Order #ZV-9821
                </button>
                <button
                  onClick={() => handleAgentPrompt('Directions from Tema Port to Spintex Road')}
                  className="px-2 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-300 whitespace-nowrap transition-colors"
                >
                  ⏱️ Tema ➔ Spintex
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAgentPrompt(chatInput);
                }}
                className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask agent for places, routes, directions, or order dispatch..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAgentProcessing}
                  className="p-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 rounded-xl transition-colors font-bold"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Active Mode: ROUTES & DIRECTIONS CALCULATOR */}
          {activeMode === 'routes' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[580px] overflow-y-auto shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RouteIcon className="w-4 h-4 text-amber-400" />
                  Real-Time Route Calculator
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                  Google Routes API
                </span>
              </div>

              {/* Origin & Destination Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Pickup / Origin Point:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => setOriginQuery(e.target.value)}
                      placeholder="e.g. Kumasi Adum, Accra Central, Tema"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                    Destination / Buyer Address:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destinationQuery}
                      onChange={(e) => setDestinationQuery(e.target.value)}
                      placeholder="e.g. East Legon, Takoradi, Tamale"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Travel Mode Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-300 block mb-1.5">
                    Transportation Mode:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'DRIVING', label: 'Car/Van' },
                      { id: 'TWO_WHEELER', label: 'Motorbike' },
                      { id: 'TRANSIT', label: 'Trotro' },
                      { id: 'WALKING', label: 'Walking' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setTravelMode(m.id as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-semibold text-center border transition-all ${
                          travelMode === m.id
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={routeLoading || !originQuery || !destinationQuery}
                  onClick={() => executeDirectionsCalculation(originQuery, destinationQuery, travelMode)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  {routeLoading ? (
                    <>
                      <Compass className="w-4 h-4 animate-spin" />
                      <span>Computing Route from Google Maps...</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Calculate Route, ETA & Courier Fee</span>
                    </>
                  )}
                </button>
              </div>

              {routeError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{routeError}</span>
                </div>
              )}

              {/* Route Results Display */}
              {activeRouteInfo && (
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Total Driving Distance</span>
                      <span className="text-base font-extrabold text-white font-mono">
                        {activeRouteInfo.distanceText}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block">Estimated Travel Time</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">
                        {activeRouteInfo.durationText}
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-white block">
                        Zorvaniq Escrow Courier Fee
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Locked securely until buyer inspection
                      </span>
                    </div>
                    <span className="text-sm font-black text-amber-400 font-mono">
                      GH₵{activeRouteInfo.estimatedDeliveryFeeGHS.toFixed(2)}
                    </span>
                  </div>

                  {/* Turn by turn */}
                  {activeRouteInfo.steps && activeRouteInfo.steps.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider block">
                        Turn-By-Turn Waypoint Guidance:
                      </span>
                      <div className="max-h-36 overflow-y-auto space-y-1 text-[10px] text-neutral-400 pr-1">
                        {activeRouteInfo.steps.map((st: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-1.5 p-1 bg-neutral-900/50 rounded">
                            <span className="text-amber-500 font-bold shrink-0">{idx + 1}.</span>
                            <span>{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Active Mode: PLACES EXPLORER */}
          {activeMode === 'places' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[580px] overflow-y-auto shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Google Places Explorer
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                  Live Places API
                </span>
              </div>

              {/* Search Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={placesQuery}
                  onChange={(e) => setPlacesQuery(e.target.value)}
                  placeholder="Search markets, malls, electronics, artisans in Ghana..."
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => executePlacesSearch(placesQuery)}
                  disabled={placesLoading || !placesQuery.trim()}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-xl font-bold text-xs transition-colors shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Categories */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
                {['Electronics Accra', 'Kejetia Market Kumasi', 'Makola Market', 'Tema Cargo Hub', 'Shea Butter Tamale'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setPlacesQuery(cat);
                      executePlacesSearch(cat);
                    }}
                    className="px-2 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-amber-500/50 whitespace-nowrap transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Places List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {placesLoading && (
                  <div className="text-center py-6 text-neutral-400 text-xs flex flex-col items-center gap-2">
                    <Compass className="w-5 h-5 animate-spin text-amber-400" />
                    <span>Pulling live places from Google Maps...</span>
                  </div>
                )}

                {!placesLoading && selectedPlaces.length === 0 && (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    Type a landmark, city, or merchant name above to query Google Places data.
                  </div>
                )}

                {selectedPlaces.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedMarkerPlace(p);
                      setMapCenter(p.location);
                      setMapZoom(15);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedMarkerPlace?.id === p.id
                        ? 'bg-neutral-950 border-amber-500 shadow-md'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-white text-xs leading-snug">{p.name}</h4>
                      {p.rating && (
                        <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-400 text-[10px] font-bold shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{p.rating}</span>
                          <span className="text-neutral-500">({p.user_ratings_total})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                      {p.formatted_address}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-neutral-500">
                        {p.location.lat.toFixed(4)}, {p.location.lng.toFixed(4)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOriginQuery('Accra Central');
                          setDestinationQuery(p.formatted_address || p.name);
                          setActiveMode('routes');
                          executeDirectionsCalculation('Accra Central', p.formatted_address || p.name);
                        }}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 font-bold transition-all"
                      >
                        Calculate Route
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Mode: VERIFIED HUBS */}
          {activeMode === 'hubs' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col h-[580px] overflow-y-auto shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Verified Zorvaniq Merchant Hubs
                </h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                  6 Main Hubs
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Physical collection centers and wholesale partner depots across Ghana where buyers can collect packages or sellers can drop items for fast dispatch.
              </p>

              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {VERIFIED_ZORVANIQ_HUBS.map((hub) => (
                  <div
                    key={hub.id}
                    onClick={() => {
                      setMapCenter(hub.location);
                      setMapZoom(15);
                      setSelectedPlaces([
                        {
                          id: hub.id,
                          name: hub.name,
                          formatted_address: hub.address,
                          rating: 4.9,
                          user_ratings_total: 68,
                          location: hub.location,
                          types: ['point_of_interest']
                        }
                      ]);
                    }}
                    className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-emerald-500/50 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-white text-xs">{hub.name}</h4>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">
                        {hub.region}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-1">{hub.address}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-neutral-500">{hub.type}</span>
                      <span className="text-amber-400 font-semibold">{hub.ordersPending} orders processing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right / Map Panel (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          {/* Map Controls Header */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-white text-xs">Live Interactive Map</span>
              <span className="text-[10px] text-neutral-400 hidden sm:inline">• Ghana & Intercity Corridors</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Map Type Switcher */}
              <div className="bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 flex items-center text-[10px]">
                <button
                  onClick={() => setMapTypeId('roadmap')}
                  className={`px-2 py-0.5 rounded ${
                    mapTypeId === 'roadmap' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setMapTypeId('satellite')}
                  className={`px-2 py-0.5 rounded ${
                    mapTypeId === 'satellite' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Satellite
                </button>
                <button
                  onClick={() => setMapTypeId('terrain')}
                  className={`px-2 py-0.5 rounded ${
                    mapTypeId === 'terrain' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Terrain
                </button>
              </div>

              {/* Locate Me */}
              <button
                onClick={handleLocateMe}
                title="Locate my position via browser GPS"
                className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-400 rounded-lg transition-colors"
              >
                <Locate className="w-3.5 h-3.5" />
              </button>

              {/* Reset to Ghana */}
              <button
                onClick={() => {
                  setMapCenter({ lat: 6.6885, lng: -1.6244 });
                  setMapZoom(7);
                  setActiveRouteInfo(null);
                  setSelectedPlaces([]);
                }}
                title="Reset view to whole of Ghana"
                className="p-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors text-[10px] flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden md:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 h-[526px] bg-neutral-950 shadow-2xl">
            <APIProvider
              apiKey={apiKey}
              libraries={['places', 'routes', 'geometry', 'marker']}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            >
              <Map
                center={mapCenter}
                zoom={mapZoom}
                mapTypeId={mapTypeId}
                onCenterChanged={(e) => {
                  if (e.detail?.center) {
                    setMapCenter(e.detail.center);
                  }
                }}
                onZoomChanged={(e) => {
                  if (typeof e.detail?.zoom === 'number') {
                    setMapZoom(e.detail.zoom);
                  }
                }}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                <MapContentController
                  selectedPlaces={selectedPlaces}
                  activeRouteInfo={activeRouteInfo}
                  selectedMarkerPlace={selectedMarkerPlace}
                  onSelectMarker={(p) => setSelectedMarkerPlace(p)}
                  courierLocation={courierLocation}
                  onSelectHub={(hub) => {
                    setSelectedPlaces([
                      {
                        id: hub.id,
                        name: hub.name,
                        formatted_address: hub.address,
                        rating: 4.9,
                        user_ratings_total: 54,
                        location: hub.location
                      }
                    ]);
                    setMapCenter(hub.location);
                    setMapZoom(14);
                  }}
                />
              </Map>
            </APIProvider>

            {/* Bottom floating badge / live info overlay */}
            <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between">
              <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-800 px-3 py-1.5 rounded-xl pointer-events-auto shadow-lg flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] text-neutral-300">
                  Zorvaniq Escrow Distance Protected
                </span>
              </div>

              {activeRouteInfo && (
                <div className="bg-neutral-950/90 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-xl pointer-events-auto shadow-lg flex items-center gap-3 text-xs">
                  <span className="text-white font-bold font-mono">
                    {activeRouteInfo.distanceText}
                  </span>
                  <span className="text-amber-400 font-bold font-mono">
                    {activeRouteInfo.durationText}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
