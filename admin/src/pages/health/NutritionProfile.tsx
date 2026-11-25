import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  User,
  AlertCircle,
  Target,
  Scale,
  Calendar } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
export function NutritionProfile() {
  const navigate = useNavigate();
  // Form state
  const [profile, setProfile] = useState({
    age: 45,
    weight: 78,
    height: 170,
    gender: 'homme',
    objective: 'perte-poids',
    activityLevel: 'modere'
  });
  const [allergies, setAllergies] = useState<string[]>([
  'Lactose',
  'Fruits à coque']
  );
  const [maladies, setMaladies] = useState<string[]>([
  'Diabète Type 2',
  'Hypertension']
  );
  const [newAllergy, setNewAllergy] = useState('');
  const [newMaladie, setNewMaladie] = useState('');
  const objectiveOptions = [
  {
    value: 'perte-poids',
    label: 'Perte de poids'
  },
  {
    value: 'maintien',
    label: 'Maintien du poids'
  },
  {
    value: 'prise-masse',
    label: 'Prise de masse musculaire'
  },
  {
    value: 'sante',
    label: 'Amélioration santé générale'
  }];

  const activityLevelOptions = [
  {
    value: 'sedentaire',
    label: "Sédentaire (peu ou pas d'exercice)"
  },
  {
    value: 'leger',
    label: 'Léger (exercice 1-3 jours/semaine)'
  },
  {
    value: 'modere',
    label: 'Modéré (exercice 3-5 jours/semaine)'
  },
  {
    value: 'intense',
    label: 'Intense (exercice 6-7 jours/semaine)'
  }];

  const commonAllergies = [
  'Lactose',
  'Gluten',
  'Fruits à coque',
  'Arachides',
  'Œufs',
  'Poisson',
  'Crustacés',
  'Soja'];

  const commonMaladies = [
  'Diabète Type 1',
  'Diabète Type 2',
  'Hypertension',
  'Cholestérol élevé',
  'Maladie cœliaque',
  'Insuffisance rénale',
  'Maladie cardiaque',
  'Obésité'];

  const addAllergy = (allergy: string) => {
    if (allergy && !allergies.includes(allergy)) {
      setAllergies([...allergies, allergy]);
      setNewAllergy('');
    }
  };
  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };
  const addMaladie = (maladie: string) => {
    if (maladie && !maladies.includes(maladie)) {
      setMaladies([...maladies, maladie]);
      setNewMaladie('');
    }
  };
  const removeMaladie = (maladie: string) => {
    setMaladies(maladies.filter((m) => m !== maladie));
  };
  const handleSave = () => {
    // Save profile logic here
    alert('Profil sauvegardé avec succès !');
    navigate('/health/nutrition');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 pt-8 pb-12">
        <button
          onClick={() => navigate('/health/nutrition')}
          className="flex items-center text-white/90 hover:text-white mb-6">
          
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configuration du Profil</h1>
              <p className="text-emerald-100">
                Personnalisez vos recommandations nutritionnelles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Basic Information */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Informations de base
          </h3>

          <div className="space-y-4">
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Âge (années)
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) =>
                setProfile({
                  ...profile,
                  age: parseInt(e.target.value)
                })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
              
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexe
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="homme"
                    checked={profile.gender === 'homme'}
                    onChange={(e) =>
                    setProfile({
                      ...profile,
                      gender: e.target.value
                    })
                    }
                    className="mr-2" />
                  
                  Homme
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="femme"
                    checked={profile.gender === 'femme'}
                    onChange={(e) =>
                    setProfile({
                      ...profile,
                      gender: e.target.value
                    })
                    }
                    className="mr-2" />
                  
                  Femme
                </label>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Scale className="h-4 w-4 inline mr-1" />
                  Poids (kg)
                </label>
                <input
                  type="number"
                  value={profile.weight}
                  onChange={(e) =>
                  setProfile({
                    ...profile,
                    weight: parseInt(e.target.value)
                  })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  value={profile.height}
                  onChange={(e) =>
                  setProfile({
                    ...profile,
                    height: parseInt(e.target.value)
                  })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4 inline mr-1" />
                Objectif
              </label>
              <select
                value={profile.objective}
                onChange={(e) =>
                setProfile({
                  ...profile,
                  objective: e.target.value
                })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                
                {objectiveOptions.map((option) =>
                <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )}
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'activité physique
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) =>
                setProfile({
                  ...profile,
                  activityLevel: e.target.value
                })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                
                {activityLevelOptions.map((option) =>
                <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )}
              </select>
            </div>
          </div>
        </Card>

        {/* Allergies */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Allergies alimentaires
          </h3>

          {/* Current Allergies */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {allergies.map((allergy) =>
              <span
                key={allergy}
                className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium flex items-center gap-2">
                
                  {allergy}
                  <button
                  onClick={() => removeAllergy(allergy)}
                  className="text-red-600 hover:text-red-800">
                  
                    ×
                  </button>
                </span>
              )}
              {allergies.length === 0 &&
              <span className="text-gray-500 text-sm">
                  Aucune allergie déclarée
                </span>
              }
            </div>
          </div>

          {/* Add Allergy */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajouter une allergie
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Ex: Lactose"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addAllergy(newAllergy);
                  }
                }} />
              
              <Button onClick={() => addAllergy(newAllergy)}>Ajouter</Button>
            </div>
          </div>

          {/* Common Allergies */}
          <div>
            <div className="text-xs text-gray-600 mb-2">
              Allergies courantes :
            </div>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.map((allergy) =>
              <button
                key={allergy}
                onClick={() => addAllergy(allergy)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                disabled={allergies.includes(allergy)}>
                
                  + {allergy}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Medical Conditions */}
        <Card className="bg-white shadow-xl border-0 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            Conditions médicales
          </h3>

          {/* Current Conditions */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {maladies.map((maladie) =>
              <span
                key={maladie}
                className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2">
                
                  {maladie}
                  <button
                  onClick={() => removeMaladie(maladie)}
                  className="text-orange-600 hover:text-orange-800">
                  
                    ×
                  </button>
                </span>
              )}
              {maladies.length === 0 &&
              <span className="text-gray-500 text-sm">
                  Aucune condition déclarée
                </span>
              }
            </div>
          </div>

          {/* Add Condition */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ajouter une condition
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMaladie}
                onChange={(e) => setNewMaladie(e.target.value)}
                placeholder="Ex: Diabète"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addMaladie(newMaladie);
                  }
                }} />
              
              <Button onClick={() => addMaladie(newMaladie)}>Ajouter</Button>
            </div>
          </div>

          {/* Common Conditions */}
          <div>
            <div className="text-xs text-gray-600 mb-2">
              Conditions courantes :
            </div>
            <div className="flex flex-wrap gap-2">
              {commonMaladies.map((maladie) =>
              <button
                key={maladie}
                onClick={() => addMaladie(maladie)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                disabled={maladies.includes(maladie)}>
                
                  + {maladie}
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Information importante</p>
              <p>
                Ces informations sont utilisées uniquement pour personnaliser
                vos recommandations nutritionnelles. Elles ne remplacent pas un
                avis médical professionnel. Consultez toujours un médecin ou
                nutritionniste pour un suivi personnalisé.
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex-1 flex items-center justify-center gap-2">
            
            <Save className="h-5 w-5" />
            Enregistrer le profil
          </Button>
          <Button
            onClick={() => navigate('/health/nutrition')}
            variant="outline"
            className="px-6">
            
            Annuler
          </Button>
        </div>
      </div>
    </div>);

}