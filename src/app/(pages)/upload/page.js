"use client";
import { useRouter } from "next/navigation";
import { saveFileToIndexedDB } from "@/lib/indexeddb";

export default function UploadPage() {
  const router = useRouter();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await saveFileToIndexedDB("current-pdf", file);
      router.push("/viewer");
    }
  };

  return (
    <main style={{ padding: 240 }}>
      <h1>Загрузка PDF</h1>
      <input type="file" accept="application/pdf" onChange={handleChange} />
    </main>
  );
}
