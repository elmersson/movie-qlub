import { Chip } from "@/components/ui/chip";
import { TypographyLarge } from "@/components/ui/typography";

type RatingChipProps = {
  vote_average: number;
  vote_count: number;
};

export function RatingChip({ vote_average, vote_count }: RatingChipProps) {
  return (
    <Chip>
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-[5px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
          preserveAspectRatio="none"
        >
          <path
            d="M14.3096 9.5525L12.8396 4.7125C12.5496 3.7625 11.2096 3.7625 10.9296 4.7125L9.44957 9.5525H4.99957C4.02957 9.5525 3.62957 10.8025 4.41957 11.3625L8.05957 13.9625L6.62957 18.5725C6.33957 19.5025 7.41957 20.2525 8.18957 19.6625L11.8796 16.8625L15.5696 19.6725C16.3396 20.2625 17.4196 19.5125 17.1296 18.5825L15.6996 13.9725L19.3396 11.3725C20.1296 10.8025 19.7296 9.5625 18.7596 9.5625H14.3096V9.5525Z"
            fill="#29BE88"
          ></path>
        </svg>
        <div className="flex items-baseline gap-1">
          <TypographyLarge>{vote_average.toFixed(1)}</TypographyLarge>
          <TypographyLarge className="text-transparent-60">
            /10 ({vote_count}) K
          </TypographyLarge>
        </div>
      </div>
    </Chip>
  );
}
