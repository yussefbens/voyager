import styled from "@emotion/styled";
import {
  calculateIsCakeDay,
  calculateNewAccount,
  fixLemmyDateString,
} from "../../../helpers/date";
import { useAppSelector } from "../../../store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const NewAccountBadge = styled.span`
  color: #ff8000;
`;

interface AgeBadgeProps {
  published: string;
}

export default function AgeBadge({ published }: AgeBadgeProps) {
  const highlightNewAccount = useAppSelector(
    (state) => state.settings.general.comments.highlightNewAccount,
  );
  const { t,i18n } = useTranslation();

  const ageBadgeData = useMemo(() => {
    const publishedDate = new Date(fixLemmyDateString(published));

    if (calculateIsCakeDay(publishedDate)) return { type: "cake" } as const;

    const days = calculateNewAccount(publishedDate);

    if (days !== undefined) {
      return { type: "new", days } as const;
    }
  }, [published]);

  if (!ageBadgeData) return;

  switch (ageBadgeData.type) {
    case "cake":
      return " 🍰";
    case "new": {
      if (!highlightNewAccount) return;

      return (
        <NewAccountBadge>
          {" "}
          👶 {formatDaysOld(ageBadgeData.days, t)}
        </NewAccountBadge>
      );
    }
  }
}

function formatDaysOld(days: number, t: any): string {
  switch (days) {
    case 0:
      return `<1${t("minute-short")}`;
    default:
      return `${days}${t("day-short")}`;
  }
}
