import { useTranslation } from "react-i18next";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import GeneralSettings from "../../features/settings/general/GeneralSettings";
import LanguageSwitcher from "../../features/settings/language/LanguageSwitcher";
import { ListHeader } from "../../features/settings/shared/formatting";

export default function LanguagePage() {
  const { t, i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/settings" text={t('settings')} />
          </IonButtons>

          <IonTitle>{t('language')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <IonList inset>
          <LanguageSwitcher />
        </IonList>
      </AppContent>
    </IonPage>
  );
}
