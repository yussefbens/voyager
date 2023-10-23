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
import AppIcon from "../../features/settings/app-icon/AppIcon";

export default function AppIconPage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('app-icon')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <AppIcon />
      </AppContent>
    </IonPage>
  );
}
