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
import SwipeSettings from "../../features/settings/gestures/SwipeSettings";

export default function GesturesPage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('gestures')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <SwipeSettings />
      </AppContent>
    </IonPage>
  );
}
