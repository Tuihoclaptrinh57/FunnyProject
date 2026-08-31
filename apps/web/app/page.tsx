export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-4">
      <h1 className="text-3xl font-bold">SmartTobi - smart.tobi</h1>
      <p>SuperApp Flash Sale + Live. Backend: api.smart.tobi (8080), Web: 3000</p>
      <ul className="list-disc ml-6 space-y-2">
        <li><a className="text-blue-600 underline" href="/login">/login</a> - Đăng nhập</li>
        <li><a className="text-blue-600 underline" href="/register">/register</a> - Đăng ký</li>
        <li><a className="text-blue-600 underline" href="/flash/2">/flash/2</a> - Flash Sale campaign 2 (stock 10)</li>
      </ul>
      <p className="text-sm text-gray-500">Test flow: Register -&gt; Login -&gt; Join Flash Sale</p>
    </div>
  );
}
