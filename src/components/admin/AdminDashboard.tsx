import React, { useState } from 'react';
import {
  PlusCircle,
  ListOrdered,
  Settings,
  Database,
  Cloud,
  ArrowRight,
  Trash2,
  Edit,
  Eye,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import type { CoupleSettings, Memory } from '../../types/memory';
import { MemoryForm } from './MemoryForm';
import { SettingsForm } from './SettingsForm';
import { CloudSyncSettings } from './CloudSyncSettings';

interface AdminDashboardProps {
  memories: Memory[];
  settings: CoupleSettings;
  cloudStatus?: 'connected' | 'syncing' | 'unconfigured' | 'error';
  onSyncToCloud?: () => Promise<{ success: boolean; error?: string }>;
  onAddMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onUpdateMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemories?: () => void;
  onUpdateSettings: (newSettings: Partial<CoupleSettings>) => void;
  onResetToDefaults: () => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => { success: boolean; message: string };
  onClose: () => void;
}

type TabType = 'add' | 'list' | 'settings' | 'cloud' | 'backup';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  memories,
  settings,
  cloudStatus,
  onSyncToCloud,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onClearAllMemories,
  onUpdateSettings,
  onResetToDefaults,
  onExportData,
  onImportData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleCreateMemory = (data: Omit<Memory, 'id' | 'createdAt'>) => {
    onAddMemory(data);
    setActiveTab('list');
  };

  const handleUpdateMemory = (data: Omit<Memory, 'id' | 'createdAt'>) => {
    if (!editingMemory) return;
    onUpdateMemory({
      ...editingMemory,
      ...data,
    });
    setEditingMemory(null);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = onImportData(content);
      setImportStatus(res);
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#272021] py-8 px-4 sm:px-6 text-start">
      <div className="max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#F4DBDE]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white border border-[#F4DBDE] text-[#786C6E] hover:text-[#8C2D3E] hover:bg-[#FBECEE] transition-colors shadow-xs"
              title="العودة للخط الزمني"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-start">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-arabic text-[#272021]">
                  استوديو توثيق الذكريات
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#C2415C]/10 text-[#8C2D3E] text-xs font-semibold">
                  لوحة الإدارة
                </span>
              </div>
              <p className="text-xs text-[#786C6E] mt-0.5">
                تخصيص رحلة الحب لـ {settings.partner1} و {settings.partner2}
              </p>
            </div>
          </div>

          {/* Quick Preview CTA */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E28290]/40 text-[#8C2D3E] text-xs font-semibold hover:bg-[#FBECEE] transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-[#C2415C]" />
            <span>معاينة الخط الزمني</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-[#F4DBDE] scrollbar-none">
          <button
            onClick={() => {
              setEditingMemory(null);
              setActiveTab('list');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'list' && !editingMemory
                ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#272021]'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>جميع الذكريات ({memories.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingMemory(null);
              setActiveTab('add');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#272021]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة ذكرى جديدة</span>
          </button>

          <button
            onClick={() => {
              setEditingMemory(null);
              setActiveTab('settings');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#272021]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الشريكين والهدية</span>
          </button>

          <button
            onClick={() => {
              setEditingMemory(null);
              setActiveTab('cloud');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'cloud'
                ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#272021]'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>المزامنة السحابية (Firebase)</span>
            {cloudStatus === 'connected' && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={() => {
              setEditingMemory(null);
              setActiveTab('backup');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'backup'
                ? 'bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white shadow-xs'
                : 'bg-white/70 text-[#786C6E] hover:bg-white hover:text-[#272021]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>النسخ الاحتياطي والاستعادة</span>
          </button>
        </div>

        {/* Tab 1: Edit Modal / Overlay */}
        {editingMemory && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 mb-8 shadow-lg text-start">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F4DBDE]">
              <h3 className="text-lg font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#C2415C]" />
                <span>تعديل الذكرى: {editingMemory.title}</span>
              </h3>
              <button
                onClick={() => setEditingMemory(null)}
                className="text-xs text-[#786C6E] hover:underline"
              >
                إلغاء التعديل
              </button>
            </div>
            <MemoryForm
              initialData={editingMemory}
              onSubmit={handleUpdateMemory}
              onCancel={() => setEditingMemory(null)}
            />
          </div>
        )}

        {/* Tab 2: Add New Memory */}
        {activeTab === 'add' && !editingMemory && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 shadow-lg max-w-3xl mx-auto text-start">
            <div className="pb-4 mb-6 border-b border-[#F4DBDE]">
              <h3 className="text-xl font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#C2415C]" />
                <span>توثيق لحظة غالية جديدة</span>
              </h3>
              <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
                ارفع صورة الذكرى، اختر التاريخ، واكتب مشاعرك. ستظهر مباشرة على الخط الزمني.
              </p>
            </div>
            <MemoryForm
              onSubmit={handleCreateMemory}
              onCancel={() => setActiveTab('list')}
            />
          </div>
        )}

        {/* Tab 3: List & Manage Memories */}
        {activeTab === 'list' && !editingMemory && (
          <div className="space-y-4 text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-arabic text-[#272021]">
                محطات الخط الزمني ({memories.length})
              </h3>
              <div className="flex items-center gap-2">
                {memories.length > 0 && onClearAllMemories && (
                  <button
                    onClick={() => setIsClearingAll(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-medium transition-colors"
                    title="مسح كل الذكريات الحالية والبدء من الصفر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح كل الذكريات</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('add')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C2415C] text-white text-xs font-medium hover:bg-[#A82D45] transition-colors shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>إضافة ذكرى</span>
                </button>
              </div>
            </div>

            {memories.length === 0 ? (
              <div className="text-center py-12 px-6 rounded-3xl bg-white border border-[#F4DBDE] shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FBECEE] text-[#C2415C] flex items-center justify-center mx-auto mb-3">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold font-arabic text-[#272021]">
                  الخط الزمني فارغ حالياً
                </h4>
                <p className="text-xs text-[#786C6E] max-w-md mx-auto mt-1.5 mb-5 leading-relaxed">
                  تم مسح الذكريات بنجاح. يمكنك الآن البدء بإضافة الذكريات والمحطات الخاصة بكما لتظهر على الخط الزمني وتبقى محفوظة بشكل دائم حتى بعد إعادة تحميل الصفحة.
                </p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white text-xs font-semibold shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة أول ذكرى الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memories.map((mem, idx) => (
                  <div
                    key={mem.id}
                    className="glass-card rounded-2xl p-4 border border-[#F4DBDE] flex flex-col justify-between space-y-3 hover:border-[#E28290] transition-colors text-start"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={mem.imageUrl}
                        alt={mem.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#F4DBDE] bg-[#F4ECE1]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-[#786C6E] mb-1">
                          <span className="font-bold text-[#8C2D3E]">
                            #{idx + 1}
                          </span>
                          <span>•</span>
                          <span>{mem.date}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded bg-white text-[#272021] border border-[#F4DBDE]">
                            {mem.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold font-arabic text-[#272021] truncate">
                          <bdi dir="auto">{mem.title}</bdi>
                        </h4>
                        <p className="text-xs text-[#786C6E] line-clamp-2 mt-1 font-light leading-relaxed">
                          <bdi dir="auto">{mem.caption}</bdi>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F4DBDE]/60 text-xs">
                      <span className="text-[11px] text-[#786C6E]/70 truncate max-w-[150px]">
                        {mem.location || 'لم يتم تحديد المكان'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingMemory(mem)}
                          className="p-1.5 rounded-lg text-[#786C6E] hover:text-[#8C2D3E] hover:bg-[#FBECEE] transition-colors"
                          title="تعديل الذكرى"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(mem.id)}
                          className="p-1.5 rounded-lg text-[#786C6E] hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف الذكرى"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Clear All Confirmation Modal */}
            {isClearingAll && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-[#FFFDF9] rounded-2xl p-6 max-w-sm w-full border border-red-200 text-center shadow-xl">
                  <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <h4 className="text-base font-bold font-arabic text-[#272021]">
                    مسح جميع الذكريات؟
                  </h4>
                  <p className="text-xs text-[#786C6E] mt-1 mb-5 leading-relaxed">
                    سيتم إفراغ الخط الزمني بالكامل لتتمكن من إضافة ذكرياتكم الخاصة من البداية. يمكنك دائماً استعادة الذكريات النموذجية لاحقاً من تبويب النسخ الاحتياطي.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setIsClearingAll(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium border border-[#F4DBDE] text-[#786C6E] hover:bg-white"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        onClearAllMemories?.();
                        setIsClearingAll(false);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    >
                      نعم، امسح كل الذكريات
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                <div className="bg-[#FFFDF9] rounded-2xl p-6 max-w-sm w-full border border-red-200 text-center shadow-xl">
                  <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <h4 className="text-base font-bold font-arabic text-[#272021]">
                    هل تريد حذف هذه الذكرى؟
                  </h4>
                  <p className="text-xs text-[#786C6E] mt-1 mb-5 leading-relaxed">
                    لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من حذف هذه المحطة من الخط الزمني؟
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setDeletingId(null)}
                      className="px-4 py-2 rounded-xl text-xs font-medium border border-[#F4DBDE] text-[#786C6E] hover:bg-white"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        onDeleteMemory(deletingId);
                        setDeletingId(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    >
                      نعم، احذف الذكرى
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Settings */}
        {activeTab === 'settings' && !editingMemory && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 shadow-lg max-w-3xl mx-auto text-start">
            <div className="pb-4 mb-6 border-b border-[#F4DBDE]">
              <h3 className="text-xl font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#C2415C]" />
                <span>إعدادات الشريكين والخط الزمني</span>
              </h3>
              <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
                خصص أسماء الشريكين، موعد الذكرى السنوية للعداد، نص رسالة الحب، ورمز PIN السري.
              </p>
            </div>
            <SettingsForm settings={settings} onSave={onUpdateSettings} />
          </div>
        )}

        {/* Tab 5: Cloud Database Sync */}
        {activeTab === 'cloud' && !editingMemory && (
          <CloudSyncSettings
            cloudStatus={cloudStatus || 'unconfigured'}
            onSyncNow={onSyncToCloud || (async () => ({ success: true }))}
          />
        )}

        {/* Tab 6: Backup & Restore */}
        {activeTab === 'backup' && !editingMemory && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 shadow-lg max-w-2xl mx-auto space-y-6 text-start">
            <div className="pb-4 border-b border-[#F4DBDE]">
              <h3 className="text-xl font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C2415C]" />
                <span>النسخ الاحتياطي وحفظ البيانات</span>
              </h3>
              <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
                حمّل ملف JSON يحتوي على جميع ذكرياتكم وإعداداتكم، أو استرجعها من ملف سابق.
              </p>
            </div>

            {importStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  importStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {importStatus.message}
              </div>
            )}

            {/* Export */}
            <div className="p-4 rounded-2xl bg-white border border-[#F4DBDE] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#272021]">
                  تصدير نسخة احتياطية من الذكريات
                </h4>
                <p className="text-xs text-[#786C6E] mt-0.5">
                  حفظ جميع الـ {memories.length} ذكريات والإعدادات المخصصة في ملف `.json` آمن.
                </p>
              </div>
              <button
                onClick={onExportData}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C2415C] text-white text-xs font-medium hover:bg-[#A82D45] transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>تصدير JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-2xl bg-white border border-[#F4DBDE] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#272021]">
                  استعادة من نسخة احتياطية
                </h4>
                <p className="text-xs text-[#786C6E] mt-0.5">
                  استرجاع الذكريات من ملف `.json` سابق.
                </p>
              </div>
              <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#F4DBDE] text-[#272021] text-xs font-medium hover:bg-[#FBECEE] cursor-pointer transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-[#C2415C]" />
                <span>استيراد ملف</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset to Curated Sample */}
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-[#8C2D3E]">
                  إعادة التعيين للذكريات النموذجية
                </h4>
                <p className="text-xs text-[#786C6E] mt-0.5">
                  الرجوع للذكريات الأولية والإعدادات الافتراضية.
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'هل أنت متأكد من إعادة تعيين جميع الذكريات والإعدادات للبيانات النموذجية الافتراضية؟'
                    )
                  ) {
                    onResetToDefaults();
                    alert('تمت استعادة الذكريات النموذجية بنجاح.');
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-800 text-xs font-medium hover:bg-rose-100 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#C2415C]" />
                <span>استعادة البيانات</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
