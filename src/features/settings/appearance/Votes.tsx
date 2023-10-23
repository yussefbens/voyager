import { useTranslation } from "react-i18next";
import { IonLabel, IonList } from "@ionic/react";
import { useAppSelector } from "../../../store";
import { setVoteDisplayMode } from "../settingsSlice";
import { OVoteDisplayMode, VoteDisplayMode } from "../../../services/db";
import SettingSelector from "../shared/SettingSelector";
import { ListHeader } from "../shared/formatting";

export default function Votes() {
  const voteDisplayMode = useAppSelector(
    (state) => state.settings.appearance.voting.voteDisplayMode,
  );

  const Selector = SettingSelector<VoteDisplayMode>;

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('votes')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <Selector
          title={t('displayVotes')}
          selected={voteDisplayMode}
          setSelected={setVoteDisplayMode}
          options={OVoteDisplayMode}
        />
      </IonList>
    </>
  );
}
