import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import CollapsedByDefault from "../../general/comments/CollapsedByDefault";
import DefaultSort from "./DefaultSort";
import { ListHeader } from "../../shared/formatting";
import ShowJumpButton from "./ShowJumpButton";
import JumpButtonPosition from "./JumpButtonPosition";
import HighlightNewAccount from "./HighlightNewAccount";

export default function Comments() {

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('comments')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <CollapsedByDefault />
        <DefaultSort />
        <ShowJumpButton />
        <JumpButtonPosition />
        <HighlightNewAccount />
      </IonList>
    </>
  );
}
