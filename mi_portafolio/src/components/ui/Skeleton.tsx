
import Skeleton from "@mui/material/Skeleton";

type SectionSkeletonProps = {
  title: string;
  isAltBackground?: boolean;
};

export const SectionSkeleton = ({ title, isAltBackground }: SectionSkeletonProps) => (
  <section
    aria-label={`Cargando ${title}`}
    className={`py-20 px-4 ${isAltBackground ? "bg-muted/30" : ""}`}
  >
    <div className="container mx-auto space-y-4  px-7 "  role="status">
      <Skeleton variant="text" width={192} height={28} />
      <div className="space-y-3">
        <Skeleton variant="text" height={20} />
        <Skeleton variant="rectangular" height={72} />
      </div>
    </div>
  </section>
);