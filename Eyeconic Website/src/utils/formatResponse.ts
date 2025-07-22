// utils/formatResponse.ts
export const formatResponse = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  
  // تنظيف النص من الأحرف الزائدة
  let formatted = text
    .replace(/\\n/g, '\n')           // تحويل \n إلى سطر جديد
    .replace(/\\"/g, '"')            // تحويل \" إلى "
    .replace(/\\'/g, "'")            // تحويل \' إلى '
    .replace(/^"(.*)"$/s, '$1')      // إزالة الأقواس المحيطة
    .replace(/\\\\/g, '\\')          // تحويل \\ إلى \
    .trim();

  // التأكد من أن النص ليس فارغاً بعد التنظيف
  if (!formatted) return text;

  // تحسين التنسيق
  formatted = formatted
    .replace(/\n\s*\n\s*\n/g, '\n\n') // تقليل الأسطر الفارغة المتعددة
    .replace(/^\s+|\s+$/g, '');        // إزالة المسافات من البداية والنهاية

  return formatted;
};