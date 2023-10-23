import { useTranslation } from "react-i18next";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import AppearanceSettings from "../../features/settings/appearance/AppearanceSettings";

export default function AppearancePage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('appearance')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <AppearanceSettings />
      </AppContent>
    </IonPage>
  );
}
