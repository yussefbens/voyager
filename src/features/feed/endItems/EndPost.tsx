import styled from "@emotion/styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem 3rem 4rem;
  font-size: 0.875em;
  align-items: center;
  justify-content: center;
  color: var(--ion-color-medium);
`;

interface EndPostProps {
  empty?: boolean;
  communityName?: string;
  t?: any;
}

export default function EndPost({ empty, communityName, t }: EndPostProps) {
  const feedName = communityName ? `c/${communityName}` : t('this-feed');

  function renderError() {
    if (empty)
      return <>{t('nothing-to-see-here')} — {feedName} {t('is-completely-empty')}</>;

    return <>{t('you-reached-the-end')}</>;
  }

  return <Container>{renderError()}</Container>;
}
