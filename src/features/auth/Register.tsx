import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect } from "react";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonPage,
  IonItem,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonSpinner,
  IonList,
  IonText,
  IonRouterLink,
  useIonModal,
} from "@ionic/react";
import styled from "@emotion/styled";
import { useAppDispatch } from "../../store";
import { login, register } from "./authSlice";
import { getClient } from "../../services/lemmy";
import { IonInputCustomEvent, componentOnReady } from "@ionic/core";
import TermsSheet from "../settings/terms/TermsSheet";
import { preventPhotoswipeGalleryFocusTrap } from "../gallery/GalleryImg";
import { getCustomServers } from "../../services/app";
import { isNative } from "../../helpers/device";
import { Browser } from "@capacitor/browser";
import useAppToast from "../../helpers/useAppToast";

const JOIN_LEMMY_URL = "https://startimes.app/register";

export const Spinner = styled(IonSpinner)`
  width: 1.5rem;
`;

export const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const HelperText = styled.p`
  font-size: 0.9375em;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
`;

export default function Register({
  onDismiss,
}: {
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) {
  const presentToast = useAppToast();
  const dispatch = useAppDispatch();
  const [servers] = useState(getCustomServers());
  const [server, setServer] = useState(servers[0]);
  const [customServer, setCustomServer] = useState("");
  const [serverConfirmed, setServerConfirmed] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const usernameRef = useRef<IonInputCustomEvent<never>["target"]>(null);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef();
  const [needsTotp, setNeedsTotp] = useState(false);
  const [totp, setTotp] = useState("");
  const { t,i18n } = useTranslation();

  const customServerHostname = (() => {
    if (!customServer) return;

    try {
      return new URL(
        customServer.startsWith("https://")
          ? customServer
          : `https://${customServer}`,
      ).hostname;
    } catch (e) {
      return undefined;
    }
  })();

  useEffect(() => {
    if (!serverConfirmed) return;

    setTimeout(() => {
      // This hack is incredibly annoying
      usernameRef.current?.getInputElement().then((el) => el.focus());
    }, 200);
  }, [serverConfirmed]);

  useEffect(() => {
    setCustomServer("");
  }, [server]);

  async function submit() {
    if (!server && !customServer) {
      presentToast({
        message: t("enterInstance"),
        color: "danger",
        fullscreen: true,
      });
      return;
    }

    if (!serverConfirmed) {
      if (customServer) {
        if (!customServerHostname) {
          presentToast({
            message: `${customServer} ${t("notValid")}`,
            color: "danger",
            fullscreen: true,
          });

          return;
        }

        setLoading(true);
        try {
          await getClient(customServerHostname).getSite({});
        } catch (error) {
          presentToast({
            message: `${t("problemConn")} ${customServerHostname}. ${t("tryAgain")}`,
            color: "danger",
            fullscreen: true,
          });

          throw error;
        } finally {
          setLoading(false);
        }
      }

      setServerConfirmed(true);
      return;
    }

    if (!username || !password || !repeatPassword) {
      presentToast({
        message: t("fillout"),
        color: "danger",
        fullscreen: true,
      });
      return;
    }

    if (!totp && needsTotp) {
      presentToast({
        message: `${t('secondFactor')} ${username}`,
        color: "danger",
        fullscreen: true,
      });
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        register(server ?? customServerHostname, username, password, repeatPassword, totp),
      );
    } catch (error) {
      if (error === "missing_totp_token") {
        setNeedsTotp(true);
        return;
      }

      if (error === "password_incorrect") {
        setPassword("");
        setRepeatPassword("");
      }

      presentToast({
        message: getRegisterErrorMessage(error, server ?? customServer, t),
        color: "danger",
        fullscreen: true,
      });

      throw error;
    } finally {
      setLoading(false);
    }

    onDismiss();
    presentToast({
      message: t('loginSuccess'),
      color: "success",
    });
  }

  return (
    <form
      {...preventPhotoswipeGalleryFocusTrap}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <input type="submit" /> {/* Hack */}
      <IonPage ref={pageRef}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton
                color="medium"
                onClick={() => {
                  // if (serverConfirmed) {
                  //   setServerConfirmed(false);
                  //   setNeedsTotp(false);
                  //   setUsername("");
                  //   setPassword("");
                  //   setTotp("");
                  //   return;
                  // }

                  onDismiss();
                }}
              >
                {serverConfirmed ? t("cancel") : t("cancel")}
              </IonButton>
            </IonButtons>
            <IonTitle>
              <Centered>{t("register")} {loading && <Spinner color="dark" />}</Centered>
            </IonTitle>
            <IonButtons slot="end">
              <IonButton
                strong={true}
                type="submit"
                disabled={!server && !customServer}
              >
                {serverConfirmed ? t('confirm') : t('next')}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
        <IonList inset>
            <IonItem>
                <IonInput
                ref={usernameRef}
                label={t('username')}
                autocomplete="username"
                inputMode="email"
                value={username}
                onIonInput={(e) => setUsername(e.target.value as string)}
                disabled={loading}
                />
            </IonItem>
            <IonItem>
                <IonInput
                label={t("password")}
                autocomplete="current-password"
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.target.value as string)}
                disabled={loading}
                minlength={10}
                maxlength={60}
                enterkeyhint="done"
                />
            </IonItem>
            <IonItem>
                <IonInput
                label={t("repeat-password")}
                type="password"
                value={repeatPassword}
                onIonInput={(e) => setRepeatPassword(e.target.value as string)}
                disabled={loading}
                minlength={10}
                maxlength={60}
                enterkeyhint="done"
                />
            </IonItem>
            </IonList>
        </IonContent>
      </IonPage>
    </form>
  );
}

function getRegisterErrorMessage(error: unknown, instanceActorId: string, t: any): string {
  console.log('register error', error)
  switch (error) {
    case "incorrect_totp token": // This might be a typo? Included "correct" case below
    case "incorrect_totp_token":
      return t("incorrectSecondFactor");
    case "couldnt_find_that_username_or_email":
      return `${t("userNotFound")} ${instanceActorId}?`;
    case "password_incorrect":
      return t("incorrectPassword");
    case "incorrect_login":
      return t("incorrectLogin");
    case "email_not_verified":
      return `${t("emailNotVertified")} https://${instanceActorId}.`;
    case "site_ban":
      return t("banned");
    case "deleted":
      return t("deleted");
    case "passwords_do_not_match":
      return t("passwords_do_not_match")
    case "user_already_exists":
      return t("user_already_exists")
    default:
      return String(error);
  }
}
