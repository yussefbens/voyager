import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import { ListHeader } from "../../shared/formatting";
import BlurNsfw from "./BlurNsfw";
import PostSize from "./PostSize";

export default function Posts() {

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('posts')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <PostSize />
        <BlurNsfw />
      </IonList>
    </>
  );
}
