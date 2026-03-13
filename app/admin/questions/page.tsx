"use client";
import { useState, useRef } from "react";

export default function JsonUpload() {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ 
    type: 'success' | 'error' | 'info' | null; 
    message: string;
    count?: number;
  }>({ type: null, message: '' });
  const [fileName, setFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setUploadStatus({ type: null, message: '' });
    setPreviewData([]);

    const text = await file.text();
    let jsonData;

    try {
      jsonData = JSON.parse(text);
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: 'Invalid JSON file format. Please check your file.' 
      });
      setFileName('');
      return;
    }

    if (!Array.isArray(jsonData)) {
      setUploadStatus({ 
        type: 'error', 
        message: 'JSON must be an array of objects' 
      });
      setFileName('');
      return;
    }

    // Show preview of first 3 items
    setPreviewData(jsonData.slice(0, 3));
    setUploadStatus({ 
      type: 'info', 
      message: `Ready to upload ${jsonData.length} items. Click Upload to proceed.`,
      count: jsonData.length
    });

    // Store the parsed data for upload
    await handleJsonUpload(jsonData, file.name);
  };

  const handleJsonUpload = async (jsonData: any[], originalFileName: string) => {
    setLoading(true);
    setUploadStatus({ type: 'info', message: 'Uploading... Please wait.' });

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulkUpload",
          data: jsonData
        })
      });

      const result = await res.json();

      if (res.ok) {
        setUploadStatus({ 
          type: 'success', 
          message: `Successfully uploaded ${result.count} items from "${originalFileName}"`,
          count: result.count
        });
        
        // Reset preview after successful upload
        setTimeout(() => {
          setPreviewData([]);
          setFileName('');
        }, 3000);
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: result.error || "Upload failed. Please try again." 
        });
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: "Network error. Please check your connection." 
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setFileName('');
    setUploadStatus({ type: null, message: '' });
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk JSON Upload</h2>
          <p className="text-gray-600 mt-1">Upload questions in bulk using JSON format</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-xl">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={(e) => e.target.files && processFile(e.target.files[0])}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div>
            {fileName ? (
              <div className="space-y-2">
                <p className="font-medium text-gray-900">Selected File:</p>
                <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg border">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-gray-900 truncate max-w-xs">{fileName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg font-medium text-gray-900">Drag & drop your JSON file</p>
                <p className="text-gray-500 mt-1">or click to browse</p>
              </>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Supports .json files with array of question objects
          </p>
        </div>
      </div>

      {/* Status Message */}
      {uploadStatus.type && (
        <div className={`mt-4 p-4 rounded-lg border ${
          uploadStatus.type === 'success' ? 'bg-green-50 border-green-200' :
          uploadStatus.type === 'error' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            {uploadStatus.type === 'success' && (
              <div className="p-1 bg-green-100 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {uploadStatus.type === 'error' && (
              <div className="p-1 bg-red-100 rounded-full">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {uploadStatus.type === 'info' && (
              <div className="p-1 bg-blue-100 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                uploadStatus.type === 'success' ? 'text-green-800' :
                uploadStatus.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {uploadStatus.message}
              </p>
              {uploadStatus.count && (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`h-2 flex-1 rounded-full overflow-hidden ${
                    uploadStatus.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <div 
                      className={`h-full ${
                        uploadStatus.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${
                    uploadStatus.type === 'success' ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {uploadStatus.count} items
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      {previewData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Preview (First 3 items)</h3>
          <div className="space-y-3">
            {previewData.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Item {index + 1}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {typeof item}
                  </span>
                </div>
                <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requirements & Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">JSON Format Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-100 rounded">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Valid JSON array</p>
              <p className="text-xs text-gray-500">Must be an array of objects</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="p-1 bg-green-100 rounded">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Size limit</p>
              <p className="text-xs text-gray-500">Up to 10MB per file</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <p className="font-medium text-gray-900">Processing Upload</p>
                <p className="text-sm text-gray-500">This may take a moment...</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">0%</span>
          </div>
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}