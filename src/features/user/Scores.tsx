import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { PersonAggregates } from "lemmy-js-client";
import { formatNumber } from "../../helpers/number";
import Ago from "../labels/Ago";
import { useIonAlert } from "@ionic/react";
import { formatDistanceToNowStrict } from "date-fns";
import { fixLemmyDateString } from "../../helpers/date";

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 3rem;
  margin: 1.5rem 3rem;
`;

const Score = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;

  aside {
    margin-top: 0.35rem;
    opacity: 0.5;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

interface ScoreProps {
  aggregates: PersonAggregates;
  accountCreated: string;
}

export default function Scores({ aggregates, accountCreated }: ScoreProps) {
  const [present] = useIonAlert();
  const { t,i18n } = useTranslation();

  const relativeDate = formatDistanceToNowStrict(
    new Date(fixLemmyDateString(accountCreated)),
    {
      addSuffix: false,
    },
  );
  const creationDate = new Date(accountCreated);

  const postScore = aggregates.post_score;
  const commentScore = aggregates.comment_score;
  const totalScore = postScore + commentScore;

  const showScoreAlert = async (focus: "post" | "comment") => {
    const postPointsLine = `${postScore.toLocaleString()} ${t('post-points')}`;
    const commentPointsLine = `${commentScore.toLocaleString()} ${t('comment-points')}`;

    const totalScoreLine = `${totalScore.toLocaleString()} ${t('total-points')}`;

    const header = focus === "post" ? postPointsLine : commentPointsLine;

    const message = [
      focus === "post" ? commentPointsLine : postPointsLine,
      totalScoreLine,
    ];

    await present({
      header,
      cssClass: "preserve-newlines",
      message: message.join("\n"),
      buttons: [{ text: t('ok') }],
    });
  };

  return (
    <>
      <Container>
        <Score
          onClick={() => {
            showScoreAlert("comment");
          }}
        >
          {formatNumber(aggregates.comment_score)}
          <aside>{t('commentScore')}</aside>
        </Score>
        <Score
          onClick={() => {
            showScoreAlert("post");
          }}
        >
          {formatNumber(aggregates.post_score)}
          <aside>{t('postScore')}</aside>
        </Score>
        <Score
          onClick={() => {
            present({
              header: `${t('account-is')} ${relativeDate} ${t('old')}`,
              message: `${t('created-on')} ${creationDate.toDateString()} ${t('at')} ${creationDate.toLocaleTimeString()}`,
              buttons: [{ text: t('ok') }],
            });
          }}
        >
          <Ago date={accountCreated} />
          <aside>{t('accountAge')}</aside>
        </Score>
      </Container>
    </>
  );
}
