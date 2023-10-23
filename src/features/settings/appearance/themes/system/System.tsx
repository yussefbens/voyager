import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import DarkMode from "./DarkMode";
import { ListHeader } from "../../../shared/formatting";
import DeviceMode from "./DeviceMode";
import { useAppSelector } from "../../../../../store";
import UserDarkMode from "./UserDarkMode";
import { isAndroid, isNative } from "../../../../../helpers/device";

export default function System() {
  const { usingSystemDarkMode } = useAppSelector(
    (state) => state.settings.appearance.dark,
  );

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('system')}</IonLabel>
      </ListHeader>
      <IonList inset>
        {!isNative() || isAndroid() ? <DeviceMode /> : undefined}
        <DarkMode />
      </IonList>

      {!usingSystemDarkMode && <UserDarkMode />}
    </>
  );
}
