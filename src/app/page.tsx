// app/page.tsx
'use client';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Zap, Shield, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { List, Circle, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // или сам сделай: const cn = (...inputs: ClassValue[]) => inputs.filter(Boolean).join(' ');

const priorityIcons = {
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


export default function Home() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'received' | 'in_process' | 'done'>('all');
  const [loading, setLoading] = useState(true);

  const BACKEND_BASE_URL = 'https://localhost:3001'; // Ask your friend for exact domain/IP
  const BACKEND_URL = 'http://localhost:3001/reports'; // DEMO BACKEND URL
  // const BACKEND_URL = `${BACKEND_BASE_URL}/api/admin/reports/`; // Full endpoint

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(BACKEND_URL);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        // Normalize data for map
        const normalized = data.map((report: any) => ({
          id: report.id,
          category: report.category,
          title: report.title === "Новый отчет" ? report.generated_description.slice(0, 50) + '...' : report.title,
          description: report.generated_description || report.original_description,
          priority: report.priority, // low/medium/high
          status: report.status, // received, in_process, done
          photo_url: report.image_url ? `${BACKEND_BASE_URL}${report.image_url}` : null,
          location: report.latitude && report.longitude
            ? { lat: report.latitude, lon: report.longitude }
            : null,
          timestamp: report.created_at,
        }));

        setReports(normalized);
        setFilteredReports(normalized);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter(r => r.status === selectedFilter));
    }
  }, [selectedFilter, reports]);
  const pavlodarCenter: LatLngExpression = [52.2833, 76.9667];

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-mosque.jpg" // put your image in /public/hero-mosque.jpg
            alt="Pavlodar"
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 px-6 py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="bg-white text-orange-600 font-bold text-2xl px-5 py-2 rounded-lg shadow-lg">
              Jarqın
            </div>
            <nav className="hidden md:flex space-x-10 text-lg">
              <a href="#" className="hover:text-orange-300 transition">Домой</a>
              <a href="#map" className="hover:text-orange-300 transition">Карта</a>
              <a href="#" className="hover:text-orange-300 transition">Новости</a>
              <a href="#" className="hover:text-orange-300 transition">О нас</a>
            </nav>
            <Button variant="ghost" size="icon" className="text-white">
              Globe icon
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Какая то хуетень про<br />
            чистый город и тп красивый текст<br />
            на белом фоне, тип держите город пиздатым
          </h1>
          <p className="text-xl md:text-2xl opacity-90">Tanat kiber drochila</p>
        </div>
      </section>

      {/* PROBLEMS SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Какой текст про то что люди сталкиваются с проблемами пока пытаются алих педик как то сообщить о инфраструктурном порно
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-teal-500 text-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition">
                <div className="bg-white/20 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Phone className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Отсутствие мобильности</h3>
                <p className="opacity-90">пиздень текст про проблему</p>
              </Card>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-teal-500 text-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition">
                <div className="bg-white/20 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Zap className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Долгая обработка данных</h3>
                <p className="opacity-90">пиздень текст про проблему</p>
              </Card>
            </motion.div>
            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-teal-500 text-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition">
                <div className="bg-white/20 w-32 h-32 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Отсутствие прозрачности</h3>
                <p className="opacity-90">пиздень текст про проблему</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">О нас</h2>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-12 text-left">
              <div>
                <h3 className="text-2xl font-bold mb-4">Фиксация проблемы на камеру телефона</h3>
                <p className="text-gray-600 leading-relaxed">
                  Сунь хуй Ивчай делает фото подробного описания хуйни в место где хуйня где хуйня упала на хуйню при хуевых обстоятельствах...
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Оповещение о наличие проблемы с подробным описанием</h3>
                <p className="text-gray-600 leading-relaxed">
                  Сунь хуй Ивчай делает фото подробного описания хуйни в место где хуйня где хуйня упала на хуйню при хуевых обстоятельствах...
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-teal-500 text-white px-8 py-4 rounded-full text-xl font-bold absolute -top-8 -left-10 z-10">
                Тип фотоает хуйню
              </div>
              <Image
                src="/phone-mockup.png"
                alt="Jarqın app"
                width={400}
                height={800}
                className="mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAP + FILTERS SECTION */}
      <section id="map" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Карта событий</h2>

          {/* Map */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12 h-96 md:h-[600px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                Загрузка карты...
              </div>
            ) : (
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
                      <Popup className="custom-popup">
                        <div className="p-3 max-w-xs">
                          {report.photo_url && (
                            <Image
                              src={report.photo_url}
                              alt="Report"
                              width={300}
                              height={200}
                              className="rounded-lg mb-3 object-cover w-full"
                            />
                          )}
                          <h3 className="font-bold text-lg">{report.category}</h3>
                          <p className="text-sm font-medium mt-1">{report.title}</p>
                          <p className="text-sm text-gray-700 my-2">{report.description}</p>
                          <div className="flex gap-2 flex-wrap mt-3">
                            <Badge variant={report.priority === 'high' ? 'destructive' : 'secondary'}>
                              Приоритет: {report.priority === 'high' ? 'Высокий' : report.priority === 'medium' ? 'Средний' : 'Низкий'}
                            </Badge>
                            <Badge className={
                              report.status === 'done' ? 'bg-green-500 text-white' :
                                report.status === 'in_process' ? 'bg-yellow-500 text-white' :
                                  'bg-blue-500 text-white'
                            }>
                              {report.status === 'received' ? 'Получено' :
                                report.status === 'in_process' ? 'В процессе' :
                                  'Выполнено'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(report.timestamp).toLocaleString('ru-RU')}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            )}
          </div>
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              Показано маркеров: <span className="font-bold text-black">
                {filteredReports.filter(r => r.location !== null).length}
              </span> из {reports.filter(r => r.location !== null).length} с геолокацией
            </p>
          </div>
          {/* Status Filter Buttons — обновлённая версия */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {/* КНОПКА "ВСЕ" — теперь ОГОНЬ */}
            <Button
              size="lg"
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              className={cn(
                "min-w-48 gap-3 text-lg font-semibold transition-all duration-300 ease-out",
                "hover:scale-105 hover:shadow-xl",
                selectedFilter === 'all'
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/50 shadow-lg scale-105"
                  : "border-2 border-orange-300 text-orange-700 hover:bg-orange-50"
              )}
            >
              <motion.div
                animate={{ rotate: selectedFilter === 'all' ? [0, -10, 10, -10, 0] : 0 }}
                transition={{ duration: 0.5, repeat: selectedFilter === 'all' ? 1 : 0 }}
              >
                <List className="w-6 h-6" />
              </motion.div>
              Показать все
              <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                {reports.length}
              </span>
            </Button>

            {/* Остальные кнопки — чуть улучшил цвета и анимацию */}
            <Button
              size="lg"
              variant={selectedFilter === 'received' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('received')}
              className={cn(
                "min-w-48 gap-3 text-lg font-semibold transition-all duration-300",
                "hover:scale-105",
                selectedFilter === 'received'
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : "border-2 border-blue-400 text-blue-700 hover:bg-blue-50"
              )}
            >
              <Circle className="w-5 h-5" />
              Получено
              <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                {reports.filter(r => r.status === 'received').length}
              </span>
            </Button>

            <Button
              size="lg"
              variant={selectedFilter === 'in_process' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('in_process')}
              className={cn(
                "min-w-48 gap-3 text-lg font-semibold transition-all duration-300",
                "hover:scale-105",
                selectedFilter === 'in_process'
                  ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-500/30"
                  : "border-2 border-yellow-400 text-yellow-700 hover:bg-yellow-50"
              )}
            >
              <Clock className="w-5 h-5" />
              В процессе
              <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                {reports.filter(r => r.status === 'in_process').length}
              </span>
            </Button>

            <Button
              size="lg"
              variant={selectedFilter === 'done' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('done')}
              className={cn(
                "min-w-48 gap-3 text-lg font-semibold transition-all duration-300",
                "hover:scale-105",
                selectedFilter === 'done'
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30"
                  : "border-2 border-green-400 text-green-700 hover:bg-green-50"
              )}
            >
              <CheckCircle className="w-5 h-5" />
              Выполнено
              <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                {reports.filter(r => r.status === 'done').length}
              </span>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12 text-center">
        <p>© 2025 Jarqın — Прозрачные города начинаются с тебя</p>
      </footer>
    </>
  );
}