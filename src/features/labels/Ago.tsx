import { formatDistanceToNowStrict } from "date-fns";
import { fixLemmyDateString } from "../../helpers/date";
import { useTranslation } from "react-i18next";

interface AgoProps {
  date: string;
  className?: string;
}

export default function Ago({ date, className }: AgoProps) {
  const { t,i18n } = useTranslation();
  
  return <span className={className}>{formatRelative(date, t)}</span>;
}

export function formatRelative(date: string, t: any): string {
  const relativeDate = formatDistanceToNowStrict(
    new Date(fixLemmyDateString(date)),
    {
      addSuffix: false,
    },
  );

  return getRelativeDateString(relativeDate, t);
}

const getRelativeDateString = (relativeDate: string, t: any) => {
  const [value, unit] = relativeDate.split(" ");

  switch (unit) {
    case "seconds":
    case "second":
      return t ? `<1${t("minute-short")}` : '';
    case "minutes":
    case "minute":
      return t ? `${value}${t("minute-short")}`: '';
    case "hours":
    case "hour":
      return t ? `${value}${t("hour-short")}`: '';
    case "days":
    case "day":
      return t ? `${value}${t("day-short")}`: '';
    case "months":
    case "month":
      return t ? `${value}${t("month-short")}`: '';
    case "years":
    case "year":
      return t ? `${value}${t("year-short")}`: '';
    default:
      return relativeDate;
  }
};
