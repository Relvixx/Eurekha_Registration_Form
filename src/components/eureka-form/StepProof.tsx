import React, { useRef, useState } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileImage, Loader2 } from 'lucide-react';
import { useFormState } from '../../hooks/useFormState';
import { uploadRegistrationProof, createRegistrationDraft } from '../../lib/api';

interface StepProofProps {
  errors?: Record<string, string>;
}

export default function StepProof({ errors }: StepProofProps) {
  const formState = useFormState();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formState.setEurekaRegistrationId(e.target.value);
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

    // If no draft exists yet, create one on-the-fly
    let currentRegId = formState.registrationId;
    let currentDraftToken = formState.draftToken;

    if (!currentRegId || !currentDraftToken) {
      try {
        const result = await createRegistrationDraft(formState);
        if (result) {
          currentRegId = result.registrationId;
          currentDraftToken = result.draftToken;
          formState.setDraftToken(currentDraftToken!);
          formState.setRegistrationId(currentRegId!);
        } else {
          setUploadError('Could not initialize registration. Please try again.');
          return;
        }
      } catch (err: any) {
        setUploadError(err.message || 'Could not initialize registration. Please try again.');
        return;
      }
    }

    setIsUploading(true);
    try {
      const response = await uploadRegistrationProof(
        currentRegId!,
        currentDraftToken!,
        file
      );
      
      if (response && response.success) {
        formState.setProofUploaded(true);
        formState.setProofUrl(response.path);
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
    formState.setProofUploaded(false);
    formState.setProofUrl('');
    // Notice: We don't necessarily delete from storage immediately to avoid complexity,
    // it can be overwritten on next upload.
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-poppins">
          Registration Proof
        </h2>
        <p className="text-text-muted font-inter text-lg">
          Enter your Eureka Registration ID and upload a screenshot confirming your registration.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-8 glass-panel p-8 md:p-10 rounded-2xl">
        
        {/* Eureka ID Input */}
        <div className="space-y-3">
          <label htmlFor="eurekaId" className="block text-sm font-semibold text-white font-inter text-left">
            Eureka Registration ID <span className="text-primary">*</span>
          </label>
          <input
            id="eurekaId"
            type="text"
            value={formState.eurekaRegistrationId}
            onChange={handleIdChange}
            placeholder="e.g. EUR2023-XXXX"
            className={`glass-input w-full p-4 rounded-xl text-white ${errors?.eurekaRegistrationId ? 'border-error shadow-[0_0_10px_rgba(255,37,58,0.1)]' : 'border-white/10'}`}
          />
          {errors?.eurekaRegistrationId && (
            <p className="text-sm text-error mt-2 font-inter font-medium text-left">{errors.eurekaRegistrationId}</p>
          )}
        </div>
        
        {/* File Upload Area */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white font-inter text-left">
            Upload Screenshot <span className="text-primary">*</span>
          </label>
          
          {!formState.proofUploaded ? (
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden
                ${isDragging ? 'border-primary bg-primary/5' : 'border-white/10 bg-text-dark hover:border-primary/30 hover:bg-primary/5'}
                ${errors?.proofUploaded ? 'border-error bg-error/5' : ''}
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
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-2" />
                    <p className="text-white font-semibold font-inter">Uploading securely...</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-surface-secondary border border-white/5 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(26,111,245,0.15)]">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-white font-semibold font-inter">Click or drag file to upload</p>
                      <p className="text-sm text-text-muted font-inter">JPG or PNG, maximum 5MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="border border-[#00E5FF]/30 bg-[#00E5FF]/10 rounded-xl p-5 flex items-center justify-between shadow-[0_0_15px_rgba(0,229,255,0.05)]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold font-inter">Screenshot Uploaded</p>
                  <p className="text-sm text-[#00E5FF]/80 font-inter mt-0.5">Valid proof attached successfully</p>
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

          {(uploadError || errors?.proofUploaded || errors?.proofUrl) && (
            <div className="flex items-start mt-4 text-error text-sm bg-error/10 p-4 rounded-xl border border-error/20 font-inter">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              <p className="pt-0.5">{uploadError || errors?.proofUploaded || errors?.proofUrl}</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
