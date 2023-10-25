import { useTranslation } from "react-i18next";
import { IonIcon, IonList, IonPicker, IonText } from "@ionic/react";
import { css } from "@emotion/react";
import { InsetIonItem, SettingLabel } from "./Profile";
import styled from "@emotion/styled";
import IncognitoSvg from "./incognito.svg?react";
import { useAppDispatch, useAppSelector } from "../../store";
import { useContext, useState } from "react";
import { updateConnectedInstance } from "../auth/authSlice";
import { swapHorizontalOutline, logIn } from "ionicons/icons";
import { getCustomServers } from "../../services/app";
import { PageContext } from "../auth/PageContext";

const Incognito = styled(IncognitoSvg)`
  opacity: 0.1;
  width: 300px;
  height: 300px;
  display: block;
  margin: auto;
`;

export default function LoggedOut() {
  const dispatch = useAppDispatch();
  const connectedInstance = useAppSelector(
    (state) => state.auth.connectedInstance,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const { pageRef, presentLoginIfNeeded } = useContext(PageContext);

  const { t,i18n } = useTranslation();

  return (
    <>
      <IonText color="medium">
        <p
          css={css`
            font-size: 0.875em;
            padding: 1rem;
          `}
        >
          {t('logged-out')}
        </p>
      </IonText>
      <IonList inset>
        <InsetIonItem
          onClick={() => {
            presentLoginIfNeeded()
          }}
          detail
        >
          <IonIcon icon={logIn} color="primary" />
          <SettingLabel>
            <IonText color="medium">{t('login-now')}</IonText>
          </SettingLabel>
        </InsetIonItem>
      </IonList>
      <IonPicker
        isOpen={pickerOpen}
        onDidDismiss={() => setPickerOpen(false)}
        columns={[
          {
            name: "server",
            options: getCustomServers().map((server) => ({
              text: server,
              value: server,
            })),
          },
        ]}
        buttons={[
          {
            text: t('cancel'),
            role: "cancel",
          },
          {
            text: t('confirm'),
            handler: (value) => {
              dispatch(updateConnectedInstance(value.server.value));
            },
          },
        ]}
      />
      <Incognito />
    </>
  );
}
