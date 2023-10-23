import { useTranslation } from "react-i18next";
import { IonActionSheet, IonButton, IonIcon } from "@ionic/react";
import { useAppDispatch } from "../../store";
import { checkmarkDone } from "ionicons/icons";
import { useState } from "react";
import { markAllRead } from "../../features/inbox/inboxSlice";

export default function MarkAllAsReadButton() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const { t,i18n } = useTranslation();

  return (
    <>
      <IonButton onClick={() => setOpen(true)}>
        <IonIcon icon={checkmarkDone} />
      </IonButton>

      <IonActionSheet
        isOpen={open}
        buttons={[
          {
            text: t('mark-all-read'),
            role: "read",
          },
          {
            text: t('cancel'),
            role: "cancel",
          },
        ]}
        onDidDismiss={() => setOpen(false)}
        onWillDismiss={async (e) => {
          if (e.detail.role === "read") {
            dispatch(markAllRead());
          }
        }}
      />
    </>
  );
}
