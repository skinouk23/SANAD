import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell, Settings, Shield } from 'lucide-react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  DeleteAccountDialog,
  ProfileAppearanceSettings,
  ProfileDangerZone,
} from '@/shared/ui/composites/profile-account';
import { ProfileTabBar } from '@/shared/ui/composites/profile-tabs';
import { getPanelId, getTabButtonId } from '@/shared/ui/composites/profile-tabs.ids';

const PROFILE_TAB_BAR_ID_BASE = 'profile-settings';

function ProfileTabBarHarness() {
  const [activeTab, setActiveTab] = useState<'appearance' | 'security' | 'notifications'>(
    'appearance',
  );
  const tabs = [
    {
      id: 'appearance' as const,
      icon: Settings,
      label: 'Apparence',
    },
    {
      id: 'security' as const,
      icon: Shield,
      label: 'Sécurité',
    },
    {
      id: 'notifications' as const,
      icon: Bell,
      label: 'Notifications',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <ProfileTabBar
        activeTab={activeTab}
        ariaLabel="Sections du profil"
        idBase={PROFILE_TAB_BAR_ID_BASE}
        onChange={setActiveTab}
        tabs={tabs}
      />
      {tabs.map((tab) => {
        if (tab.id !== activeTab) {
          return null;
        }

        return (
          <section
            key={tab.id}
            aria-labelledby={getTabButtonId(PROFILE_TAB_BAR_ID_BASE, tab.id)}
            id={getPanelId(PROFILE_TAB_BAR_ID_BASE, tab.id)}
            role="tabpanel"
          >
            Panneau {tab.label}
          </section>
        );
      })}
    </div>
  );
}

interface DeleteAccountDialogHarnessProps {
  submitting?: boolean;
}

function DeleteAccountDialogHarness({ submitting = false }: DeleteAccountDialogHarnessProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button">Avant</button>
      <button onClick={() => setIsOpen(true)} type="button">
        Ouvrir la suppression
      </button>
      <button type="button">Après</button>
      <DeleteAccountDialog
        acknowledgeLabel="Je comprends que cette action est irréversible."
        cancelLabel="Annuler"
        confirmLabel="Supprimer le compte"
        currentPasswordLabel="Mot de passe actuel"
        description="Cette action supprime définitivement votre compte."
        isOpen={isOpen}
        keywordLabel="Mot-clé de confirmation"
        keywordValue="DELETE"
        onClose={() => setIsOpen(false)}
        onConfirm={vi.fn()}
        submitting={submitting}
        title="Supprimer le compte"
      />
    </div>
  );
}

describe('Profile chrome components', () => {
  it('binds the language select and only toggles the theme when switching modes', async () => {
    const user = userEvent.setup();
    const onLanguageChange = vi.fn();
    const onToggleTheme = vi.fn();

    render(
      <ProfileAppearanceSettings
        currentLanguageCode="fr-FR"
        darkLabel="Mode sombre"
        isThemeDark
        languageLabel="Langue"
        lightLabel="Mode clair"
        onLanguageChange={onLanguageChange}
        onToggleTheme={onToggleTheme}
        themeLabel="Thème"
      />,
    );

    expect(screen.getByLabelText('Langue')).toHaveValue('fr-FR');

    await user.selectOptions(screen.getByLabelText('Langue'), 'en-GB');
    expect(onLanguageChange).toHaveBeenCalledWith('en-GB');

    await user.click(screen.getByRole('button', { name: 'Mode sombre' }));
    expect(onToggleTheme).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Mode clair' }));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('keeps delete confirmation disabled until the form is complete and submits only the password', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <DeleteAccountDialog
        acknowledgeLabel="Je comprends que cette action est irréversible."
        cancelLabel="Annuler"
        confirmLabel="Supprimer le compte"
        currentPasswordLabel="Mot de passe actuel"
        description="Cette action supprime définitivement votre compte."
        isOpen
        keywordLabel="Mot-clé de confirmation"
        keywordValue="DELETE"
        onClose={vi.fn()}
        onConfirm={onConfirm}
        submitting={false}
        title="Supprimer le compte"
      />,
    );

    const confirmButton = screen.getByRole('button', { name: 'Supprimer le compte' });
    expect(confirmButton).toBeDisabled();

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'Secret123!');
    await user.type(screen.getByLabelText('Mot-clé de confirmation'), 'WRONG');
    await user.click(
      screen.getByRole('checkbox', { name: 'Je comprends que cette action est irréversible.' }),
    );
    expect(confirmButton).toBeDisabled();

    await user.clear(screen.getByLabelText('Mot-clé de confirmation'));
    await user.type(screen.getByLabelText('Mot-clé de confirmation'), 'DELETE');
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledWith({ currentPassword: 'Secret123!' });
  });

  it('blocks duplicate delete submissions while confirmation is still in flight', async () => {
    const user = userEvent.setup();
    let resolveConfirm: (() => void) | undefined;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveConfirm = resolve;
        }),
    );

    render(
      <DeleteAccountDialog
        acknowledgeLabel="Je comprends que cette action est irréversible."
        cancelLabel="Annuler"
        confirmLabel="Supprimer le compte"
        currentPasswordLabel="Mot de passe actuel"
        description="Cette action supprime définitivement votre compte."
        isOpen
        keywordLabel="Mot-clé de confirmation"
        keywordValue="DELETE"
        onClose={vi.fn()}
        onConfirm={onConfirm}
        submitting={false}
        title="Supprimer le compte"
      />,
    );

    await user.type(screen.getByLabelText('Mot de passe actuel'), 'Secret123!');
    await user.type(screen.getByLabelText('Mot-clé de confirmation'), 'DELETE');
    await user.click(
      screen.getByRole('checkbox', { name: 'Je comprends que cette action est irréversible.' }),
    );

    const confirmButton = screen.getByRole('button', { name: 'Supprimer le compte' });
    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(confirmButton).toBeDisabled();

    resolveConfirm?.();
    await waitFor(() => expect(confirmButton).toBeEnabled());
  });

  it('supports roving focus and keyboard navigation for the shared tab bar', async () => {
    const user = userEvent.setup();

    render(<ProfileTabBarHarness />);

    const appearanceTab = screen.getByRole('tab', { name: 'Apparence' });
    const securityTab = screen.getByRole('tab', { name: 'Sécurité' });
    const notificationsTab = screen.getByRole('tab', { name: 'Notifications' });

    expect(appearanceTab).toHaveAttribute('aria-selected', 'true');
    expect(appearanceTab).toHaveAttribute('tabindex', '0');
    expect(appearanceTab).toHaveAttribute(
      'aria-controls',
      getPanelId(PROFILE_TAB_BAR_ID_BASE, 'appearance'),
    );
    expect(securityTab).toHaveAttribute('tabindex', '-1');
    expect(notificationsTab).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel', { name: 'Apparence' })).toHaveAttribute(
      'aria-labelledby',
      getTabButtonId(PROFILE_TAB_BAR_ID_BASE, 'appearance'),
    );

    await user.tab();
    expect(appearanceTab).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(securityTab).toHaveFocus();
    expect(securityTab).toHaveAttribute('aria-selected', 'true');
    expect(securityTab).toHaveAttribute('tabindex', '0');
    expect(appearanceTab).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tabpanel', { name: 'Sécurité' })).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(notificationsTab).toHaveFocus();
    expect(notificationsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Notifications' })).toBeInTheDocument();

    await user.keyboard('{Home}');
    expect(appearanceTab).toHaveFocus();
    expect(appearanceTab).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowLeft}');
    expect(notificationsTab).toHaveFocus();
    expect(notificationsTab).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the delete dialog keyboard-modal and restores focus when it closes', async () => {
    const user = userEvent.setup();

    render(<DeleteAccountDialogHarness />);

    const openButton = screen.getByRole('button', { name: 'Ouvrir la suppression' });
    openButton.focus();

    await user.click(openButton);

    const passwordInput = screen.getByLabelText('Mot de passe actuel');
    const keywordInput = screen.getByLabelText('Mot-clé de confirmation');
    const acknowledgementCheckbox = screen.getByRole('checkbox', {
      name: 'Je comprends que cette action est irréversible.',
    });
    const cancelButton = screen.getByRole('button', { name: 'Annuler' });

    expect(screen.getByRole('dialog', { name: 'Supprimer le compte' })).toBeInTheDocument();
    expect(passwordInput).toHaveFocus();

    await user.tab();
    expect(keywordInput).toHaveFocus();

    await user.tab();
    expect(acknowledgementCheckbox).toHaveFocus();

    await user.tab();
    expect(cancelButton).toHaveFocus();

    await user.tab();
    expect(passwordInput).toHaveFocus();

    await user.tab({ shift: true });
    expect(cancelButton).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Supprimer le compte' })).not.toBeInTheDocument();
    });
    expect(openButton).toHaveFocus();
  });

  it('disables the cancel button while the delete dialog submission is locked', async () => {
    const user = userEvent.setup();

    render(<DeleteAccountDialogHarness submitting />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir la suppression' }));
    const cancelButton = screen.getByRole('button', { name: 'Annuler' });
    expect(cancelButton).toBeDisabled();
  });

  it('does not close the delete dialog on escape while submission is locked', async () => {
    const user = userEvent.setup();

    render(<DeleteAccountDialogHarness submitting />);

    await user.click(screen.getByRole('button', { name: 'Ouvrir la suppression' }));
    expect(screen.getByRole('dialog', { name: 'Supprimer le compte' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Supprimer le compte' })).toBeInTheDocument();
  });

  it('wires the shared tab bar and danger zone callbacks', async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    const onLogout = vi.fn();
    const onDeleteAccount = vi.fn();

    render(
      <div className="flex flex-col gap-4">
        <ProfileTabBar
          activeTab="appearance"
          ariaLabel="Sections du profil"
          onChange={onTabChange}
          tabs={[
            { id: 'appearance', icon: Settings, label: 'Apparence' },
            { id: 'security', icon: Shield, label: 'Sécurité' },
          ]}
        />
        <ProfileDangerZone
          className="mt-6"
          deleteLabel="Supprimer le compte"
          onDeleteAccount={onDeleteAccount}
          onLogout={onLogout}
          logoutLabel="Se déconnecter"
          title="Zone dangereuse"
        />
      </div>,
    );

    const dangerZone = screen.getByRole('heading', { name: 'Zone dangereuse' }).closest('section');

    expect(dangerZone).toHaveClass('mt-6');
    expect(screen.getByRole('tab', { name: 'Apparence' })).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('tab', { name: 'Sécurité' }));
    expect(onTabChange).toHaveBeenCalledWith('security');

    await user.click(screen.getByRole('button', { name: 'Se déconnecter' }));
    expect(onLogout).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Supprimer le compte' }));
    expect(onDeleteAccount).toHaveBeenCalledTimes(1);
  });
});
