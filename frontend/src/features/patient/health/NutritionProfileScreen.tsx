import { useState } from 'react';
import { AlertCircle, ArrowLeft, Calendar, Save, Scale, Target, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { showSuccessToast } from '@/shared/lib/notifications/toast';
import { Button } from '@/shared/ui/primitives/button';
import { Card } from '@/shared/ui/primitives/card';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/shared/ui/primitives/field';
import { Input } from '@/shared/ui/primitives/input';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/primitives/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

export function NutritionProfileScreen() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    age: 45,
    weight: 78,
    height: 170,
    gender: 'homme',
    objective: 'perte-poids',
    activityLevel: 'modere',
  });
  const [allergies, setAllergies] = useState<string[]>(['Lactose', 'Fruits à coque']);
  const [maladies, setMaladies] = useState<string[]>(['Diabète Type 2', 'Hypertension']);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMaladie, setNewMaladie] = useState('');

  const objectiveOptions = [
    { value: 'perte-poids', label: 'Perte de poids' },
    { value: 'maintien', label: 'Maintien du poids' },
    { value: 'prise-masse', label: 'Prise de masse musculaire' },
    { value: 'sante', label: 'Amélioration santé générale' },
  ];

  const activityLevelOptions = [
    { value: 'sedentaire', label: "Sédentaire (peu ou pas d'exercice)" },
    { value: 'leger', label: 'Léger (exercice 1-3 jours/semaine)' },
    { value: 'modere', label: 'Modéré (exercice 3-5 jours/semaine)' },
    { value: 'intense', label: 'Intense (exercice 6-7 jours/semaine)' },
  ];

  const commonAllergies = [
    'Lactose',
    'Gluten',
    'Fruits à coque',
    'Arachides',
    'Œufs',
    'Poisson',
    'Crustacés',
    'Soja',
  ];

  const commonMaladies = [
    'Diabète Type 1',
    'Diabète Type 2',
    'Hypertension',
    'Cholestérol élevé',
    'Maladie cœliaque',
    'Insuffisance rénale',
    'Maladie cardiaque',
    'Obésité',
  ];

  const addAllergy = (allergy: string) => {
    if (allergy && !allergies.includes(allergy)) {
      setAllergies((current) => [...current, allergy]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies((current) => current.filter((item) => item !== allergy));
  };

  const addMaladie = (maladie: string) => {
    if (maladie && !maladies.includes(maladie)) {
      setMaladies((current) => [...current, maladie]);
      setNewMaladie('');
    }
  };

  const removeMaladie = (maladie: string) => {
    setMaladies((current) => current.filter((item) => item !== maladie));
  };

  const handleSave = () => {
    showSuccessToast('Profil sauvegardé avec succès.');
    navigate('/health/nutrition');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 pb-20 dark:from-emerald-950 dark:to-teal-950">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 pb-12 pt-8 text-white shadow-lg shadow-emerald-900/10 dark:from-emerald-700 dark:to-emerald-900">
        <button
          onClick={() => navigate('/health/nutrition')}
          className="mb-6 flex items-center text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Retour
        </button>
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white shadow-inner shadow-white/10">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Configuration du Profil</h1>
              <p className="text-emerald-100">Personnalisez vos recommandations nutritionnelles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-8 max-w-4xl px-4">
        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <User className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            Informations de base
          </h3>

          <FieldGroup>
            <Field>
              <FieldLabel
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
                htmlFor="nutrition-age"
              >
                <Calendar className="mr-1 inline h-4 w-4" />
                Âge (années)
              </FieldLabel>
              <Input
                id="nutrition-age"
                type="number"
                value={profile.age}
                onChange={(event) =>
                  setProfile({
                    ...profile,
                    age: parseInt(event.target.value),
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </Field>

            <FieldSet>
              <FieldLegend
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
                variant="label"
              >
                Sexe
              </FieldLegend>
              <RadioGroup
                className="flex gap-4"
                value={profile.gender}
                onValueChange={(value) =>
                  setProfile({
                    ...profile,
                    gender: value,
                  })
                }
              >
                <Field className="w-auto items-center" orientation="horizontal">
                  <RadioGroupItem id="nutrition-gender-homme" value="homme" />
                  <FieldLabel htmlFor="nutrition-gender-homme">Homme</FieldLabel>
                </Field>
                <Field className="w-auto items-center" orientation="horizontal">
                  <RadioGroupItem id="nutrition-gender-femme" value="femme" />
                  <FieldLabel htmlFor="nutrition-gender-femme">Femme</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>

            <FieldGroup className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                  htmlFor="nutrition-weight"
                >
                  <Scale className="mr-1 inline h-4 w-4" />
                  Poids (kg)
                </FieldLabel>
                <Input
                  id="nutrition-weight"
                  type="number"
                  value={profile.weight}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      weight: parseInt(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>
              <Field>
                <FieldLabel
                  className="text-sm font-medium text-gray-700 dark:text-slate-300"
                  htmlFor="nutrition-height"
                >
                  Taille (cm)
                </FieldLabel>
                <Input
                  id="nutrition-height"
                  type="number"
                  value={profile.height}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      height: parseInt(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
                htmlFor="nutrition-objective"
              >
                <Target className="mr-1 inline h-4 w-4" />
                Objectif
              </FieldLabel>
              <Select
                value={profile.objective}
                onValueChange={(value) =>
                  setProfile({
                    ...profile,
                    objective: value,
                  })
                }
              >
                <SelectTrigger
                  id="nutrition-objective"
                  className="h-10 w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <SelectValue placeholder="Objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {objectiveOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel
                className="text-sm font-medium text-gray-700 dark:text-slate-300"
                htmlFor="nutrition-activity-level"
              >
                Niveau d'activité physique
              </FieldLabel>
              <Select
                value={profile.activityLevel}
                onValueChange={(value) =>
                  setProfile({
                    ...profile,
                    activityLevel: value,
                  })
                }
              >
                <SelectTrigger
                  id="nutrition-activity-level"
                  className="h-10 w-full rounded-lg border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <SelectValue placeholder="Niveau d'activité physique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {activityLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </Card>

        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
            Allergies alimentaires
          </h3>

          <div className="mb-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-950/70 dark:text-red-200"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(allergy)}
                    className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              {allergies.length === 0 ? (
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Aucune allergie déclarée
                </span>
              ) : null}
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Ajouter une allergie
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(event) => setNewAllergy(event.target.value)}
                placeholder="Ex: Lactose"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    addAllergy(newAllergy);
                  }
                }}
              />

              <Button
                onClick={() => addAllergy(newAllergy)}
                className="border-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
              >
                Ajouter
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs text-gray-600 dark:text-slate-400">
              Allergies courantes :
            </div>
            <div className="flex flex-wrap gap-2">
              {commonAllergies.map((allergy) => (
                <button
                  key={allergy}
                  onClick={() => addAllergy(allergy)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  disabled={allergies.includes(allergy)}
                >
                  + {allergy}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="mb-6 border-0 bg-white p-6 text-gray-900 shadow-xl dark:bg-slate-900 dark:text-white">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-300" />
            Conditions médicales
          </h3>

          <div className="mb-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {maladies.map((maladie) => (
                <span
                  key={maladie}
                  className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-950/70 dark:text-orange-200"
                >
                  {maladie}
                  <button
                    onClick={() => removeMaladie(maladie)}
                    className="text-orange-600 hover:text-orange-800 dark:text-orange-300 dark:hover:text-orange-100"
                  >
                    ×
                  </button>
                </span>
              ))}
              {maladies.length === 0 ? (
                <span className="text-sm text-gray-500 dark:text-slate-400">
                  Aucune condition déclarée
                </span>
              ) : null}
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-slate-300">
              Ajouter une condition
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMaladie}
                onChange={(event) => setNewMaladie(event.target.value)}
                placeholder="Ex: Diabète"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    addMaladie(newMaladie);
                  }
                }}
              />

              <Button
                onClick={() => addMaladie(newMaladie)}
                className="border-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
              >
                Ajouter
              </Button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs text-gray-600 dark:text-slate-400">
              Conditions courantes :
            </div>
            <div className="flex flex-wrap gap-2">
              {commonMaladies.map((maladie) => (
                <button
                  key={maladie}
                  onClick={() => addMaladie(maladie)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  disabled={maladies.includes(maladie)}
                >
                  + {maladie}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="mb-6 border border-blue-200 bg-blue-50 p-6 text-blue-900 shadow-sm dark:border-blue-800/70 dark:bg-blue-950/60 dark:text-blue-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-300" />
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <p className="mb-1 font-medium">Information importante</p>
              <p>
                Ces informations sont utilisées uniquement pour personnaliser vos recommandations
                nutritionnelles. Elles ne remplacent pas un avis médical professionnel. Consultez
                toujours un médecin ou nutritionniste pour un suivi personnalisé.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 border-0 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-700 hover:to-emerald-800"
          >
            <Save className="h-5 w-5" />
            Enregistrer le profil
          </Button>
          <Button
            onClick={() => navigate('/health/nutrition')}
            variant="outline"
            className="border-gray-300 bg-white px-6 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}
