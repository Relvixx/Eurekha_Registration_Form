import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileImage, Loader2 } from 'lucide-react';
import { useWizardState } from '../../hooks/useWizardState';
import { uploadRegistrationProof } from '../../lib/api';

interface StepProofProps {
  errors?: Record<string, string>;
}

export default function StepProof({ errors }: StepProofProps) {
  const wizardState = useWizardState();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    wizardState.setEurekaRegistrationId(e.target.value);
  };

  const validateFile = (file: File): string | null => {
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB limit.';
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      return 'Invalid file type. Only JPG and PNG are allowed.';
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    const errorMsg = validateFile(file);
    if (errorMsg) {
      setUploadError(errorMsg);
      return;
    }

    if (!wizardState.registrationId || !wizardState.draftToken) {
      setUploadError('Session expired or invalid. Please refresh the page and try again.');
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadRegistrationProof(
        wizardState.registrationId,
        wizardState.draftToken,
        file
      );
      
      if (response && response.success) {
        wizardState.setProofUploaded(true);
        wizardState.setProofUrl(response.path);
      } else {
        setUploadError('Failed to upload proof. Please try again.');
      }
    } catch (error: any) {
      setUploadError(error.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveProof = () => {
    wizardState.setProofUploaded(false);
    wizardState.setProofUrl('');
    // Notice: We don't necessarily delete from storage immediately to avoid complexity,
    // it can be overwritten on next upload.
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Registration Proof
        </h2>
        <p className="text-white/60 text-sm sm:text-base">
          Enter your Eureka Registration ID and upload a screenshot confirming your registration.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-8 bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
        
        {/* Eureka ID Input */}
        <div className="space-y-2">
          <label htmlFor="eurekaId" className="block text-sm font-medium text-white/90">
            Eureka Registration ID
          </label>
          <input
            id="eurekaId"
            type="text"
            value={wizardState.eurekaRegistrationId}
            onChange={handleIdChange}
            placeholder="e.g. EUR2023-XXXX"
            className={`w-full bg-black/40 border ${errors?.eurekaRegistrationId ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10 focus:border-[#00E5FF] focus:ring-[#00E5FF]/20'} rounded-lg px-4 py-3 text-white placeholder-white/30 transition-all outline-none focus:ring-2`}
          />
          {errors?.eurekaRegistrationId && (
            <p className="text-sm text-red-400 mt-1">{errors.eurekaRegistrationId}</p>
          )}
        </div>
        
        {/* File Upload Area */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90">
            Upload Screenshot
          </label>
          
          {!wizardState.proofUploaded ? (
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer overflow-hidden
                ${isDragging ? 'border-[#00E5FF] bg-[#00E5FF]/10' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'}
                ${errors?.proofUploaded ? 'border-red-500 bg-red-500/5' : ''}
                ${isUploading ? 'pointer-events-none opacity-80' : ''}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileInputChange} 
                className="hidden" 
                accept="image/jpeg, image/png"
              />
              
              <div className="flex flex-col items-center justify-center space-y-3">
                {isUploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-[#00E5FF] animate-spin mb-2" />
                    <p className="text-white font-medium">Uploading securely...</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-white/80" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-medium">Click or drag file to upload</p>
                      <p className="text-sm text-white/50">JPG or PNG, maximum 5MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Screenshot Uploaded</p>
                  <p className="text-sm text-emerald-400/80">Valid proof attached successfully</p>
                </div>
              </div>
              <button 
                onClick={handleRemoveProof}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                title="Remove uploaded proof"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {(uploadError || errors?.proofUploaded) && (
            <div className="flex items-start mt-3 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
              <p>{uploadError || errors?.proofUploaded}</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
