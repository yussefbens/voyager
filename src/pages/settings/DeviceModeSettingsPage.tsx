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
import SelectDeviceMode from "../../features/settings/appearance/themes/system/SelectDeviceMode";

export default function DeviceModeSettingsPage() {
  const { t,i18n } = useTranslation();
  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/settings/appearance"
              text="Appearance"
            />
          </IonButtons>

          <IonTitle>{t('device-mode')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <SelectDeviceMode />
      </AppContent>
    </IonPage>
  );
}
