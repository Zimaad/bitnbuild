'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, FileText, Upload, Download, Eye, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';

export default function ReportsPage() {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    description: '',
  });

  useEffect(() => {
    const loadReports = async () => {
      if (!userProfile) return;
      
      try {
        setLoading(true);
        const userReports = await userService.getUserMedicalReports(userProfile.uid);
        setReports(userReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        toast.error('Failed to load medical reports');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [userProfile]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) {
      toast.error('User not authenticated');
      return;
    }

    if (!uploadData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      
      const uploadedReport = await userService.uploadMedicalReport(
        userProfile.uid,
        uploadData.file,
        uploadData.description
      );
      
      setReports(prev => [uploadedReport, ...prev]);
      setShowUploadForm(false);
      setUploadData({ file: null, description: '' });
      
      toast.success('Report uploaded successfully');
    } catch (error) {
      console.error('Error uploading report:', error);
      toast.error('Failed to upload report');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.includes('pdf') && !file.type.includes('image')) {
        toast.error('Please upload only PDF or image files');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await userService.deleteMedicalReport(reportId);
      setReports(prev => prev.filter(report => report.id !== reportId));
      toast.success('Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error('Failed to delete report');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/user/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">{t('app.name')}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Reports</h1>
            <p className="text-gray-600">Upload and manage your medical documents</p>
          </div>
          
          <Button onClick={() => setShowUploadForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Upload Medical Report</CardTitle>
                <CardDescription>Upload your medical documents for AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select File</label>
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, JPG, PNG (Max size: 10MB)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description (Optional)</label>
                    <textarea
                      placeholder="Describe this report (e.g., Blood test results, X-ray report)"
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                  
                  {uploadData.file && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{uploadData.file.name}</span>
                        <span className="text-xs text-gray-500">({formatFileSize(uploadData.file.size)})</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowUploadForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={uploading || !uploadData.file}>
                      {uploading ? 'Uploading...' : 'Upload Report'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports List */}
        {reports.length > 0 ? (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{report.fileName}</h3>
                        {report.description && (
                          <p className="text-gray-600 mb-2">{report.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{report.fileType}</span>
                          <span>{formatFileSize(report.fileSize)}</span>
                          <span>Uploaded on {formatDate(report.uploadedAt)}</span>
                        </div>
                        
                        {report.parsedData && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">AI Analysis Available</p>
                            <p className="text-xs text-green-700">
                              This report has been analyzed by our AI system
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(report.fileUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = report.fileUrl;
                          link.download = report.fileName;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your medical reports to get AI-powered insights and analysis.
              </p>
              <Button onClick={() => setShowUploadForm(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Your First Report
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upload Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Upload Guidelines</CardTitle>
            <CardDescription>Tips for uploading medical reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Supported File Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PDF documents</li>
                  <li>• JPG/JPEG images</li>
                  <li>• PNG images</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">File Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Clear, readable text/images</li>
                  <li>• Proper orientation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">What We Analyze</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Blood test results</li>
                  <li>• Vital signs</li>
                  <li>• Medication lists</li>
                  <li>• Doctor's notes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Privacy & Security</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encrypted storage</li>
                  <li>• Secure processing</li>
                  <li>• Your data stays private</li>
                  <li>• HIPAA compliant</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
