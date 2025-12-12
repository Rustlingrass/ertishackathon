// app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from "next/link";
import {
  Bot,
  BrainCircuit,
  Monitor,
  Instagram,
  Menu,
  X,
  Trash2,
  SprayCan,
  Armchair,
  Trees,
  Bike,
  Cone,
  Bus,
  Squirrel,
  LightbulbOff,
  Megaphone,
  Recycle
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Zap, Shield, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { List, Circle, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // или сам сделай: const cn = (...inputs: ClassValue[]) => inputs.filter(Boolean).join(' ');

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false, // ← ЭТО КЛЮЧЕВОЕ!
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl bg-gray-50">
      Загрузка карты...
    </div>
  ),
});


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
  const pavlodarCenter = [52.2833, 76.9667] as const;

  return (
    <>
      {/* HERO SECTION */}
      <div className="min-h-screen bg-white text-slate-900 font-[Montserrat]">

        {/* -----------------------------------------------------------------------
          1. HEADER & NAVIGATION
      ------------------------------------------------------------------------ */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-full max-h-[60px] w-auto max-w-[240px] -my-px object-contain"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-20 font-semibold text-slate-600 font-[Montserrat] text-[20px]">
              <Link href="#Main" className="hover:text-blue-600 transition-colors">Домой</Link>
              <Link href="#map" className="hover:text-blue-600 transition-colors">Карта</Link>
              <Link href="#News" className="hover:text-blue-600 transition-colors">Новости</Link>
              <Link href="#About" className="hover:text-blue-600 transition-colors">О нас</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Язык</Link>
            </nav>

            {/* Mobile Menu Button (Optional placeholder) */}
            <button className="md:hidden p-2 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="pt-20">
          {/* -----------------------------------------------------------------------
            2. HERO SECTION
            Matches: image_1ab9e1.jpg
        ------------------------------------------------------------------------ */}
          <section className="relative overflow-hidden bg-white">
            <div className="container mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-16 md:pb-24">
              <div className="flex flex-col md:flex-row items-start justify-between gap-12 md:gap-16 max-w-7xl mx-auto">

                {/* Left: Text Content */}
                <div className="flex-1 max-w-xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-snug md:leading-tight lg:leading-[1.1]">
                    Станьте тем кто<br className="hidden md:block" />
                    преобразует наш город<br className="hidden lg:block" />
                    в лучшую сторону
                  </h1>

                  <p className="mt-8 md:mt-10 text-lg md:text-xl text-slate-600 leading-loose md:leading-loose max-w-lg">
                    Находите любые проблемы нашего города и сообщайте нам о них легко,
                    быстро и прозрачно — и станьте свидетелем того как всё в миг
                    меняется и оборачивается в лучшую сторону
                  </p>
                </div>
              </div>
            </div>

            {/* Right Ornament – touches navbar bottom and right edge */}
            <div className="absolute -top-5 right-0 w-[859] h-[672] pointer-events-none select-none overflow-hidden">
              <Image
                src="/HeroOrnament.png"
                alt="Декоративный орнамент"
                width={1859}
                height={1672}
                className="w-full h-full object-contain object-right"
                priority
              />
            </div>
          </section>

          {/* -----------------------------------------------------------------------
            3. FEATURES SECTION
            Matches: image_1ab731.jpg
        ------------------------------------------------------------------------ */}
          <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-8">

              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Платформа для прозрачного и высокоэффективного управления муниципальными процессами
                </h2>
                <p className="text-slate-500 text-lg">
                  Мы верим что голос каждого жителя нашего города должен быть услышан
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Telegram Bot */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Телеграм Бот</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Пользовательский telegram бот для сбора необходимой информации об определенной муниципальной проблеме
                  </p>
                </div>

                {/* Card 2: AI (Highlighted Blue) */}
                <div className="bg-blue-500 p-8 rounded-3xl shadow-xl shadow-blue-200 text-white relative overflow-hidden group">
                  {/* Decorative background circle */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl group-hover:bg-blue-400/50 transition-all"></div>

                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 text-white relative z-10">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">Искусственный интеллект</h3>
                  <p className="text-blue-100 text-sm leading-relaxed relative z-10">
                    Модель на основе Gemini 3 от Google для сортировки запросов от пользователей для быстрой и четкой оценки
                  </p>
                </div>

                {/* Card 3: Web Page */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Веб Страница</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Сайт для демонстраций обрабатываемых и выполненных процессов для полной прозрачности сервиса
                  </p>
                </div>

                {/* Card 4: Instagram */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">Страница Instagram</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Аккаунт для расширения аудитории и демонстрации проделанных результатов по преображению города
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* -----------------------------------------------------------------------
            4. DETAILS SECTION
        ------------------------------------------------------------------------ */}
          <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">
                Почему telegram bot
              </h2>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">

                {/* Left Text Block */}
                <div className="lg:w-1/3 text-center lg:text-right space-y-4">
                  <h3 className="text-2xl font-bold text-blue-600">
                    Простота в <br /> использовании
                  </h3>
                  <p className="text-slate-500 text-lg">
                    Универсальный и интуитивно понятный интерфейс, разработанный
                    с учетом потребностей всех возрастных групп
                  </p>
                </div>

                {/* Center Image (Phones) */}
                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative w-[600px] h-[600px]">
                    <Image
                      src="/Phones.png"
                      alt="App Interface on Phones"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Right Text Block */}
                <div className="lg:w-1/3 text-center lg:text-left space-y-4">
                  <h3 className="text-2xl font-bold text-blue-600">
                    Быстрый и легкий <br /> доступ
                  </h3>
                  <p className="text-slate-500 text-lg">
                    Возможность быстрого доступа к функционалу Telegram-бота
                    без прохождения дополнительных процедур авторизации.
                  </p>
                </div>

              </div>
            </div>
          </section>
          {/* -----------------------------------------------------------------------
            NEW SECTION: How AI Works
        ------------------------------------------------------------------------ */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">

              {/* Section Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
                Как работает модель ИИ
              </h2>

              {/* Main Card */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto border border-slate-100">

                {/* Left Side: Info & Logo */}
                <div className="w-full md:w-5/12 p-10 md:p-14 flex flex-col justify-center items-start bg-white z-10">

                  {/* Gemini Logo Area */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="relative w-[300px] h-[200px]">
                      <Image
                        src="/gemini-logo.png" /* Update this filename */
                        alt="Gemini Logo"
                        fill
                        className="object-contain object-left"
                      />
                    </div>
                  </div>

                  {/* Description Text */}
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">
                    Сортировка проблем по определенным категориям и генерация детального описания
                  </p>
                </div>

                {/* Right Side: Blue Pattern & Icons */}
                <div className="w-full md:w-7/12 bg-blue-500 relative min-h-[300px] md:min-h-auto overflow-hidden flex items-center justify-center p-8">

                  {/* Background Pattern Image (Optional: if you have the faint background pattern) */}
                  <Image src="/Ornament.png" fill className="object-cover opacity-100" alt="" />

                  {/* Icons Grid */}
                  <div className="relative z-10 flex flex-col gap-2 md:gap-10">

                    {/* Copy and paste this block for every icon you have (Trash, Spray, Tree, etc.) */}

                    {/* Icon 1 */}
                    <div className="flex justify-center md:justify-end gap-6 md:gap-8 lg:gap-14 
                  md:pr-8 lg:pr-12">
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-trash.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 2 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-spray.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 3 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-tree.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 4 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-end gap-6 md:gap-8 lg:gap-12 
                  md:pr-32 lg:pr-26">
                      {/* Icon 5 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 6 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 7 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center md:justify-end gap-6 md:gap-8 lg:gap-14 
                  md:pr-8 lg:pr-10">
                      {/* Icon 8 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 9 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 10 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                      {/* Icon 11 */}
                      <div className="bg-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <div className="relative w-10 h-10">
                          <Image src="/icon-bus.png" alt="Icon" fill className="object-contain" />
                        </div>
                      </div>
                    </div>
                    {/* Add more icon blocks here... */}

                  </div>
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
                    Загрузка данных...
                  </div>
                ) : (
                  <MapClient filteredReports={filteredReports} />
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
        </main>

        {/* LATEST NEWS SECTION – 5 last reports */}
        <section id="News" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
              Последние новости
            </h2>
            <p className="text-center text-lg text-slate-500 mb-12">
              Читай про изменения в городе
            </p>

            <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory scrollbar-hide">
              {reports.slice(0, 5).map((report, index) => (
                <motion.div
                  key={report.id}
                  className="snap-start flex-shrink-0 w-[280px] md:w-[320px]"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "overflow-hidden rounded-2xl shadow-lg flex flex-col h-[600px]",
                    "transition duration-200 ease-in hover:bg-blue-500 hover:text-white bg-white text-slate-900"
                  )}>
                    {report.photo_url ? (
                      <div className="relative h-48 w-full flex-shrink-0">
                        <Image
                          src={report.photo_url}
                          alt={report.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-400">
                        Photo
                      </div>
                    )}
                    <div className="p-4 flex flex-col overflow-hidden">
                      <h3 className="text-lg font-semibold mb-2 flex-shrink-0">{report.title}</h3>
                      <p className={cn(
                        "text-sm leading-relaxed overflow-y-auto",
                        "scrollbar-thin scrollbar-thumb-rounded",
                        index % 4 === 1
                          ? "scrollbar-thumb-blue-200 scrollbar-track-blue-600"
                          : "scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                      )}>
                        {report.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="About" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-12 mt-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left: Logo */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start items-center my-auto">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <img
                    src="/Logo.png"
                    alt="JARQYN"
                    className="h-12 w-auto brightness-0 invert"
                  />
                  <div className="text-center">
                    <h3 className="text-2xl font-bold tracking-wider text-nowrap">Х Digital Ertis 2025</h3>
                  </div>
                </div>
              </div>

              {/* Empty space in the middle (only on large screens) */}
              <div className="hidden lg:block lg:col-span-2"></div>

              {/* Основное — shifted right */}
              <div className="lg:col-span-3 text-center lg:text-left">
                <h4 className="font-semibold text-xl mb-5">Основное</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li><a href="#" className="hover:underline">Частые вопросы</a></li>
                  <li><a href="#" className="hover:underline">Центр поддержки</a></li>
                  <li><a href="#" className="hover:underline">Онлайн-чат с оператором</a></li>
                  <li><a href="#" className="hover:underline">Телефон горячей линии</a></li>
                  <li><a href="#" className="hover:underline">E-mail поддержки</a></li>
                </ul>
              </div>

              {/* Контакты — ещё правее */}
              <div className="lg:col-span-3 text-center lg:text-left">
                <h4 className="font-semibold text-xl mb-5">Контакты</h4>
                <ul className="space-y-2 text-sm opacity-90">
                  <li><a href="tel:+77051234567" className="hover:underline">Номера телефонов</a></li>
                  <li><a href="https://wa.link/jvs35f" className="hover:underline">Мессенджеры</a></li>
                  <li><a href="mailto:support@jarqyn.kz" className="hover:underline">Электронная почта</a></li>
                  <li className="">Адреса офисов</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}