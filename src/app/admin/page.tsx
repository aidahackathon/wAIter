"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, MapPin, AlertTriangle, CheckCircle2, Clock, Droplets, ArrowLeft, Search, Inbox } from "lucide-react";
import Link from "next/link";

import { getIncidents, updateIncidentStatus, clearIncidents } from "@/app/actions/db";

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);

  // Авто-опрос серверной БД каждые 3 секунды (эмуляция реального времени)
  useEffect(() => {
    const fetchData = async () => {
      const data = await getIncidents();
      setIncidents(data);
    };
    
    fetchData(); // первый запрос
    const interval = setInterval(fetchData, 3000); // автообновление
    return () => clearInterval(interval);
  }, []);

  const clearData = async () => {
    if (confirm("Вы уверены, что хотите очистить все заявки?")) {
      await clearIncidents();
      setIncidents([]);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    await updateIncidentStatus(id, newStatus);
    const data = await getIncidents();
    setIncidents(data);
  };

  const newCount = incidents.filter(i => i.status === 'Новая').length;
  const inProgressCount = incidents.filter(i => i.status === 'В работе').length;
  const resolvedCount = incidents.filter(i => i.status === 'Решена').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col p-6 shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-12 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Вернуться на главную</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Дашборд</h2>
            <p className="text-xs text-slate-500 font-medium">Ремонтник (Актау)</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm border border-blue-100">
            <Droplets size={18} />
            Все заявки
          </button>
        </nav>

        <div className="mt-auto">
           <button onClick={clearData} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors">
             Очистить историю
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Заявки</h1>
            <p className="text-slate-500 text-sm mt-1">ИИ-мониторинг утечек воды</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Поиск по адресу..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm w-full md:w-64"
            />
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-2">Новых утечек</div>
            <div className="text-3xl font-bold text-slate-900">{newCount}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-2">В работе</div>
            <div className="text-3xl font-bold text-blue-600">{inProgressCount}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-500 text-sm font-medium mb-2">Устранено проблем</div>
            <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
          </div>
        </div>

        {/* Table / Empty State */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {incidents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Inbox size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Нет новых заявок</h3>
              <p className="text-slate-500 text-sm max-w-sm">Сделайте фото утечки через портал жителя, и заявка моментально появится здесь.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Фото & ID</th>
                    <th className="px-6 py-4 font-semibold">Адрес / Локация</th>
                    <th className="px-6 py-4 font-semibold">Анализ ИИ</th>
                    <th className="px-6 py-4 font-semibold">Статус</th>
                    <th className="px-6 py-4 font-semibold text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {incidents.map((inc, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={inc.id} 
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {inc.img ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={inc.img} alt="Утечка" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                              <Droplets size={20} className="text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">{inc.id}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock size={12} />
                              {inc.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 font-medium mb-1">{inc.address}</div>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${inc.lat},${inc.lng}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <MapPin size={12} />
                          Открыть на карте
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${inc.probability > 80 ? 'bg-red-500' : 'bg-orange-500'}`} />
                          <span className="text-sm font-semibold text-slate-900">{inc.probability}% вероятность</span>
                        </div>
                        <div className="text-xs text-slate-500">{inc.scale} масштаб</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          inc.status === 'Новая' ? 'bg-red-50 text-red-700 border-red-100' : 
                          inc.status === 'В работе' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-green-50 text-green-700 border-green-100'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {inc.status === 'Новая' ? (
                          <button 
                            onClick={() => updateStatus(inc.id, 'В работе')}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            Принять
                          </button>
                        ) : inc.status === 'В работе' ? (
                          <button 
                            onClick={() => updateStatus(inc.id, 'Решена')}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            Завершить
                          </button>
                        ) : (
                          <span className="text-sm font-medium text-slate-400">Готово</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
