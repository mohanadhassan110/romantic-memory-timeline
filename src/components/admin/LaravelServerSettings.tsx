import React, { useState } from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw, Globe, Terminal, Copy, Check } from 'lucide-react';
import {
  getLaravelApiUrl,
  saveLaravelApiUrl,
  resetLaravelApiUrl,
  checkLaravelHealth,
} from '../../services/laravelApi';

interface LaravelServerSettingsProps {
  isBackendConnected: boolean;
  onRefreshFromBackend: () => Promise<void>;
}

export const LaravelServerSettings: React.FC<LaravelServerSettingsProps> = ({
  isBackendConnected,
  onRefreshFromBackend,
}) => {
  const [apiUrl, setApiUrl] = useState(() => getLaravelApiUrl());
  const [isChecking, setIsChecking] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const commandToRun = 'cd backend; php artisan serve --host=0.0.0.0 --port=8000';

  const handleTestConnection = async (urlToTest = apiUrl) => {
    setIsChecking(true);
    setFeedback(null);
    saveLaravelApiUrl(urlToTest);

    const isAlive = await checkLaravelHealth();
    setIsChecking(false);

    if (isAlive) {
      setFeedback({
        type: 'success',
        text: 'تم الاتصال بسيرفر Laravel وقاعدة البيانات بنجاح! يتم الآن حفظ واسترجاع الذكريات من السيرفر مباشرة.',
      });
      await onRefreshFromBackend();
    } else {
      setFeedback({
        type: 'error',
        text: `تعذر الوصول إلى سيرفر Laravel عبر (${urlToTest}). تأكد من تشغيل أمر php artisan serve في مجلد backend.`,
      });
    }
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(commandToRun);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const handleResetDefault = () => {
    resetLaravelApiUrl();
    const def = getLaravelApiUrl();
    setApiUrl(def);
    handleTestConnection(def);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 shadow-lg max-w-3xl mx-auto space-y-6 text-start">
      <div className="pb-4 border-b border-[#F4DBDE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
            <Server className="w-5 h-5 text-[#C2415C]" />
            <span>خادم وقاعدة بيانات Laravel (PHP Backend)</span>
          </h3>
          <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
            تم بناء الباك اند بالكامل بـ <b>PHP Laravel 12</b> مع قاعدة بيانات SQLite جاهزة وسريعة، ونقاط اتصال REST API.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="shrink-0">
          {isBackendConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>متصل بخادم Laravel 🟢</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>غير متصل (يعمل محلياً) ⚪</span>
            </span>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Quick Run Instructions */}
      <div className="p-4 rounded-2xl bg-[#1E1B18] text-white border border-[#3E3430] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#E28290]">
            <Terminal className="w-4 h-4" />
            <span>أمر تشغيل سيرفر Laravel المحلي:</span>
          </div>
          <button
            type="button"
            onClick={handleCopyCmd}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCmd ? 'تم النسخ!' : 'نسخ الأمر'}</span>
          </button>
        </div>
        <pre className="p-3 rounded-xl bg-black/50 text-[#50FA7B] font-mono text-xs overflow-x-auto text-start dir-ltr">
          {commandToRun}
        </pre>
        <p className="text-[11px] text-white/70 leading-relaxed">
          * تلميح: تشغيل السيرفر مع <code>--host=0.0.0.0</code> يسمح لك بفتح الرابط من الموبايل المتصل بنفس شبكة الـ Wi-Fi عبر كتابة IP جهاز الكمبيوتر (مثال: <code>http://192.168.1.15:8000/api</code>).
        </p>
      </div>

      {/* Config Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1.5">
            رابط الـ API لسيرفر Laravel (API Base URL)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-mono"
            />
          </div>
          <span className="text-[11px] text-[#786C6E] block mt-1">
            الافتراضي لجهازك هو <code>http://localhost:8000/api</code>، أو يمكنك وضع رابط السيرفر المرفوع أونلاين.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F4DBDE]">
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs text-[#786C6E] hover:underline"
          >
            إعادة تعيين للرابط الافتراضي
          </button>

          <button
            type="button"
            disabled={isChecking}
            onClick={() => handleTestConnection()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white text-xs font-semibold shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري اختبار الاتصال...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>فحص الاتصال وتحديث الذكريات الآن</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
