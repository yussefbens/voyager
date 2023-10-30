import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonModal,
} from "@ionic/react";
import AsyncProfile from "../../features/user/AsyncProfile";
import { useAppSelector } from "../../store";
import { handleSelector, usernameSelector } from "../../features/auth/authSlice";
import LoggedOut from "../../features/user/LoggedOut";
import AccountSwitcher from "../../features/auth/AccountSwitcher";
import { useContext } from "react";
import AppContent from "../../features/shared/AppContent";
import { PageContext } from "../../features/auth/PageContext";
import FeedContent from "../shared/FeedContent";

export default function ProfilePage() {
  const handle = useAppSelector(usernameSelector);
  const { pageRef, presentLoginIfNeeded } = useContext(PageContext);

  const [presentAccountSwitcher, onDismissAccountSwitcher] = useIonModal(
    AccountSwitcher,
    {
      onDismiss: (data: string, role: string) =>
        onDismissAccountSwitcher(data, role),
      pageRef,
    },
  );

  const { t,i18n } = useTranslation();

  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          {handle ? (
            <>
              <IonButtons slot="start">
                <IonButton
                  onClick={() => presentAccountSwitcher({ cssClass: "small" })}
                >
                  {t('accounts')}
                </IonButton>
              </IonButtons>

              <IonTitle>{handle}</IonTitle>
            </>
          ) : (
            <>
              <IonTitle>{t('anonymous')}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => presentLoginIfNeeded()}>
                  {t('login')}
                </IonButton>
              </IonButtons>
            </>
          )}
        </IonToolbar>
      </IonHeader>

      {handle ? (
        <FeedContent>
          <AsyncProfile handle={handle} />
        </FeedContent>
      ) : (
        <AppContent>
          <LoggedOut />
        </AppContent>
      )}
    </IonPage>
  );
}
