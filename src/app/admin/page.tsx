'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Search, Clock, CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

type Report = {
    id: number;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'received' | 'in_process' | 'done';
    latitude?: number;
    longitude?: number;
    image_url?: string;
    created_at: string;
};

const API_BASE = 'http://localhost:3001/reports'; // Твой текущий URL

const priorityConfig = {
    critical: { label: 'Критический', color: 'bg-red-700 text-white animate-pulse' },
    high: { label: 'Высокий', color: 'bg-red-600 text-white' },
    medium: { label: 'Средний', color: 'bg-orange-500 text-white' },
    low: { label: 'Низкий', color: 'bg-green-600 text-white' },
};

const statusConfig = {
    received: { label: 'Получено', icon: Circle, color: 'text-blue-600' },
    in_process: { label: 'В работе', icon: Clock, color: 'text-yellow-600' },
    done: { label: 'Выполнено', icon: CheckCircle, color: 'text-green-600' },
};

const categories = [
    { value: 'ROAD_DEFECTS', label: 'Дефекты дорог и тротуаров' },
    { value: 'LIGHTING', label: 'Неисправное уличное освещение' },
    { value: 'PLAYGROUNDS', label: 'Детские и спортивные площадки' },
    { value: 'WASTE', label: 'Мусор и отходы' },
    { value: 'ANIMALS', label: 'Бездомные или мертвые животные' },
    { value: 'TREES', label: 'Аварийные деревья' },
    { value: 'OPEN_MANHOLES', label: 'Открытые люки и ливнёвки' },
    { value: 'VANDALISM', label: 'Вандализм и граффити' },
    { value: 'ILLEGAL_TRADE', label: 'Незаконная торговля и реклама' },
    { value: 'SNOW_ICE', label: 'Сосульки, снег и наледь' },
    { value: 'ECOLOGY', label: 'Экологические проблемы' },
    { value: 'PUBLIC_TRANSPORT', label: 'Общественный транспорт' },
    { value: 'BIKE_SCOOTER', label: 'Велодорожки и самокаты' },
    { value: 'PUBLIC_TOILETS', label: 'Общественные туалеты' },
    { value: 'PARKING', label: 'Незаконная парковка' },
    { value: 'OTHER', label: 'Другое' },
];

export default function AdminPanel() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: ''
    });

    const fetchReports = async () => {
        setLoading(true);
        try {
            let url = API_BASE;
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status.toUpperCase());
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category) params.append('category', filters.category);
            if (filters.search) params.append('search', filters.search);

            if ([...params].length > 0) url += `?${params}`;

            const res = await fetch(url);
            const data = await res.json();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error('Ошибка загрузки заявок');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [filters]);

    const updateReport = async (id: number, updates: Partial<Report>) => {
        try {
            await fetch(`${API_BASE}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            toast.success('Заявка обновлена');
            fetchReports();
        } catch {
            toast.error('Ошибка обновления');
        }
    };

    const deleteReport = async (id: number) => {
        if (!confirm('Удалить заявку навсегда?')) return;
        try {
            await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            toast.success('Заявка удалена');
            fetchReports();
        } catch {
            toast.error('Ошибка удаления');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E3E3E3] to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-12 text-[#3080D1] tracking-wide drop-shadow-md">
                    Админ-панель JARQYN
                </h1>

                {/* Фильтры: улучшенный дизайн с мягким градиентом, большим отступом и анимацией hover */}
                <Card className="p-6 mb-10 bg-white/95 backdrop-blur-sm border border-[#E3E3E3] rounded-2xl shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/4 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input
                                placeholder="Поиск по описанию..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="pl-10 py-3 bg-[#E3E3E3]/50 border border-[#E3E3E3] rounded-lg focus:border-[#3080D1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200"
                            />
                        </div>

                        {/* Фильтр по статусу */}
                        <div>
                            <Label className="block text-sm font-medium text-[#000000] mb-2">Статус</Label>
                            <Select value={filters.status} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v || "" }))}>
                                <SelectTrigger className="py-3 bg-white border border-[#E3E3E3] rounded-lg hover:border-[#7EADD1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200">
                                    <SelectValue placeholder="Все статусы" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-[#E3E3E3] shadow-xl rounded-lg">
                                    <SelectItem value="received">
                                        <div className="flex items-center gap-2">
                                            <Circle className="w-4 h-4 text-blue-600" />
                                            Получено
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="in_process">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-yellow-600" />
                                            В работе
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="done">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            Выполнено
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Аналогично для приоритета */}
                        <div>
                            <Label className="block text-sm font-medium text-[#000000] mb-2">Приоритет</Label>
                            <Select value={filters.priority} onValueChange={(v) => setFilters(prev => ({ ...prev, priority: v || "" }))}>
                                <SelectTrigger className="py-3 bg-white border border-[#E3E3E3] rounded-lg hover:border-[#7EADD1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200">
                                    <SelectValue placeholder="Любой приоритет" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-[#E3E3E3] shadow-xl rounded-lg">
                                    <SelectItem value="critical">Критический</SelectItem>
                                    <SelectItem value="high">Высокий</SelectItem>
                                    <SelectItem value="medium">Средний</SelectItem>
                                    <SelectItem value="low">Низкий</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* И для категории */}
                        <div>
                            <Label className="block text-sm font-medium text-[#000000] mb-2">Категория</Label>
                            <Select value={filters.category} onValueChange={(v) => setFilters(prev => ({ ...prev, category: v || "" }))}>
                                <SelectTrigger className="py-3 bg-white border border-[#E3E3E3] rounded-lg hover:border-[#7EADD1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200">
                                    <SelectValue placeholder="Все категории" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-[#E3E3E3] shadow-xl rounded-lg max-h-60 overflow-y-auto">
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Список заявок: улучшенная сетка с анимацией появления */}
                {loading ? (
                    <div className="text-center py-24 text-[#000000] font-medium">Загрузка заявок...</div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {reports.map((report) => (
                            <Card key={report.id} className="overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white border border-[#E3E3E3] rounded-2xl">
                                {report.image_url ? (
                                    <div className="relative h-56 bg-[#E3E3E3]">
                                        <img
                                            src={`http://localhost:3001${report.image_url}`}
                                            alt="Фото"
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            onError={(e) => {
                                                e.currentTarget.src = "/images.jpg";
                                                e.currentTarget.classList.add("opacity-50");
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-56 bg-gradient-to-br from-[#E3E3E3] to-white border-b border-[#E3E3E3] flex items-center justify-center text-gray-500 font-medium">
                                        Нет фото
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className={`${priorityConfig[report.priority].color} px-3 py-1 rounded-full text-sm font-medium`}>
                                            {priorityConfig[report.priority].label}
                                        </Badge>
                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="hover:bg-[#7EADD1]/10 hover:text-[#3080D1] transition-colors">
                                                        <Edit className="w-5 h-5" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-md border border-[#E3E3E3] rounded-2xl shadow-2xl p-8">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-2xl font-bold text-[#000000]">
                                                            Редактирование заявки #{report.id}
                                                        </DialogTitle>
                                                        <DialogDescription className="text-gray-600 mt-2">
                                                            Измените статус, приоритет или описание проблемы
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-8 pt-6">
                                                        {report.image_url && (
                                                            <div className="relative h-64 rounded-xl overflow-hidden bg-[#E3E3E3] border border-[#E3E3E3] shadow-sm">
                                                                <img
                                                                    src={`http://localhost:3001${report.image_url}`}
                                                                    alt="Фото"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <Label className="block text-sm font-medium text-[#000000] mb-2">Категория</Label>
                                                            <p className="text-base text-[#000000] bg-[#E3E3E3] p-3 rounded-lg border border-[#E3E3E3]">
                                                                {categories.find(c => c.value === report.category)?.label || 'Другое'}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="status" className="block text-sm font-medium text-[#000000] mb-2">
                                                                Статус заявки
                                                            </Label>
                                                            <Select
                                                                value={report.status}
                                                                onValueChange={(value) => updateReport(report.id, { status: value as 'received' | 'in_process' | 'done' })}
                                                            >
                                                                <SelectTrigger id="status" className="py-3 bg-white border border-[#E3E3E3] rounded-lg focus:border-[#3080D1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-white border border-[#E3E3E3] shadow-xl rounded-lg">
                                                                    <SelectItem value="received">
                                                                        <div className="flex items-center gap-2">
                                                                            <Circle className="w-4 h-4 text-blue-600" />
                                                                            Получено
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="in_process">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-4 h-4 text-yellow-600" />
                                                                            В работе
                                                                        </div>
                                                                    </SelectItem>
                                                                    <SelectItem value="done">
                                                                        <div className="flex items-center gap-2">
                                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                                            Выполнено
                                                                        </div>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="priority" className="block text-sm font-medium text-[#000000] mb-2">
                                                                Приоритет
                                                            </Label>
                                                            <Select
                                                                value={report.priority}
                                                                onValueChange={(value) => updateReport(report.id, { priority: value as 'low' | 'medium' | 'high' | 'critical' })}
                                                            >
                                                                <SelectTrigger id="priority" className="py-3 bg-white border border-[#E3E3E3] rounded-lg focus:border-[#3080D1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-white border border-[#E3E3E3] shadow-xl rounded-lg">
                                                                    <SelectItem value="low">
                                                                        <span className="flex items-center gap-2">
                                                                            <div className="w-3 h-3 rounded-full bg-green-600" />
                                                                            Низкий
                                                                        </span>
                                                                    </SelectItem>
                                                                    <SelectItem value="medium">
                                                                        <span className="flex items-center gap-2">
                                                                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                                                                            Средний
                                                                        </span>
                                                                    </SelectItem>
                                                                    <SelectItem value="high">
                                                                        <span className="flex items-center gap-2">
                                                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                                                            Высокий
                                                                        </span>
                                                                    </SelectItem>
                                                                    <SelectItem value="critical">
                                                                        <span className="flex items-center gap-2 font-bold text-red-700">
                                                                            <div className="w-3 h-3 rounded-full bg-red-700" />
                                                                            Критический
                                                                        </span>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="description" className="block text-sm font-medium text-[#000000] mb-2">
                                                                Описание проблемы
                                                            </Label>
                                                            <Textarea
                                                                id="description"
                                                                defaultValue={report.description}
                                                                onBlur={(e) => {
                                                                    if (e.target.value !== report.description) {
                                                                        updateReport(report.id, { description: e.target.value });
                                                                    }
                                                                }}
                                                                placeholder="Добавьте комментарий или уточнение..."
                                                                className="min-h-40 resize-y bg-white border border-[#E3E3E3] rounded-lg focus:border-[#3080D1] focus:ring-2 focus:ring-[#7EADD1] transition-all duration-200"
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogClose asChild>
                                                        <Button variant="outline" className="mt-8 w-full py-3 text-[#3080D1] border-[#7EADD1] hover:bg-[#7EADD1]/10 transition-colors">
                                                            Закрыть
                                                        </Button>
                                                    </DialogClose>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                onClick={() => deleteReport(report.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-xl mb-3 text-[#000000]">
                                        {categories.find(c => c.value === report.category)?.label || report.category}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                                        {report.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-[#000000]">
                                        <span className="flex items-center gap-2 font-medium">
                                            {React.createElement(statusConfig[report.status].icon, { className: `w-5 h-5 ${statusConfig[report.status].color}` })}
                                            {statusConfig[report.status].label}
                                        </span>
                                        <span className="text-gray-500 italic">
                                            {new Date(report.created_at).toLocaleDateString('ru-KZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {reports.length === 0 && !loading && (
                    <div className="text-center py-24 text-[#000000] text-xl font-medium">
                        Заявок не найдено
                    </div>
                )}
            </div>
        </div>
    );
}