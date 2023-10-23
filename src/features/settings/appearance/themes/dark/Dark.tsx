import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import { ListHeader } from "../../../shared/formatting";
import PureBlack from "./PureBlack";

export default function Dark() {

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>Dark Mode</IonLabel>
      </ListHeader>

      <IonList inset>
        <PureBlack />
      </IonList>
    </>
  );
}
