import { useTranslation } from "react-i18next";
import { IonBackButton } from "@ionic/react";
// import { useState } from "react";

interface AppBackButtonProps {
  defaultText?: string;
  defaultHref?: string;
}

export default function AppBackButton({
  // defaultText,
  defaultHref,
}: AppBackButtonProps) {
  // Totally a hack, but I haven't found a better solution
  // const [lastPageTitle] = useState(
  //   (() => {
  //     const hiddenPages = document.querySelectorAll(".ion-page");
  //     if (!hiddenPages.length) return;

  //     return hiddenPages[hiddenPages.length - 1]
  //       .querySelector(".title-default")
  //       ?.textContent?.trim();
  //   })()
  // );

  const { t,i18n } = useTranslation();

  return (
    <IonBackButton
      // text={lastPageTitle ?? defaultText}
      text={t('back')}
      defaultHref={defaultHref}
    />
  );
}
