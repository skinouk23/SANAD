import { Check, Save } from 'lucide-react';

import { DatePickerField } from '@/shared/ui/composites/date-picker-field';
import { Button } from '@/shared/ui/primitives/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/primitives/dialog';
import { Field, FieldLabel } from '@/shared/ui/primitives/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/primitives/select';

import type { CarePlanCondition, CarePlanMedication } from './carePlan.types';

export function AddConditionModal({
  form,
  onChange,
  onClose,
  onSubmit,
  open,
}: {
  form: { name: string; icon: string; since: string; status: CarePlanCondition['status'] };
  onChange: (next: {
    name: string;
    icon: string;
    since: string;
    status: CarePlanCondition['status'];
  }) => void;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Ajouter une condition
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Nom de la condition
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
              placeholder="Ex: Hypertension"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Icône
            </label>
            <input
              type="text"
              value={form.icon}
              onChange={(event) => onChange({ ...form, icon: event.target.value })}
              placeholder="❤️"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Depuis
            </label>
            <input
              type="text"
              value={form.since}
              onChange={(event) => onChange({ ...form, since: event.target.value })}
              placeholder="Ex: 2020"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-rose-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-rose-500 dark:focus:ring-rose-500/20"
            />
          </div>

          <Field>
            <FieldLabel
              htmlFor="condition-status"
              className="font-semibold text-gray-900 dark:text-white"
            >
              Statut
            </FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                onChange({ ...form, status: value as CarePlanCondition['status'] })
              }
            >
              <SelectTrigger
                id="condition-status"
                className="h-11 w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 focus-visible:border-rose-500 focus-visible:ring-rose-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              >
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="controlled">Contrôlé</SelectItem>
                  <SelectItem value="monitored">Surveillé</SelectItem>
                  <SelectItem value="attention">Attention</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </DialogBody>

        <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 border-0 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddMedicationModal({
  form,
  onChange,
  onClose,
  onSubmit,
  open,
}: {
  form: { name: string; dosage: string; condition: string; stock: number; nextRefill: string };
  onChange: (next: {
    name: string;
    dosage: string;
    condition: string;
    stock: number;
    nextRefill: string;
  }) => void;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md" scroll="content">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
            Ajouter un médicament
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
              Nom du médicament
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => onChange({ ...form, name: event.target.value })}
              placeholder="Ex: Aspirine"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
              Dosage
            </label>
            <input
              type="text"
              value={form.dosage}
              onChange={(event) => onChange({ ...form, dosage: event.target.value })}
              placeholder="Ex: 100mg matin et soir"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
              Condition
            </label>
            <input
              type="text"
              value={form.condition}
              onChange={(event) => onChange({ ...form, condition: event.target.value })}
              placeholder="Ex: Hypertension"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white">
              Stock (jours)
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(event) => onChange({ ...form, stock: parseInt(event.target.value) })}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <DatePickerField
            id="care-plan-next-refill"
            label="Prochain renouvellement"
            value={form.nextRefill}
            onChange={(value) => onChange({ ...form, nextRefill: value })}
            className="gap-1.5"
            labelClassName="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-white"
            triggerClassName="rounded-xl border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </DialogBody>

        <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 border-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditMedicationModal({
  medication,
  onChange,
  onClose,
  onSave,
  open,
}: {
  medication: CarePlanMedication | null;
  onChange: (next: CarePlanMedication) => void;
  onClose: () => void;
  onSave: () => void;
  open: boolean;
}) {
  if (!open || !medication) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Modifier le médicament
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Nom
            </label>
            <input
              type="text"
              value={medication.name}
              onChange={(event) => onChange({ ...medication, name: event.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Dosage
            </label>
            <input
              type="text"
              value={medication.dosage}
              onChange={(event) => onChange({ ...medication, dosage: event.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Stock (jours)
            </label>
            <input
              type="number"
              value={medication.stock}
              onChange={(event) => onChange({ ...medication, stock: parseInt(event.target.value) })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
        </DialogBody>

        <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Annuler
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 border-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Sauvegarder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddAppointmentModal({
  form,
  onChange,
  onClose,
  onSubmit,
  open,
}: {
  form: { type: string; date: string; time: string; doctor: string; location: string };
  onChange: (next: {
    type: string;
    date: string;
    time: string;
    doctor: string;
    location: string;
  }) => void;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Planifier un rendez-vous
          </DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Type de rendez-vous
            </label>
            <input
              type="text"
              value={form.type}
              onChange={(event) => onChange({ ...form, type: event.target.value })}
              placeholder="Ex: Consultation cardiologie"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              id="care-plan-appointment-date"
              label="Date"
              value={form.date}
              onChange={(value) => onChange({ ...form, date: value })}
              className="gap-2"
              labelClassName="mb-2 block text-sm font-semibold text-gray-900 dark:text-white"
              triggerClassName="rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
                Heure
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(event) => onChange({ ...form, time: event.target.value })}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-white">
              Médecin / Lieu
            </label>
            <input
              type="text"
              value={form.doctor || form.location}
              onChange={(event) => onChange({ ...form, doctor: event.target.value })}
              placeholder="Ex: Dr. Trabelsi"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-all placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500/20"
            />
          </div>
        </DialogBody>

        <DialogFooter className="mt-0 flex-row gap-3 sm:justify-stretch">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-200 bg-white text-gray-900 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 border-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Check className="mr-2 h-4 w-4" />
            Planifier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
