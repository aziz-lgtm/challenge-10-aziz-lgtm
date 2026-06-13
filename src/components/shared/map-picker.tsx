'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onConfirm: (lat: number, lng: number) => void;
  onClose: () => void;
}

// Indonesia center as default
const DEFAULT_LAT = -2.5;
const DEFAULT_LNG = 118.0;
const DEFAULT_ZOOM = 5;
const SELECTED_ZOOM = 13;

export function MapPicker({ initialLat, initialLng, onConfirm, onClose }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(
    initialLat != null && initialLng != null ? { lat: initialLat, lng: initialLng } : null
  );

  useEffect(() => {
    if (!mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    let map: import('leaflet').Map;
    let marker: import('leaflet').Marker | null = null;

    import('leaflet').then((L) => {
      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const startLat = initialLat ?? DEFAULT_LAT;
      const startLng = initialLng ?? DEFAULT_LNG;
      const startZoom = initialLat != null ? SELECTED_ZOOM : DEFAULT_ZOOM;

      map = L.map(mapRef.current!).setView([startLat, startLng], startZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      function placeMarker(lat: number, lng: number) {
        if (marker) marker.remove();
        marker = L.marker([lat, lng], { draggable: true }).addTo(map);
        setSelected({ lat, lng });

        marker.on('dragend', () => {
          const pos = marker!.getLatLng();
          setSelected({ lat: pos.lat, lng: pos.lng });
        });
      }

      // Place initial marker if coords exist
      if (initialLat != null && initialLng != null) {
        placeMarker(initialLat, initialLng);
      }

      map.on('click', (e) => {
        placeMarker(e.latlng.lat, e.latlng.lng);
      });
    });

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span className="font-semibold text-sm">Choose Your Location</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>

          {/* Hint */}
          <p className="text-xs text-muted-foreground px-4 pt-2">
            Click anywhere on the map to place a pin. You can drag the pin to adjust.
          </p>

          {/* Map */}
          <div ref={mapRef} className="w-full h-80" />

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-xs text-muted-foreground">
              {selected
                ? `${selected.lat.toFixed(5)}, ${selected.lng.toFixed(5)}`
                : 'No location selected'}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!selected}
                onClick={() => selected && onConfirm(selected.lat, selected.lng)}
              >
                <Check className="size-3 mr-1" />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
