"use client";
import { useState, useRef, useEffect } from "react";

interface Question {
  _id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  faculty: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
  createdAt?: string;
}

interface UploadStatus {
  type: 'success' | 'error' | 'info' | 'warning' | null;
  message: string;
  count?: number;
  errors?: string[];
}

export default function JsonUpload() {
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ type: null, message: '' });
  const [fileName, setFileName] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Question>>({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states
  const [facultyFilter, setFacultyFilter] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('');
  const [uniqueFaculties, setUniqueFaculties] = useState<string[]>([]);
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  
  // Bulk delete states
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load questions when on manage tab or filters change
  useEffect(() => {
    if (activeTab === 'manage') {
      loadAllQuestions();
    }
  }, [activeTab]);

  // Apply filters whenever filter criteria or questions change
  useEffect(() => {
    applyFilters();
  }, [facultyFilter, subjectFilter, allQuestions, currentPage, itemsPerPage]);

  const loadAllQuestions = async () => {
    setLoadingData(true);
    try {
      const res = await fetch(`/api/admin?type=questions&page=1&limit=10000`);
      const result = await res.json();
      if (result.success) {
        setAllQuestions(result.data);
        // Extract unique faculties and subjects
        const faculties = new Set<string>();
        const subjects = new Set<string>();
        result.data.forEach((q: Question) => {
          if (q.faculty) faculties.add(q.faculty);
          if (q.subject) subjects.add(q.subject);
        });
        setUniqueFaculties(Array.from(faculties).sort());
        setUniqueSubjects(Array.from(subjects).sort());
        setSelectedQuestions(new Set()); // Clear selections when loading new data
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allQuestions];
    
    if (facultyFilter) {
      filtered = filtered.filter(q => q.faculty === facultyFilter);
    }
    
    if (subjectFilter) {
      filtered = filtered.filter(q => q.subject === subjectFilter);
    }
    
    // Update pagination based on filtered results
    const totalFiltered = filtered.length;
    const newTotalPages = Math.ceil(totalFiltered / itemsPerPage);
    setTotalPages(newTotalPages);
    
    // Ensure current page is within bounds
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    
    // Get current page items
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setQuestions(filtered.slice(start, end));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedQuestions(new Set()); // Clear selections when changing page
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedQuestions(new Set());
  };

  const clearFilters = () => {
    setFacultyFilter('');
    setSubjectFilter('');
    setCurrentPage(1);
    setSelectedQuestions(new Set());
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  // Bulk delete functions
  const toggleSelectQuestion = (id: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedQuestions(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      const newSelected = new Set<string>();
      questions.forEach(q => {
        if (q._id) newSelected.add(q._id);
      });
      setSelectedQuestions(newSelected);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.size === 0) {
      setUploadStatus({ type: 'warning', message: 'No questions selected for deletion.' });
      return;
    }
    
    const confirmMessage = `Are you sure you want to delete ${selectedQuestions.size} question(s)? This action cannot be undone.`;
    if (!confirm(confirmMessage)) return;
    
    setIsBulkDeleting(true);
    setLoading(true);
    
    try {
      // Delete questions one by one or in batch
      const deletePromises = Array.from(selectedQuestions).map(id =>
        fetch("/api/admin", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        })
      );
      
      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every(res => res.ok);
      
      if (allSuccessful) {
        setUploadStatus({ 
          type: 'success', 
          message: `Successfully deleted ${selectedQuestions.size} question(s).`,
          count: selectedQuestions.size
        });
        setSelectedQuestions(new Set());
        await loadAllQuestions();
      } else {
        setUploadStatus({ 
          type: 'error', 
          message: 'Failed to delete some questions. Please try again.' 
        });
      }
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection.' 
      });
    } finally {
      setLoading(false);
      setIsBulkDeleting(false);
    }
  };

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

  const validateQuestion = (item: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!item.question || typeof item.question !== 'string') {
      errors.push('Missing or invalid "question" field');
    }
    if (!Array.isArray(item.options) || item.options.length !== 4) {
      errors.push('"options" must be an array of exactly 4 items');
    }
    if (typeof item.correctAnswer !== 'number' || item.correctAnswer < 0 || item.correctAnswer > 3) {
      errors.push('"correctAnswer" must be a number between 0 and 3');
    }
    if (!item.faculty || typeof item.faculty !== 'string') {
      errors.push('Missing or invalid "faculty" field');
    }
    if (!item.subject || typeof item.subject !== 'string') {
      errors.push('Missing or invalid "subject" field');
    }
    
    return { valid: errors.length === 0, errors };
  };

  const processFile = async (file: File) => {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({ 
        type: 'error', 
        message: 'File size exceeds 10MB limit. Please compress your file.' 
      });
      return;
    }

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
        message: 'Invalid JSON file format. Please check your file syntax.' 
      });
      setFileName('');
      return;
    }

    if (!Array.isArray(jsonData)) {
      setUploadStatus({ 
        type: 'error', 
        message: 'JSON must be an array of question objects' 
      });
      setFileName('');
      return;
    }

    // Validate each question
    const validationErrors: string[] = [];
    const validQuestions: any[] = [];

    jsonData.forEach((item, index) => {
      const { valid, errors } = validateQuestion(item);
      if (valid) {
        // Map the fields to match the schema
        const mappedQuestion = {
          question: item.question,
          options: item.options,
          correctAnswer: item.correctAnswer,
          faculty: item.faculty,
          subject: item.subject,
          difficulty: item.difficulty || 'medium',
          explanation: item.explanation || ''
        };
        validQuestions.push(mappedQuestion);
      } else {
        validationErrors.push(`Item ${index + 1}: ${errors.join(', ')}`);
      }
    });

    if (validQuestions.length === 0) {
      setUploadStatus({ 
        type: 'error', 
        message: 'No valid questions found in the file.',
        errors: validationErrors.slice(0, 5)
      });
      setFileName('');
      return;
    }

    // Show preview of first 3 valid items
    setPreviewData(validQuestions.slice(0, 3));
    
    if (validationErrors.length > 0) {
      setUploadStatus({ 
        type: 'warning', 
        message: `${validQuestions.length} valid items found. ${validationErrors.length} items have issues.`,
        count: validQuestions.length,
        errors: validationErrors.slice(0, 5)
      });
    } else {
      setUploadStatus({ 
        type: 'info', 
        message: `Ready to upload ${validQuestions.length} items. Click Upload to proceed.`,
        count: validQuestions.length
      });
    }

    // Store the parsed data for upload
    await handleJsonUpload(validQuestions, file.name);
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
        
        // Refresh questions list if on manage tab
        if (activeTab === 'manage') {
          await loadAllQuestions();
        }
        
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

  const handleAddSingleQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addQuestion",
          data: {
            question: "Sample Question",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            correctAnswer: 0,
            faculty: "BIT",
            subject: "Sample Subject",
            difficulty: "medium",
            explanation: "This is a sample question explanation."
          }
        })
      });

      const result = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', message: 'Sample question added successfully!' });
        await loadAllQuestions();
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Failed to add question' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setEditFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      faculty: question.faculty,
      subject: question.subject,
      difficulty: question.difficulty,
      explanation: question.explanation
    });
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion?._id) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingQuestion._id,
          data: editFormData
        })
      });

      const result = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', message: 'Question updated successfully!' });
        setEditingQuestion(null);
        await loadAllQuestions();
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Failed to update question' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      const result = await res.json();
      if (res.ok) {
        setUploadStatus({ type: 'success', message: 'Question deleted successfully!' });
        await loadAllQuestions();
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Failed to delete question' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error' });
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

  const downloadSampleJson = () => {
    const sampleData = [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        faculty: "BIT",
        subject: "Geography",
        difficulty: "easy",
        explanation: "Paris is the capital and most populous city of France."
      },
      {
        question: "Which of the following is a programming language?",
        options: ["HTML", "CSS", "JavaScript", "XML"],
        correctAnswer: 2,
        faculty: "IOE",
        subject: "Computer Science",
        difficulty: "medium",
        explanation: "JavaScript is a programming language, while HTML, CSS, and XML are markup languages."
      },
      {
        question: "What is the primary key in a database?",
        options: ["A key that uniquely identifies each record", "A key that allows null values", "A foreign key reference", "An index for sorting"],
        correctAnswer: 0,
        faculty: "BIT",
        subject: "DBMS",
        difficulty: "medium",
        explanation: "A primary key uniquely identifies each record in a database table."
      }
    ];
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_questions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'upload'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upload Questions
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'manage'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manage Questions
        </button>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk JSON Upload</h2>
              <p className="text-gray-600 mt-1">Upload questions in bulk using JSON format</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadSampleJson}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Sample
              </button>
              <button
                onClick={handleAddSingleQuestion}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Sample Question
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
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
                Supports .json files with array of question objects (max 10MB)
              </p>
            </div>
          </div>

          {/* Status Message */}
          {uploadStatus.type && (
            <div className={`mt-4 p-4 rounded-lg border ${
              uploadStatus.type === 'success' ? 'bg-green-50 border-green-200' :
              uploadStatus.type === 'error' ? 'bg-red-50 border-red-200' :
              uploadStatus.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
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
                {(uploadStatus.type === 'info' || uploadStatus.type === 'warning') && (
                  <div className={`p-1 rounded-full ${uploadStatus.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                    <svg className={`w-5 h-5 ${uploadStatus.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <p className={`font-medium ${
                    uploadStatus.type === 'success' ? 'text-green-800' :
                    uploadStatus.type === 'error' ? 'text-red-800' :
                    uploadStatus.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {uploadStatus.message}
                  </p>
                  {uploadStatus.errors && uploadStatus.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-yellow-700">Issues found:</p>
                      <ul className="text-xs text-yellow-600 mt-1 list-disc list-inside">
                        {uploadStatus.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                        Question
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{item.question}</p>
                      <div className="space-y-1">
                        {item.options?.map((opt: string, optIdx: number) => (
                          <div key={optIdx} className="flex items-center gap-2 text-xs">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              optIdx === item.correctAnswer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className={optIdx === item.correctAnswer ? 'font-medium text-green-700' : 'text-gray-600'}>
                              {opt}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>🏛️ {item.faculty}</span>
                        <span>📚 {item.subject}</span>
                        <span>⚡ {item.difficulty}</span>
                      </div>
                    </div>
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
                  <p className="text-sm font-medium text-gray-900">Required fields</p>
                  <p className="text-xs text-gray-500">question, options (array of 4), correctAnswer (0-3), faculty, subject</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Optional fields</p>
                  <p className="text-xs text-gray-500">difficulty, explanation</p>
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
        </>
      )}

      {/* Manage Questions Tab */}
      {activeTab === 'manage' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Questions</h2>
            <div className="flex gap-2">
              {selectedQuestions.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Selected ({selectedQuestions.size})
                </button>
              )}
              <button
                onClick={loadAllQuestions}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty
                </label>
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value);
                    setCurrentPage(1);
                    setSelectedQuestions(new Set());
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Faculties</option>
                  {uniqueFaculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setCurrentPage(1);
                    setSelectedQuestions(new Set());
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subjects ({uniqueSubjects.length})</option>
                  {uniqueSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            {(facultyFilter || subjectFilter) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6" />
                </svg>
                <span>Showing {questions.length} question(s)</span>
              </div>
            )}
          </div>

          {loadingData ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading questions...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {/* Items Per Page Selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.size === questions.length && questions.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Select All ({questions.length} questions)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="p-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">per page</span>
                  </div>
                </div>

                {questions.map((question) => (
                  <div key={question._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {editingQuestion?._id === question._id ? (
                      // Edit Form
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editFormData.question || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, question: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Question text"
                        />
                        {editFormData.options?.map((opt, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...(editFormData.options || [])];
                              newOptions[idx] = e.target.value;
                              setEditFormData({ ...editFormData, options: newOptions });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          />
                        ))}
                        <select
                          value={editFormData.correctAnswer || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, correctAnswer: parseInt(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {[0, 1, 2, 3].map(idx => (
                            <option key={idx} value={idx}>Correct Answer: Option {String.fromCharCode(65 + idx)}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editFormData.faculty || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, faculty: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Faculty (e.g., BIT, IOE)"
                        />
                        <input
                          type="text"
                          value={editFormData.subject || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Subject"
                        />
                        <select
                          value={editFormData.difficulty || 'medium'}
                          onChange={(e) => setEditFormData({ ...editFormData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                        <textarea
                          value={editFormData.explanation || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, explanation: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Explanation (optional)"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleUpdateQuestion}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingQuestion(null)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.has(question._id!)}
                            onChange={() => toggleSelectQuestion(question._id!)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                            <div className="space-y-1">
                              {question.options.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    idx === question.correctAnswer ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className={idx === question.correctAnswer ? 'font-medium text-green-700' : 'text-gray-600'}>
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                              <span>🏛️ {question.faculty}</span>
                              <span>📚 {question.subject}</span>
                              {question.difficulty && (
                                <span className={`px-2 py-0.5 rounded-full ${
                                  question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                  question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {question.difficulty}
                                </span>
                              )}
                              {question.explanation && (
                                <span className="text-gray-400">💡 Has explanation</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question._id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination with Page Numbers */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    {/* First Page */}
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      «
                    </button>
                    
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    {getPageNumbers().map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                    
                    {/* Last Page */}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      »
                    </button>
                  </div>
                  
                  {/* Page Info */}
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages} | Total: {allQuestions.length} questions
                    {facultyFilter || subjectFilter ? ' (filtered)' : ''}
                  </div>
                </div>
              )}

              {questions.length === 0 && !loadingData && (
                <div className="text-center py-12 text-gray-500">
                  No questions found
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-500">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}