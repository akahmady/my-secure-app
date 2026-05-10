import { supabase } from '@/utils/supabase';

// هذه تضمن أن الصفحة يتم تحديثها دائماً ولا تفشل عند البناء إذا كانت قاعدة البيانات فارغة
export const dynamic = 'force-dynamic';

export default async function Home() {
  // جلب البيانات مع معالجة الخطأ بشكل صامت للبناء
  const { data: notes, error } = await supabase.from('notes').select('*');

  if (error) {
    console.error("Supabase Error:", error);
    return <div className="p-10 text-red-500">عذراً، فشل الاتصال بقاعدة البيانات.</div>;
  }

  return (
    <main className="p-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">قائمة الملاحظات من السيرفر:</h1>
      
      <div className="grid gap-4 w-full max-w-md">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 border rounded shadow-sm bg-white text-black hover:bg-gray-50 transition-colors">
              {note.title}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">لا توجد ملاحظات حالياً.</p>
        )}
      </div>

      <hr className="my-10 w-full border-gray-200" />

      <div className="text-center">
        <h1 className="text-4xl font-bold">مشروعنا الاحترافي يبدأ من هنا</h1>
        <p className="mt-4 text-xl text-gray-600">نحن الآن في مرحلة التأسيس</p>
        <p className="mt-4 text-sm font-mono bg-gray-100 p-2 rounded"> 
          المطور: أبو كامل - 0939407555 
        </p>
      </div>
    </main>
  );
}