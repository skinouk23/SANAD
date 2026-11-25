import { useState } from 'react';

import {
  createInitialDonationPostForm,
  donationBrowseCategories,
  donationPostSteps,
  donationTabs,
  donationTypeCategories,
  donationUnitOptions,
  mockDonations,
  mockMyDonations,
  mockMyRequests,
} from '@/features/patient/donations/medicationDonation.data';
import type {
  Donation,
  DonationCategory,
  DonationPostForm,
  DonationPostStep,
  DonationTab,
} from '@/features/patient/donations/medicationDonation.types';

export function useMedicationDonationScreen() {
  const [activeTab, setActiveTab] = useState<DonationTab>('browse');
  const [categoryFilter, setCategoryFilter] = useState<DonationCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [postStep, setPostStep] = useState<DonationPostStep>(1);
  const [requestMessage, setRequestMessage] = useState('');
  const [postForm, setPostForm] = useState<DonationPostForm>(() => createInitialDonationPostForm());

  const filteredDonations = mockDonations.filter((donation) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      donation.type === (categoryFilter === 'medication' ? 'medication' : 'equipment');
    const matchesSearch =
      !searchQuery ||
      donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleActiveTabChange = (tab: DonationTab) => {
    setActiveTab(tab);
  };

  const handleCategoryFilterChange = (category: DonationCategory) => {
    setCategoryFilter(category);
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
  };

  const handlePostStepChange = (step: DonationPostStep) => {
    setPostStep(step);
  };

  const handleRequestMessageChange = (value: string) => {
    setRequestMessage(value);
  };

  const updatePostForm = <Field extends keyof DonationPostForm>(
    field: Field,
    value: DonationPostForm[Field],
  ) => {
    setPostForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetPostFlow = () => {
    setPostStep(1);
    setPostForm(createInitialDonationPostForm());
  };

  const handleOpenRequestModal = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowRequestModal(true);
  };

  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
  };

  const handleSubmitRequest = () => {
    setShowRequestModal(false);
    setRequestMessage('');
  };

  const handleOpenLegalModal = () => {
    setShowLegalModal(true);
  };

  const handleCloseLegalModal = () => {
    setShowLegalModal(false);
  };

  const handleSubmitDonation = () => {
    resetPostFlow();
    setActiveTab('my-donations');
  };

  return {
    activeTab,
    browseCategories: donationBrowseCategories,
    canContinueToPostConfirmation: Boolean(postForm.name && postForm.quantity && postForm.location),
    canContinueToPostDetails: Boolean(postForm.category),
    categoryFilter,
    donationTabs,
    filteredDonations,
    myDonations: mockMyDonations,
    myRequests: mockMyRequests,
    onActiveTabChange: handleActiveTabChange,
    onCategoryFilterChange: handleCategoryFilterChange,
    onCloseLegalModal: handleCloseLegalModal,
    onCloseRequestModal: handleCloseRequestModal,
    onOpenLegalModal: handleOpenLegalModal,
    onOpenRequestModal: handleOpenRequestModal,
    onPostStepChange: handlePostStepChange,
    onRequestMessageChange: handleRequestMessageChange,
    onSearchQueryChange: handleSearchQueryChange,
    onSubmitDonation: handleSubmitDonation,
    onSubmitRequest: handleSubmitRequest,
    postForm,
    postCategoryOptions: donationTypeCategories[postForm.type],
    postStep,
    postSteps: donationPostSteps,
    postUnitOptions: donationUnitOptions,
    requestMessage,
    searchQuery,
    selectedDonation,
    showLegalModal,
    showRequestModal,
    updatePostForm,
  };
}

export type MedicationDonationScreenViewModel = ReturnType<typeof useMedicationDonationScreen>;
