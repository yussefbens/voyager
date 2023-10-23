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
import Terms from "../../features/settings/terms/Terms";

export default function TermsPage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text="Settings" />
          </IonButtons>

          <IonTitle>{t('terms-only')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <Terms />
      </AppContent>
    </IonPage>
  );
}
