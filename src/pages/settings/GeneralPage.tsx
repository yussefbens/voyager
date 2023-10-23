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
import GeneralSettings from "../../features/settings/general/GeneralSettings";

export default function GeneralPage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('general')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <GeneralSettings />
      </AppContent>
    </IonPage>
  );
}
