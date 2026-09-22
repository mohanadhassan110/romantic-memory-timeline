import React, { useState } from 'react';
import { Cloud, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Key, Database, Sparkles } from 'lucide-react';
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  type FirebaseOptions,
} from '../../services/firebase';

interface CloudSyncSettingsProps {
  cloudStatus: 'connected' | 'syncing' | 'unconfigured' | 'error';
  onSyncNow: () => Promise<{ success: boolean; error?: string }>;
}

export const CloudSyncSettings: React.FC<CloudSyncSettingsProps> = ({
  cloudStatus,
  onSyncNow,
}) => {
  const existingConfig = getStoredFirebaseConfig();
  const [apiKey, setApiKey] = useState(() => existingConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(() => existingConfig?.projectId || '');
  const [appId, setAppId] = useState(() => existingConfig?.appId || '');
  const [rawSnippet, setRawSnippet] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleParseSnippet = (text: string) => {
    setRawSnippet(text);
    try {
      // Extract apiKey, projectId, appId from snippet if user pasted the JS object
      const apiKeyMatch = text.match(/apiKey:\s*["']([^"']+)["']/);
      const projectIdMatch = text.match(/projectId:\s*["']([^"']+)["']/);
      const appIdMatch = text.match(/appId:\s*["']([^"']+)["']/);

      if (apiKeyMatch) setApiKey(apiKeyMatch[1]);
      if (projectIdMatch) setProjectId(projectIdMatch[1]);
      if (appIdMatch) setAppId(appIdMatch[1]);
    } catch {
      // ignore
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: 'يرجى إدخال كل من API Key و Project ID على الأقل.',
      });
      return;
    }

    setIsProcessing(true);
    setFeedbackMessage(null);

    const config: FirebaseOptions = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: `${projectId.trim()}.firebaseapp.com`,
      storageBucket: `${projectId.trim()}.appspot.com`,
      appId: appId.trim() || '1:123456789:web:abcdef',
    };

    saveFirebaseConfig(config);

    // Trigger sync
    const res = await onSyncNow();
    setIsProcessing(false);

    if (res.success) {
      setFeedbackMessage({
        type: 'success',
        text: 'تم حفظ الاتصال بنجاح ومزامنة الذكريات في السحاب! أي جهاز يفتح الرابط الآن سيرى ذكرياتكم فوراً.',
      });
    } else {
      setFeedbackMessage({
        type: 'error',
        text: `تم حفظ الإعدادات ولكن تعذر الاتصال بـ Firestore: ${res.error}. تأكد من إنشاء قاعدة بيانات Firestore في وضع Test Mode داخل Firebase Console.`,
      });
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('هل تريد قطع الاتصال بقاعدة بيانات السحاب؟ سيعمل التطبيق على التخزين المحلي فقط.')) {
      clearFirebaseConfig();
      setApiKey('');
      setProjectId('');
      setAppId('');
      setRawSnippet('');
      setFeedbackMessage({
        type: 'success',
        text: 'تم قطع الاتصال بقاعدة البيانات السحابية.',
      });
      window.location.reload();
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E28290]/40 shadow-lg max-w-3xl mx-auto space-y-6 text-start">
      <div className="pb-4 border-b border-[#F4DBDE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold font-arabic text-[#8C2D3E] flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#C2415C]" />
            <span>قاعدة البيانات والمزامنة السحابية (Firebase)</span>
          </h3>
          <p className="text-xs text-[#786C6E] mt-1 leading-relaxed">
            ربط المشروع بقاعدة بيانات سحابية مركزية لمزامنة الذكريات تلقائياً ولحظياً بين الموبايل، واللابتوب، وبطاقة NFC.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="shrink-0">
          {cloudStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>متصل ومزامن سحابياً</span>
            </span>
          )}
          {cloudStatus === 'syncing' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
              <span>جاري المزامنة...</span>
            </span>
          )}
          {cloudStatus === 'unconfigured' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
              <Database className="w-4 h-4 text-slate-500" />
              <span>تخزين محلي فقط (غير مربوط)</span>
            </span>
          )}
          {cloudStatus === 'error' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>خطأ في الاتصال</span>
            </span>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      {/* Guide Banner */}
      <div className="p-4 rounded-2xl bg-[#FFFBF0] border border-[#F6E3B4] text-xs text-[#7A5A17] space-y-2">
        <div className="flex items-center gap-2 font-bold text-[#8C6D1F]">
          <Sparkles className="w-4 h-4" />
          <span>كيف تحصل على إعدادات Firebase مجاناً خلال دقيقة واحدة؟</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pe-1">
          <li>
            افتح{' '}
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline inline-flex items-center gap-0.5 text-[#C2415C]"
            >
              Firebase Console <ExternalLink className="w-3 h-3" />
            </a>{' '}
            وأنشئ مشروعاً جديداً مجاناً.
          </li>
          <li>
            من القائمة الجانبية اختر <b>Firestore Database</b> ثم اضغط <b>Create Database</b> واختر وضع <b>Start in test mode</b>.
          </li>
          <li>
            اضغط على أيقونة الإعدادات ⚙️ ⬅️ <b>Project settings</b> ⬅️ بالأسفل اضغط على رمز الويب <b>&lt;/&gt;</b> لإنشاء تطبيق ويب وانسخ كود <b>firebaseConfig</b> والصقه في الحقل أدناه.
          </li>
        </ol>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Quick Paste Snippet */}
        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1.5">
            لصق سريع لكود firebaseConfig (اختياري)
          </label>
          <textarea
            rows={3}
            placeholder="const firebaseConfig = { apiKey: '...', projectId: '...', ... };"
            value={rawSnippet}
            onChange={(e) => handleParseSnippet(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start"
          />
          <span className="text-[11px] text-[#786C6E] block mt-1">
            سيتم استخراج المفاتيح وتعبئتها في الحقول أدناه تلقائياً بمجرد اللصق.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1.5">
              API Key *
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#272021] mb-1.5">
              Project ID *
            </label>
            <div className="relative">
              <Database className="w-4 h-4 text-[#786C6E]/60 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="my-romantic-story"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full ps-10 pe-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#272021] mb-1.5">
            App ID (اختياري)
          </label>
          <input
            type="text"
            placeholder="1:123456789:web:abcdef"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#F4DBDE] text-[#272021] focus:outline-none focus:border-[#C2415C] text-start font-mono"
          />
        </div>

        {/* Submit and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#F4DBDE]">
          {cloudStatus === 'connected' ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="px-4 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              قطع الاتصال بالسحاب
            </button>
          ) : (
            <div />
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C2415C] to-[#E28290] text-white text-xs font-semibold shadow-md hover:from-[#A82D45] hover:to-[#C2415C] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري حفظ الاتصال والمزامنة...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>حفظ الاتصال ومزامنة الذكريات الآن</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
