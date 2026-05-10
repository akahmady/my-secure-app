import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: notes } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

  async function addNote(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    if (title) {
      await supabase.from('notes').insert([{ title }]);
      revalidatePath('/');
    }
  }

  return (
    // أضفنا bg-white لضمان خلفية بيضاء و min-h-screen لتغطية كامل الشاشة
    <main className="min-h-screen bg-white p-10 flex flex-col items-center font-sans text-slate-900">
      
      <h1 className="text-3xl font-bold mb-8 text-blue-700">مفكرة أبو كامل الذكية</h1>

      {/* نموذج الإضافة */}
      <form action={addNote} className="mb-10 w-full max-w-md flex gap-2">
        <input 
          type="text" 
          name="title" 
          placeholder="اكتب ملاحظة جديدة..." 
          // تلوين النص داخل الإدخال بالأسود الواضح
          className="flex-1 p-3 border border-gray-300 rounded shadow-sm text-black bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-all font-bold"
        >
          إضافة
        </button>
      </form>

      {/* قائمة الملاحظات */}
      <div className="grid gap-4 w-full max-w-md">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 border border-gray-200 border-r-4 border-r-blue-500 rounded shadow-md bg-gray-50 flex justify-between items-center">
              {/* نص الملاحظة بلون غامق جداً للوضوح */}
              <span className="text-gray-900 font-medium text-lg">{note.title}</span>
              <span className="text-xs text-gray-500 mr-2">
                {new Date(note.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 italic mt-10">لا توجد ملاحظات، ابدأ بإضافة واحدة!</p>
        )}
      </div>

      {/* تذييل الصفحة */}
      <footer className="mt-20 text-center border-t pt-5 w-full max-w-md">
        <p className="text-gray-500 text-sm">حقوق التطوير محفوظة: أبو كامل</p>
      </footer>
    </main>
  );
}