export default async function Home() {
  // جلب البيانات من جدول notes
  const { data: notes, error } = await supabase.from('notes').select('*');

  if (error) {
    return <div>حدث خطأ أثناء جلب البيانات</div>;
  }

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">قائمة الملاحظات من السيرفر:</h1>
      <div className="grid gap-4">
        {notes?.map((note) => (
          <div key={note.id} className="p-4 border rounded shadow-sm bg-white text-black">
            {note.title}
          </div>
        ))}
        {notes?.length === 0 && <p>لا توجد ملاحظات حالياً.</p>}
      </div>
      <h1 className="text-4xl font-bold">مشروعنا الاحترافي يبدأ من هنا</h1>
      <p className="mt-4 text-xl text-gray-600">نحن الآن في مرحلة التأسيس</p>
      <p className="mt-4 text-xl text-gray-600"> ابو كامل 0939407555 </p>
    </main>
  );
}