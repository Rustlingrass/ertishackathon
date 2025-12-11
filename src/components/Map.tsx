// components/Map.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const priorityIcons = {
  critical: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  high: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  medium: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
  low: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  }),
};

const pavlodarCenter: LatLngExpression = [52.2833, 76.9667];

export interface MapProps {
  filteredReports: any[];
}

export default function Map({ filteredReports }: MapProps) {
  return (
    <MapContainer center={pavlodarCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {filteredReports
        .filter(report => report.location !== null)
        .map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lon]}
            icon={priorityIcons[report.priority as keyof typeof priorityIcons] || priorityIcons.low}
          >
            <Popup
              maxWidth={550}           // даём простор
              minWidth={350}
              maxHeight={500}
              closeButton={false}
              offset={[0, -20]}                    // чуть приподнимаем
              autoPan={false}
              className="jarqyn-popup"
            >
              {/* Обёртка, которая полностью перехватывает размеры */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden bg-white shadow-2xl">
                {/* Кастомная кнопка закрытия */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // @ts-ignore
                    map.closePopup();
                  }}
                  className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-2xl font-light text-gray-600 shadow-lg backdrop-blur hover:bg-white"
                >
                  ×
                </button>

                {/* Фото */}
                {report.photo_url && (
                  <div className="relative h-64 w-full">
                    <Image
                      src={report.photo_url}
                      alt="Проблема"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Контент со своим скроллом */}
                <div className="max-h-[500px] overflow-y-auto px-6 pb-6 pt-4 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-100">
                  <h3 className="text-lg font-bold text-orange-600">{report.category}</h3>
                  <p className="mt-1 text-base font-semibold">{report.title}</p>
                  <p className="mt-4 text-sm leading-relaxed text-gray-700">
                    {report.description || 'Без описания'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge
                      className={cn(
                        "font-semibold",
                        report.priority === 'critical' && "bg-red-700 text-white animate-pulse ring-2 ring-red-400",
                        report.priority === 'high' && "bg-red-600 text-white",
                        report.priority === 'medium' && "bg-orange-500 text-white",
                        report.priority === 'low' && "bg-green-600 text-white"
                      )}
                    >
                      {report.priority === 'critical' && "КРИТИЧЕСКИЙ"}
                      {report.priority === 'high' && "Высокий"}
                      {report.priority === 'medium' && "Средний"}
                      {report.priority === 'low' && "Низкий"}
                    </Badge>

                    {/* Статус */}
                    <Badge
                      className={cn(
                        "text-white font-medium",
                        report.status === 'done' && "bg-green-600",
                        report.status === 'in_process' && "bg-yellow-600",
                        report.status === 'received' && "bg-blue-600"
                      )}
                    >
                      {report.status === 'received' ? 'Получено' :
                        report.status === 'in_process' ? 'В работе' : 'Выполнено'}
                    </Badge>
                  </div>

                  <p className="mt-5 text-xs text-gray-500">
                    {new Date(report.timestamp).toLocaleDateString('ru-KZ', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}