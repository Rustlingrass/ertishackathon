// app/admin/page.tsx
'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Trash2, Edit, Search, AlertTriangle, Clock, CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner'; // или просто alert(), если не используешь sonner

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

// const API_BASE = 'http://localhost:8000/api/admin/reports';
const API_BASE = 'http://localhost:3001/reports';

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
        status: '',      // ← оставляем как строку
        priority: '',
        category: '',
        search: ''
    });
    const [editingReport, setEditingReport] = useState<Report | null>(null);

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
            setReports(data);
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
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10 text-orange-600">
                    Админ-панель JARQYN
                </h1>

                {/* Фильтры */}
                <Card className="p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Поиск по описанию..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="pl-10"
                            />
                        </div>
                        {/* Фильтр по статусу */}
                        <Select value={filters.status || undefined} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v || "" }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined as any}>Все статусы</SelectItem>
                                <SelectItem value="received">Получено</SelectItem>
                                <SelectItem value="in_process">В работе</SelectItem>
                                <SelectItem value="done">Выполнено</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Фильтр по приоритету */}
                        <Select value={filters.priority || undefined} onValueChange={(v) => setFilters(prev => ({ ...prev, priority: v || "" }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined as any}>Любой приоритет</SelectItem>
                                <SelectItem value="critical">Критический</SelectItem>
                                <SelectItem value="high">Высокий</SelectItem>
                                <SelectItem value="medium">Средний</SelectItem>
                                <SelectItem value="low">Низкий</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Фильтр по категории */}
                        <Select value={filters.category || undefined} onValueChange={(v) => setFilters(prev => ({ ...prev, category: v || "" }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined as any}>Все категории</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </Card>

                {/* Список заявок */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Загрузка...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reports.map((report) => (
                            <Card key={report.id} className="overflow-hidden hover:shadow-xl transition">
                                {report.image_url && (
                                    <div className="relative h-48">
                                        <Image
                                            // src={`http://localhost:8000${report.image_url}`}
                                            src={`/images.jpg`}
                                            alt="Фото"
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "/images.jpg"; // запасная картинка
                                                e.currentTarget.classList.add("opacity-100");
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className={priorityConfig[report.priority].color}>
                                            {priorityConfig[report.priority].label}
                                        </Badge>
                                        <div className="flex gap-2">
                                            {/* Кнопка редактирования — открывает модалку */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="hover:bg-orange-100">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>

                                                <DialogContent className="sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-semibold">
                                                            Редактирование заявки #{report.id}
                                                        </DialogTitle>
                                                        <DialogDescription className="text-gray-600">
                                                            Измените статус, приоритет или описание проблемы
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="space-y-6 pt-4">
                                                        {/* Фото (если есть) */}
                                                        {report.image_url && (
                                                            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                                                                <img
                                                                    src={`http://localhost:8000${report.image_url}`}
                                                                    alt="Фото"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Категория — только для просмотра */}
                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-700">Категория</Label>
                                                            <p className="mt-mt-1 text-base">
                                                                {categories.find(c => c.value === report.category)?.label || 'Другое'}
                                                            </p>
                                                        </div>

                                                        {/* Статус */}
                                                        <div>
                                                            <Label htmlFor="status" className="text-sm font-medium">
                                                                Статус заявки
                                                            </Label>
                                                            <Select
                                                                value={report.status}
                                                                onValueChange={(value) => updateReport(report.id, { status: value as 'received' | 'in_process' | 'done' })}
                                                            >
                                                                <SelectTrigger id="status" className="mt-2">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
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

                                                        {/* Приоритет */}
                                                        <div>
                                                            <Label htmlFor="priority" className="text-sm font-medium">
                                                                Приоритет
                                                            </Label>
                                                            <Select
                                                                value={report.priority}
                                                                onValueChange={(value) => updateReport(report.id, { priority: value as 'low' | 'medium' | 'high' | 'critical' })}
                                                            >
                                                                <SelectTrigger id="priority" className="mt-2">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
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
                                                                            Критический
                                                                        </span>
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {/* Описание — редактируемое */}
                                                        <div>
                                                            <Label htmlFor="description" className="text-sm font-medium">
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
                                                                className="mt-2 min-h-32 resize-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <DialogFooter className="mt-6">
                                                        <DialogClose asChild>
                                                            <Button variant="outline">
                                                                Закрыть
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                size="icon"
                                                variant="destructive"
                                                onClick={() => deleteReport(report.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">
                                        {categories.find(c => c.value === report.category)?.label || report.category}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                        {report.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2">
                                            {React.createElement(statusConfig[report.status].icon, { className: `w-5 h-5 ${statusConfig[report.status].color}` })}
                                            {statusConfig[report.status].label}
                                        </span>
                                        <span className="text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString('ru-KZ')}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {reports.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500 text-xl">
                        Заявок не найдено
                    </div>
                )}
            </div>
        </div>
    );
}