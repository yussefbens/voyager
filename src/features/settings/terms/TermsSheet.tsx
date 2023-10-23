import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Terms from "./Terms";

interface TermsSheetProps {
  onDismiss: (data?: string, role?: string) => void;
}

export default function TermsSheet({ onDismiss }: TermsSheetProps) {
  const { t,i18n } = useTranslation();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => onDismiss()}>
              {t('cancel')}
            </IonButton>
          </IonButtons>
          <IonTitle>{t('terms-only')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Terms />
      </IonContent>
    </IonPage>
  );
}
