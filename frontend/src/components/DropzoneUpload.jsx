import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";

export default function DropzoneUpload({ onAnalyzed, onError, onLoading }) {
  const [fileName, setFileName] = useState(null);
  const [busy, setBusy] = useState(false);

  const [file, setFile] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileName(file.name);
    setFile(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/plain": [".txt", ".log"] },
    multiple: false,
    onDrop,
  });

  const sendFile = async () => {
    if (!file) return;
    const token = localStorage.getItem("token");

    setBusy(true);
    onLoading?.(true);
    
    try {
      const fd = new FormData();
      fd.append("logFile", file);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/logs/upload`,
        fd,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (data.success === false) {
        onError?.(data.message || "Analysis failed");
      } else {
        // Include filename in the response
        onAnalyzed?.({ ...data, filename: fileName || data.filename || file.name });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || "Upload failed";
      onError?.(errorMessage);
    } finally {
      setBusy(false);
      onLoading?.(false);
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed p-6 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div
        {...getRootProps()}
        className={`cursor-pointer flex flex-col items-center justify-center py-10 transition rounded-xl
        ${isDragActive ? "bg-blue-50 dark:bg-blue-950" : ""}`}
      >
        <input {...getInputProps()} id="hidden-file-input" />
        <UploadCloud className="mb-3 opacity-80" size={36} />
        <p className="text-center text-gray-600 dark:text-gray-300">
          Drag & drop your <b>.txt</b> or <b>.log</b> file here, or click to
          browse
        </p>
        {fileName && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <FileText size={16} /> {fileName}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={sendFile}
          disabled={!file || busy}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {busy ? (
            "Analyzing..."
          ) : (
            <>
              Analyze <CheckCircle size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
