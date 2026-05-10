import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: notes } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

  // 1. دالة الإضافة
  async function addNote(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    if (title) {
      await supabase.from('notes').insert([{ title }]);
      revalidatePath('/');
    }
  }

  // 2. دالة الحذف
  async function deleteNote(formData: FormData) {
    'use server';
    const id = formData.get('id');
    await supabase.from('notes').delete().match({ id });
    revalidatePath('/');
  }

  // 3. دالة التعديل (سنقوم بتغيير النص إلى نص ثابت كمثال أو يمكن تطويره)
  async function updateNote(formData: FormData) {
    'use server';
    const id = formData.get('id');
    const newTitle = formData.get('newTitle') as string;
    if (newTitle) {
      await supabase.from('notes').update({ title: newTitle }).match({ id });
      revalidatePath('/');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-5 md:p-10 flex flex-col items-center text-slate-900">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">لوحة تحكم أبو كامل</h1>

      {/* نموذج الإضافة */}
      <form action={addNote} className="mb-10 w-full max-w-md flex gap-2">
        <input 
          type="text" name="title" placeholder="أضف ملاحظة جديدة..." 
          className="flex-1 p-3 border rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 font-bold">إضافة</button>
      </form>

      {/* عرض الملاحظات */}
      <div className="grid gap-4 w-full max-w-md">
        {notes?.map((note) => (
          <div key={note.id} className="p-4 border rounded-lg shadow bg-white flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">{note.title}</span>
              <span className="text-[10px] text-gray-400">{new Date(note.created_at).toLocaleDateString('ar-EG')}</span>
            </div>

            <div className="flex gap-2 justify-end">
              {/* نموذج التعديل البسيط */}
              <form action={updateNote} className="flex gap-1">
                <input type="hidden" name="id" value={note.id} />
                <input 
                  type="text" name="newTitle" placeholder="نص جديد" 
                  className="text-xs p-1 border rounded w-24 bg-gray-50"
                />
                <button type="submit" className="text-xs bg-green-500 text-white px-2 py-1 rounded">تعديل</button>
              </form>

              {/* نموذج الحذف */}
              <form action={deleteNote}>
                <input type="hidden" name="id" value={note.id} />
                <button type="submit" className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">حذف</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}