import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ProviderClaimFormData {
  type: string;
  date: string;
  time: string;
  location: string;
  patientName: string;
  description: string;
  witnesses: string;
  policeReport: boolean;
}

export function useProviderFileClaimScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState<ProviderClaimFormData>({
    type: '',
    date: '',
    time: '',
    location: '',
    patientName: '',
    description: '',
    witnesses: '',
    policeReport: false,
  });
  const [files, setFiles] = useState<File[]>([]);

  function updateField<Key extends keyof ProviderClaimFormData>(
    key: Key,
    value: ProviderClaimFormData[Key],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const nextFiles = Array.from(event.target.files);
    const oversizedFile = nextFiles.find((file) => file.size > 10 * 1024 * 1024);
    if (oversizedFile) {
      setFileError(`Le fichier ${oversizedFile.name} depasse la limite de 10 MB.`);
      return;
    }

    setFileError('');
    setSubmitError('');
    setFiles((current) => [...current, ...nextFiles]);
  }

  function removeFile(index: number) {
    setFileError('');
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
  }

  async function handleSubmit() {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setStep(4);
    } catch {
      setSubmitError("L'envoi a echoue. Reessayez dans quelques instants.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fileError,
    files,
    formData,
    handleFileChange,
    handleSubmit,
    inputClass:
      'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white dark:placeholder:text-slate-500',
    isSubmitting,
    labelClass: 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300',
    navigate,
    removeFile,
    setStep,
    step,
    submitError,
    updateField,
  };
}
