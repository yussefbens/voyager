import { useTranslation } from "react-i18next";
import { IonIcon, IonList, IonPicker, IonText } from "@ionic/react";
import { css } from "@emotion/react";
import { InsetIonItem, SettingLabel } from "./Profile";
import styled from "@emotion/styled";
import IncognitoSvg from "./incognito.svg?react";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import { updateConnectedInstance } from "../auth/authSlice";
import { swapHorizontalOutline } from "ionicons/icons";
import { getCustomServers } from "../../services/app";

const Incognito = styled(IncognitoSvg)`
  opacity: 0.1;
  width: 300px;
  height: 300px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

export default function LoggedOut() {
  const dispatch = useAppDispatch();
  const connectedInstance = useAppSelector(
    (state) => state.auth.connectedInstance,
  );
  const [pickerOpen, setPickerOpen] = useState(false);

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
          {t('change-the-instance')}
        </p>
      </IonText>
      <IonList inset>
        <InsetIonItem
          onClick={() => {
            setPickerOpen(true);
          }}
          detail
        >
          <IonIcon icon={swapHorizontalOutline} color="primary" />
          <SettingLabel>
            {t('connectedTo')} {connectedInstance}{" "}
            <IonText color="medium">{t('asGuest')}</IonText>
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
