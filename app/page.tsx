import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: notes } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

  // هذه هي الـ Server Action: دالة تعمل على السيرفر مباشرة
  async function addNote(formData: FormData) {
    'use server'; // أمر سحري يخبر نكست أن هذا الكود لا يراه المتصفح
    const title = formData.get('title') as string;
    
    if (title) {
      await supabase.from('notes').insert([{ title }]);
      revalidatePath('/'); // إعادة تحديث الصفحة فوراً لإظهار الملاحظة الجديدة
    }
  }

  return (
    <main className="p-10 flex flex-col items-center font-sans">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">مفكرة أبو كامل الذكية</h1>

      {/* نموذج إضافة ملاحظة */}
      <form action={addNote} className="mb-10 w-full max-w-md flex gap-2">
        <input 
          type="text" 
          name="title" 
          placeholder="اكتب ملاحظة جديدة..." 
          className="flex-1 p-3 border rounded shadow-inner text-black outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors shadow-lg"
        >
          إضافة
        </button>
      </form>

      <div className="grid gap-4 w-full max-w-md">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 border-r-4 border-blue-500 rounded shadow bg-white text-black flex justify-between items-center">
              <span>{note.title}</span>
              <span className="text-xs text-gray-400">
                {new Date(note.created_at).toLocaleTimeString('ar-EG')}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 italic">لا توجد ملاحظات، ابدأ بإضافة واحدة!</p>
        )}
      </div>
    </main>
  );
}