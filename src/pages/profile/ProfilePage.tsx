import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonModal,
} from "@ionic/react";
import AsyncProfile from "../../features/user/AsyncProfile";
import { useAppDispatch, useAppSelector } from "../../store";
import { handleSelector, logoutAccount, usernameSelector } from "../../features/auth/authSlice";
import LoggedOut from "../../features/user/LoggedOut";
import AccountSwitcher from "../../features/auth/AccountSwitcher";
import { useContext } from "react";
import AppContent from "../../features/shared/AppContent";
import { PageContext } from "../../features/auth/PageContext";
import FeedContent from "../shared/FeedContent";

export default function ProfilePage() {
  const handle = useAppSelector(usernameSelector);
  const dispatch = useAppDispatch();
  const { pageRef, presentLoginIfNeeded } = useContext(PageContext);
  const accounts = useAppSelector((state) => state.auth.accountData?.accounts);
  const [presentAlert] = useIonAlert()

  const [presentAccountSwitcher, onDismissAccountSwitcher] = useIonModal(
    AccountSwitcher,
    {
      onDismiss: (data: string, role: string) =>
        onDismissAccountSwitcher(data, role),
      pageRef,
    },
  );

  const { t,i18n } = useTranslation();

  function logout() {
    presentAlert({
      header: t("logout") + "?",
      message: t("really-logout"),
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log('cancel')
          }
        },
        {
          text: "Yes",
          role: "confirm",
          handler: () => {
            dispatch(logoutAccount(accounts ? accounts[0].handle : ""));
          }
        }
      ]
    })
  }

  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          {handle ? (
            <>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => logout()}
                >
                  {t('logout')}
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
