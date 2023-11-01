import { useTranslation } from "react-i18next";
import React, { useState, useRef, useEffect, useContext } from "react";
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
import { login } from "./authSlice";
import { getClient } from "../../services/lemmy";
import { IonInputCustomEvent, componentOnReady } from "@ionic/core";
import TermsSheet from "../settings/terms/TermsSheet";
import { preventPhotoswipeGalleryFocusTrap } from "../gallery/GalleryImg";
import { getCustomServers } from "../../services/app";
import { isNative } from "../../helpers/device";
import { Browser } from "@capacitor/browser";
import useAppToast from "../../helpers/useAppToast";
import { PageContext } from "./PageContext";
import Register from "./Register";

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

export default function Login({
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
  const usernameRef = useRef<IonInputCustomEvent<never>["target"]>(null);
  const [loading, setLoading] = useState(false);
  const pageRef = useRef();
  const [needsTotp, setNeedsTotp] = useState(false);
  const [totp, setTotp] = useState("");
  const { t,i18n } = useTranslation();

  const [presentTerms, onDismissTerms] = useIonModal(TermsSheet, {
    onDismiss: (data: string, role: string) => onDismissTerms(data, role),
  });

  const [presentRegister, onDismissRegister] = useIonModal(Register, {
    onDismiss: (data: string, role: string) => onDismissRegister(data, role),
  });

  function presentNativeTerms() {
    Browser.open({ url: "https://statimes.app/terms.html" });
  }

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

    if (!username || !password) {
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
        login(server ?? customServerHostname, username, password, totp),
      );
    } catch (error) {
      if (error === "missing_totp_token") {
        setNeedsTotp(true);
        return;
      }

      if (error === "password_incorrect") {
        setPassword("");
      }

      presentToast({
        message: getLoginErrorMessage(error, server ?? customServer, t),
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
              <Centered>{t('login')} {loading && <Spinner color="dark" />}</Centered>
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
          {!serverConfirmed && (
            <>
              <HelperText>{t('chooseAccount')}</HelperText>
              <IonRadioGroup
                value={server}
                onIonChange={(e) => setServer(e.target.value)}
              >
                <IonList inset>
                  {servers.slice(0, 3).map((server) => (
                    <IonItem disabled={loading} key={server}>
                      <IonRadio value={server} key={server}>
                        {server}
                      </IonRadio>
                    </IonItem>
                  ))}
                  <IonItem disabled={loading}>
                    <IonRadio value={undefined} color="danger">
                      {t('other')}
                    </IonRadio>
                  </IonItem>
                </IonList>
              </IonRadioGroup>
              {server ? (
                <></>
              ) : (
                <>
                  <IonList inset>
                    <IonItem>
                      <IonInput
                        label="URL"
                        inputMode="url"
                        value={customServer}
                        onIonInput={(e) =>
                          setCustomServer(e.target.value as string)
                        }
                        disabled={loading}
                      />
                    </IonItem>
                  </IonList>
                </>
              )}

              {isNative() ? (
                <HelperText>
                  {t("agreeToTerms")}{" "}
                  <IonRouterLink onClick={presentNativeTerms}>
                    {t("termsOfUse")}
                  </IonRouterLink>
                </HelperText>
              ) : (
                <HelperText>
                  <IonRouterLink onClick={() => presentTerms()}>
                    {t('terms')}
                  </IonRouterLink>
                </HelperText>
              )}

              <HelperText>
                <IonRouterLink
                  href={JOIN_LEMMY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isNative()) return;

                    e.preventDefault();

                    Browser.open({ url: JOIN_LEMMY_URL });
                  }}
                >
                  <IonText color="primary">{t('dontHaveAccount')}</IonText>
                </IonRouterLink>
              </HelperText>
            </>
          )}
          {serverConfirmed && (
            <>
              <HelperText>
                {needsTotp ? (
                  <>
                    {t("enterSecondFactor")} {username}@
                    {server ?? customServer}
                  </>
                ) : (
                  <>{t('loginTo')} {t("startimes-mobile")}</>
                )}
              </HelperText>
              {!needsTotp ? (
                <>
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
                        enterkeyhint="done"
                      />
                    </IonItem>
                  </IonList>
                  {isNative() ? (
                    <HelperText>
                      {t("agreeToTerms")}{" "}
                      <IonRouterLink onClick={presentNativeTerms}>
                        {t("termsOfUse")}
                      </IonRouterLink>
                    </HelperText>
                  ) : (
                    <HelperText>
                      <IonRouterLink onClick={() => presentTerms()}>
                        {t('terms')}
                      </IonRouterLink>
                    </HelperText>
                  )}

                  <HelperText>
                    <IonRouterLink
                      onClick={(e) => {
                        e.preventDefault();
                        //Browser.open({ url: JOIN_LEMMY_URL });
                        presentRegister()
                      }}
                    >
                      <IonText color="primary">{t('dontHaveAccount')}</IonText>
                    </IonRouterLink>
                  </HelperText>
                </>
              ) : (
                <IonList inset>
                  <IonItem>
                    <IonInput
                      label={t("2fa")}
                      value={totp}
                      onIonInput={(e) => setTotp(e.target.value as string)}
                      disabled={loading}
                      enterkeyhint="done"
                    />
                  </IonItem>
                </IonList>
              )}
            </>
          )}
        </IonContent>
      </IonPage>
    </form>
  );
}

function getLoginErrorMessage(error: unknown, instanceActorId: string, t: any): string {
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
    default:
      return t("connectionError");
  }
}
