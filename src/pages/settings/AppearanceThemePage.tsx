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
import Theme from "../../features/settings/appearance/themes/Theme";

export default function AppearanceThemePage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('theme')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <Theme />
      </AppContent>
    </IonPage>
  );
}
