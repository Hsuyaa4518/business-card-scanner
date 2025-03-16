'use client'
import UploadForm from "./components/uploadForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Business Card Scanner</h1>
      <UploadForm />
    </div>
  );
}
