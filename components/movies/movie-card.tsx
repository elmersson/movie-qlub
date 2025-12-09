"use client";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import Image from "next/image";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useRouter } from "next/navigation";
import { TmdbVideoResult } from "@/types/tmdb";
import { useTheme } from "next-themes";
interface MovieCardVerticalProps {
  id: number;
  src: string;
  title: string;
  vote_average: number;
  vote_count: number;
  trailer?: TmdbVideoResult;
  onPlusClick?: () => void;
}
export function MovieCardVertical({
  id,
  src,
  title,
  vote_average,
  vote_count,
  trailer,
  onPlusClick,
}: MovieCardVerticalProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const href = `/protected/movies/${id}`;

  const handleCardClick = () => {
    router.push(href);
  };
  return (
    <div
      className="flex flex-col cursor-pointer justify-start items-center gap-[18px] p-3 rounded-[10px] bg-white hover:bg-neutral-400/20 dark:bg-neutral-400/5 dark:hover:bg-neutral-400/10 transition duration-75"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
    >
      <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2.5">
        <Image
          src={src}
          alt={title}
          width={204}
          height={298}
          className="flex-grow-0 flex-shrink-0 w-[204px] h-[298px] rounded-[5px] object-cover"
        />
        <button
          aria-label="Add to Watchlist"
          className="
            absolute left-[19px] top-0 w-[39px] h-[50.5px] 
            hover:opacity-80 transition disabled:hidden
          "
          onClick={(e) => {
            e.stopPropagation();
            onPlusClick?.();
          }}
          disabled={!onPlusClick}
        >
          <svg width="42" height="53" viewBox="0 0 42 53" fill="none">
            <path
              d="M1.5 50.5V0H21H40.5V50.5L22 43.5L1.5 50.5Z"
              fill="#1A1A1A"
              fillOpacity="0.7"
            />
            <path
              d="M0.5 1.19209e-07V52L22.0513 44.5149L41.5 52V0"
              stroke="#A3A3A3"
              strokeOpacity="0.4"
            />
            <path
              d="M26.5 23H21.5V28C21.5 28.55 21.05 29 20.5 29C19.95 29 19.5 28.55 19.5 28V23H14.5C13.95 23 13.5 22.55 13.5 22C13.5 21.45 13.95 21 14.5 21H19.5V16C19.5 15.45 19.95 15 20.5 15C21.05 15 21.5 15.45 21.5 16V21H26.5C27.05 21 27.5 21.45 27.5 22C27.5 22.55 27.05 23 26.5 23Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative gap-5">
        <TypographyH4 className="line-clamp-1">{title}</TypographyH4>
        <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[204px] h-[29px]">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-[42px] gap-2.5 px-[7px] rounded-[10px]">
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
                  d="M14.3096 9.5525L12.8396 4.7125C12.5496 3.7625 11.2096 3.7625 10.9296 4.7125L9.4496 9.5525H4.9996C4.0296 9.5525 3.6296 10.8025 4.4196 11.3625L8.0596 13.9625L6.6296 18.5725C6.3396 19.5025 7.4196 20.2525 8.1896 19.6625L11.8796 16.8625L15.5696 19.6725C16.3396 20.2625 17.4196 19.5125 17.1296 18.5825L15.6996 13.9725L19.3396 11.3725C20.1296 10.8025 19.7296 9.5625 18.7596 9.5625H14.3096V9.5525Z"
                  fill="#29BE88"
                ></path>
              </svg>
              <TypographyP className="flex-grow-0 flex-shrink-0 text-lg text-left">
                {vote_average.toFixed(1)}
              </TypographyP>
            </div>
          </div>
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 h-[37px] gap-2.5 px-[9px] rounded-[10px]">
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
                  d="M19.6501 9.04L14.8101 8.62L12.9201 4.17C12.5801 3.36 11.4201 3.36 11.0801 4.17L9.19007 8.63L4.36007 9.04C3.48007 9.11 3.12007 10.21 3.79007 10.79L7.46007 13.97L6.36007 18.69C6.16007 19.55 7.09007 20.23 7.85007 19.77L12.0001 17.27L16.1501 19.78C16.9101 20.24 17.8401 19.56 17.6401 18.7L16.5401 13.97L20.2101 10.79C20.8801 10.21 20.5301 9.11 19.6501 9.04ZM12.0001 15.4L8.24007 17.67L9.24007 13.39L5.92007 10.51L10.3001 10.13L12.0001 6.1L13.7101 10.14L18.0901 10.52L14.7701 13.4L15.7701 17.68L12.0001 15.4Z"
                  fill={theme === "light" ? "#797979" : "#C3C3C3"}
                ></path>
              </svg>
              <TypographyP className="flex-grow-0 flex-shrink-0 text-lg text-left">
                Rate
              </TypographyP>
            </div>
          </div>
          <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-[8.333333015441895px] px-2.5 rounded-[63.33px]">
            <Tooltip>
              <TooltipTrigger>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M9.99996 1.6665C5.39996 1.6665 1.66663 5.39984 1.66663 9.99984C1.66663 14.5998 5.39996 18.3332 9.99996 18.3332C14.6 18.3332 18.3333 14.5998 18.3333 9.99984C18.3333 5.39984 14.6 1.6665 9.99996 1.6665ZM9.99996 14.1665C9.54163 14.1665 9.16663 13.7915 9.16663 13.3332V9.99984C9.16663 9.5415 9.54163 9.1665 9.99996 9.1665C10.4583 9.1665 10.8333 9.5415 10.8333 9.99984V13.3332C10.8333 13.7915 10.4583 14.1665 9.99996 14.1665ZM10.8333 7.49984H9.16663V5.83317H10.8333V7.49984Z"
                    fill={theme === "light" ? "#C3C3C3" : "#797979"}
                  ></path>
                </svg>
              </TooltipTrigger>
              <TooltipContent>
                <TypographyP className="text-neutral-100 dark:text-neutral-950">
                  Vote count: {vote_count}
                </TypographyP>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="w-full gap-2.5 hover:bg-neutral-400/50 items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
              disabled={!trailer}
            >
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
                  d="M7 6.82025L7 17.1803C7 17.9703 7.87 18.4503 8.54 18.0203L16.68 12.8403C17.3 12.4503 17.3 11.5503 16.68 11.1503L8.54 5.98025C7.87 5.55025 7 6.03025 7 6.82025Z"
                  fill={theme === "light" ? "#797979" : "#C3C3C3"}
                ></path>
              </svg>
              <TypographyP className="flex-grow-0 flex-shrink-0 text-base text-left">
                Trailer
              </TypographyP>
            </Button>
          </DialogTrigger>
          <DialogContent
            onClick={(e) => e.stopPropagation()}
            showCloseButton={false}
            className="p-0"
          >
            <DialogTitle className="hidden">Test</DialogTitle>
            <div className="aspect-video relative">
              <iframe
                src={`https://www.youtube.com/embed/${trailer?.key}`}
                title={trailer?.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0 rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
