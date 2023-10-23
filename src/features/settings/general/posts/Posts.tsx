import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import { InsetIonItem } from "../../../user/Profile";
import { ListHeader } from "../../shared/formatting";

export default function Posts() {

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('posts')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <InsetIonItem routerLink="/settings/general/hiding">
          <IonLabel>{t('mark-read-hiding-posts')}</IonLabel>
        </InsetIonItem>
      </IonList>
    </>
  );
}
