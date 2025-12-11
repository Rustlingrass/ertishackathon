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
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'received' | 'in_process' | 'done',
    priority: 'all' as 'all' | 'low' | 'medium' | 'high' | 'critical',
    category: 'all' as string,
  });

  const BACKEND_BASE_URL = 'http://34.51.240.162:8000'; // Ask your friend for exact domain/IP
  // const BACKEND_URL = 'http://localhost:3001/reports'; // DEMO BACKEND URL
  const BACKEND_URL = `${BACKEND_BASE_URL}/api/admin/reports/`; // Full endpoint

  useEffect(() => {
    // Убиваем скролл Leaflet навсегда
    const killLeafletScroll = () => {
      document.querySelectorAll('.leaflet-popup-content').forEach(el => {
        el.removeAttribute('style');
        (el as HTMLElement).style.overflow = 'hidden';
      });
    };
    const observer = new MutationObserver(killLeafletScroll);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (filters.status !== 'all') {
      filtered = filtered.filter(r => r.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(r => r.priority === filters.priority);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    setFilteredReports(filtered);
  }, [filters, reports]);

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
            )}
          </div>
          <div className="text-center mb-6">
            <p className="text-lg text-gray-600">
              Показано маркеров: <span className="font-bold text-black">
                {filteredReports.filter(r => r.location !== null).length}
              </span> из {reports.filter(r => r.location !== null).length} с геолокацией
            </p>
          </div>
          {/* === НОВЫЙ УМНЫЙ ФИЛЬТР === */}
          <div className="w-full max-w-5xl mx-auto mt-12 mb-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                Фильтры
              </h3>

              <div className="grid md:grid-cols-3 gap-8">

                {/* 1. Статус */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Статус заявки
                  </label>
                  <div className="space-y-3">
                    {(['all', 'received', 'in_process', 'done'] as const).map((status) => (
                      <label key={status} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={filters.status === status}
                          onChange={() => setFilters(prev => ({ ...prev, status }))}
                          className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="flex items-center gap-2">
                          {status === 'all' && <List className="w-4 h-4" />}
                          {status === 'received' && <Circle className="w-4 h-4 text-red-500" />}
                          {status === 'in_process' && <Clock className="w-4 h-4 text-yellow-600" />}
                          {status === 'done' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {status === 'all' ? 'Все заявки' :
                            status === 'received' ? 'Получено' :
                              status === 'in_process' ? 'В работе' : 'Выполнено'}
                          <span className="text-xs text-gray-500 ml-auto">
                            ({status === 'all' ? reports.length : reports.filter(r => r.status === status).length})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Приоритет */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Приоритет
                  </label>
                  <div className="space-y-3">
                    {(['all', 'low', 'medium', 'high', 'critical'] as const).map((prio) => (
                      <label key={prio} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          checked={filters.priority === prio}
                          onChange={() => setFilters(prev => ({ ...prev, priority: prio }))}
                          className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                        />
                        <span className={cn(
                          "flex items-center gap-2 font-medium",
                          prio === 'critical' && "text-red-600",
                          prio === 'high' && "text-red-500",
                          prio === 'medium' && "text-orange-600",
                          prio === 'low' && "text-green-600"
                        )}>
                          {prio === 'all' ? 'Любой приоритет' :
                            prio === 'critical' ? 'Критический' :
                              prio === 'high' ? 'Высокий' :
                                prio === 'medium' ? 'Средний' : 'Низкий'}
                          {prio !== 'all' && (
                            <span className="text-xs text-gray-500 ml-auto">
                              ({reports.filter(r => r.priority === prio).length})
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Категория */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Тип проблемы
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
                  >
                    <option value="all">Все категории</option>
                    {[
                      "Дефекты дорог и тротуаров",
                      "Незаконная парковка и нарушения ПДД",
                      "Неисправное уличное освещение",
                      "Детские и спортивные площадки",
                      "Мусор и отходы",
                      "Бездомные и мертвые животные",
                      "Аварийные деревья и зелёные насаждения",
                      "Открытые люки и ливнёвки",
                      "Вандализм и граффити",
                      "ДТП и его последствия",
                      "Незаконная торговля и реклама",
                      "Сосульки, снег и наледь",
                      "Экологические проблемы",
                      "Канализация и ливнёвки",
                      "Общественный транспорт",
                      "Велодорожки и самокаты",
                      "Туалеты общественные",
                      "Другое"
                    ].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Кнопка сброса */}
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setFilters({ status: 'all', priority: 'all', category: 'all' })}
                  className="gap-2"
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12 text-center">
        <p>© 2025 Jarqın — Прозрачные города начинаются с тебя</p>
      </footer>
    </>
  );
}