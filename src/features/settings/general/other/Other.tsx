import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import { ListHeader } from "../../shared/formatting";
import Haptics from "./Haptics";
import ProfileTabLabel from "./ProfileTabLabel";
import LinkHandler from "./LinkHandler";

export default function Other() {

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('other')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <LinkHandler />
        <ProfileTabLabel />
        <Haptics />
      </IonList>
    </>
  );
}
